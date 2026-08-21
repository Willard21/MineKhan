import { seedHash, perlin } from "./random.js"
import { Chunk } from "./chunk.js"
import { animateTextures } from './texture.js'
import { BitArrayBuilder, BitArrayReader, decompressString } from './utils.js'
import { InventoryItem } from "./inventory.js"
import { bigArray, gl, glLocations, indexBuffer, program3D, program3DFogless, programEntity, skybox } from './glUtils.js'
import { STAIR, SOUTH, EAST, WEST } from "./shapes.js"
import { blockData } from "./blockData.js"

let generatedChunks = 0
let fogDist = 0
let caves = true
let settings = {}
let details = true
let superflat = true
const win = window.parent
const maxHeight = 256
const blockLog = {}
const currentUser = "Player"
const multiplayer = false
const { min, max, round } = Math
const p = {}
let yieldThread
{
	// await yieldThread() will pause the current task until the event loop is cleared
	const channel = new MessageChannel()
	let res
	channel.port1.onmessage = () => res()
	yieldThread = () => {
		return new Promise(resolve => {
			res = resolve
			channel.port2.postMessage("")
		})
	}
}

const chunkDist = (c) => {
	let dx = p.x - c.x
	let dz = p.z - c.z
	if (dx > 16) {
		dx -= 16
	}
	else if (dx > 0) {
		dx = 0
	}
	if (dz > 16) {
		dz -= 16
	}
	else if (dz > 0) {
		dz = 0
	}
	return Math.sqrt(dx * dx + dz * dz)
}

const renderFilter = (chunk) => {
	const d = settings.renderDistance + Math.SQRT1_2
	return chunk.distSq <= d * d
}

const debug = (message) => {
	let ellapsed = performance.now() - debug.start
	if (ellapsed > 30) {
		console.log(message, ellapsed.toFixed(2), "milliseconds")
	}
}

class World {
	/** @param {import('./game.js').game} game  */
	constructor(game) {
		this.setSeed(Math.random() * 2000000000 | 0)

		generatedChunks = 0
		fogDist = 16

		// Initialize the world's arrays
		this.loaded = []
		this.sortedChunks = [] // What gets rendered
		this.doubleRenderChunks = [] // What gets rendered with water
		this.offsetX = 0
		this.offsetZ = 0
		this.lwidth = 0
		this.chunkGenQueue = []
		this.populateQueue = []
		this.generateQueue = []
		this.lightingQueue = []
		this.loadQueue = []
		this.meshQueue = []
		this.loadFrom = {}
		this.entities = []
		this.lastChunk = "," // Chunk the player was standing in in the last tick
		this.caves = caves
		this.initTime = Date.now()
		this.tickCount = 0
		this.settings = settings
		this.lastTick = performance.now()
		this.rivers = true

		this.doCaveGen = game.worldSettings.caves
		this.doTreeGen = game.worldSettings.trees
		this.superflat = game.worldSettings.superflat
	}
	setSeed(seed) {
		this.seed = seed
		seedHash(seed)
		perlin.seed = seed
		while(win.workers.length) {
			win.doWork({ seed })
		}
	}

	updateBlock(x, y, z) {
		const chunk = this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ]
		if (chunk.buffer) {
			chunk.updateBlock(x & 15, y, z & 15, this)
		}
	}
	getChunk(x, z) {
		let X = (x >> 4) + this.offsetX
		let Z = (z >> 4) + this.offsetZ
		return this.loaded[X * this.lwidth + Z]
	}
	getBlock(x, y, z) {
		if (y > maxHeight) {
			// debugger
			return 0
		}
		return this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].getBlock(x & 15, y, z & 15)
	}
	getSurfaceHeight(x, z) {
		return this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].tops[(x & 15) * 16 + (z & 15)]
	}
	spawnBlock(x, y, z, blockID) {
		// Sets a block if it was previously air. Only to be used in world gen.
		// Currently only used in chunk.populate()

		let chunk = this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ]

		x &= 15
		z &= 15
		if (!chunk.getBlock(x, y, z)) {
			chunk.setBlock(x, y, z, blockID)
			// let i = x * 16 + z
			// if (y > chunk.tops[i]) chunk.tops[i] = y
			if (y > chunk.maxY) chunk.maxY = y
		}
	}
	setWorldBlock(x, y, z, blockID) {
		// Sets a block during world gen.
		this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].setBlock(x & 15, y, z & 15, blockID, false)
	}
	setBlock(x, y, z, blockID, lazy, remote, doNotLog) {

		// Get the chunk if it's loaded, otherwise just set the block in the load data.
		const chunkX = (x >> 4) + this.offsetX
		const chunkZ = (z >> 4) + this.offsetZ
		let chunk = null
		if (chunkX >= 0 && chunkX < this.lwidth && chunkZ >= 0 && chunkZ < this.lwidth) chunk = this.loaded[chunkX * this.lwidth + chunkZ]
		if (!chunk?.loaded) {
			const str = `${x >> 4},${z >> 4}`
			if (!this.loadFrom[str]) this.loadFrom[str] = { edits: [] }
			if (!this.loadFrom[str].edits) this.loadFrom[str].edits = []
			this.loadFrom[str].edits[y * 256 + (x&15) * 16 + (z&15)] = blockID
			return
		}

		let xm = x & 15
		let zm = z & 15

		if (!remote && !doNotLog) {
			// Log your own blocks
			let oldBlock = chunk.getBlock(xm, y, zm)
			blockLog[currentUser.username].push([x, y, z, blockID, oldBlock, Date.now()])
		}
		if (blockID) {
			chunk.setBlock(xm, y, zm, blockID, !lazy)
			let data = blockData[blockID]
			if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
				this.updateLight(x, y, z, true, data.lightLevel)
			}
		}
		else {
			let data = blockData[chunk.getBlock(xm, y, zm)]
			chunk.deleteBlock(xm, y, zm, !lazy)
			if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
				this.updateLight(x, y, z, false, data.lightLevel)
			}
		}

		if (lazy) {
			return
		}

		if (multiplayer && !remote) {
			let data = [x, y, z, blockID]
			if (doNotLog) data.push(1)
			multiplayer.send(JSON.stringify({
				type: "setBlock",
				data: data
			}))
		}

		// Update the 6 adjacent blocks and 1 changed block
		if (xm && xm !== 15 && zm && zm !== 15) {
			chunk.updateBlock(xm - 1, y, zm, this)
			chunk.updateBlock(xm, y - 1, zm, this)
			chunk.updateBlock(xm + 1, y, zm, this)
			chunk.updateBlock(xm, y + 1, zm, this)
			chunk.updateBlock(xm, y, zm - 1, this)
			chunk.updateBlock(xm, y, zm + 1, this)
		}
		else {
			this.updateBlock(x - 1, y, z)
			this.updateBlock(x + 1, y, z)
			this.updateBlock(x, y - 1, z)
			this.updateBlock(x, y + 1, z)
			this.updateBlock(x, y, z - 1)
			this.updateBlock(x, y, z + 1)
		}

		chunk.updateBlock(xm, y, zm, this)

		// Update the corner chunks so shadows in adjacent chunks update correctly
		if (xm | zm === 0) {
			this.updateBlock(x - 1, y, z - 1)
		}
		if (xm === 15 && zm === 0) {
			this.updateBlock(x + 1, y, z - 1)
		}
		if (xm === 0 && zm === 15) {
			this.updateBlock(x - 1, y, z + 1)
		}
		if (xm & zm === 15) {
			this.updateBlock(x + 1, y, z + 1)
		}
	}
	getLight(x, y, z, blockLight) {
		let X = (x >> 4) + this.offsetX
		let Z = (z >> 4) + this.offsetZ
		if (blockLight === 1) return this.loaded[X * this.lwidth + Z].getBlockLight(x & 15, y, z & 15)
		else if (blockLight === 0) return this.loaded[X * this.lwidth + Z].getSkyLight(x & 15, y, z & 15)
		else return this.loaded[X * this.lwidth + Z].getLight(x & 15, y, z & 15)
	}
	setLight(x, y, z, level, blockLight) {
		let X = (x >> 4) + this.offsetX
		let Z = (z >> 4) + this.offsetZ

		if (this.loaded[X * this.lwidth + Z]) {
			if (blockLight === 1) this.loaded[X * this.lwidth + Z].setBlockLight(x & 15, y, z & 15, level)
			else if (blockLight === 0) this.loaded[X * this.lwidth + Z].setSkyLight(x & 15, y, z & 15, level)
			else this.loaded[X * this.lwidth + Z].setLight(x & 15, y, z & 15, level)
		}
	}
	updateLight(x, y, z, place, blockLight = 0) {
		let chunk = this.getChunk(x, z)
		if (!chunk) return
		let cx = x & 15
		let cz = z & 15
		let center = chunk.getSkyLight(cx, y, cz)
		let blight = chunk.getBlockLight(cx, y, cz)
		let up = this.getLight(x, y+1, z, 0)
		let down = this.getLight(x, y-1, z, 0)
		let north = this.getLight(x, y, z+1, 0)
		let south = this.getLight(x, y, z-1, 0)
		let east = this.getLight(x+1, y, z, 0)
		let west = this.getLight(x-1, y, z, 0)

		let spread = []
		if (!place) { // Block was removed; increase light levels
			if (up === 15) { // Removed block was under direct sunlight; fill light downward
				for (let i = y; i > 0; i--) {
					if (blockData[chunk.getBlock(cx, i, cz)].transparent) {
						chunk.setSkyLight(cx, i, cz, 15)
						spread.push(x, i, z)
					}
					else {
						break
					}
				}
				chunk.spreadLight(spread, 14, true, 0)
			}
			else { // Block wasn't in direct skylight; subtract 1 from the brightest neighboring tile and use that as the new light level
				center = max(up, down, north, south, east, west)
				if (center > 0) center -= 1
				this.setLight(x, y, z, center, 0)
				if (center > 1) {
					spread.push(x, y, z)
					chunk.spreadLight(spread, center - 1, true, 0)
				}
			}

			// Block light levels
			if (!blockLight || blockLight < blight) {
				spread.length = 0
				up = this.getLight(x, y+1, z, 1)
				down = this.getLight(x, y-1, z, 1)
				north = this.getLight(x, y, z+1, 1)
				south = this.getLight(x, y, z-1, 1)
				east = this.getLight(x+1, y, z, 1)
				west = this.getLight(x-1, y, z, 1)
				blight = max(up, down, north, south, east, west)
				if (blight > 0) blight -= 1
				this.setLight(x, y, z, blight, 1)
				if (blight > 1) {
					spread.push(x, y, z)
					chunk.spreadLight(spread, blight - 1, true, 1)
				}
			}
		}
		else if (place && (center !== 0 || blight !== 0)) { // Block was placed; decrease light levels
			let respread = []
			for (let i = 0; i <= 15; i++) respread[i] = []
			chunk.setLight(cx, y, cz, 0) // Set both skylight and blocklight to 0
			spread.push(x, y, z)

			// Sky light
			if (center === 15) {
				for (let i = y-1; i > 0; i--) {
					if (blockData[chunk.getBlock(cx, i, cz)].transparent) {
						chunk.setSkyLight(cx, i, cz, 0)
						spread.push(x, i, z)
					}
					else {
						break
					}
				}
			}
			chunk.unSpreadLight(spread, center - 1, respread, 0)
			chunk.reSpreadLight(respread, 0)

			// Block light
			if (blight) {
				respread.length = 0
				// for (let i = 0; i <= blight + 1; i++) respread[i] = []
				for (let i = 0; i <= 15; i++) respread[i] = []
				spread.length = 0
				spread.push(x, y, z)
				chunk.unSpreadLight(spread, blight - 1, respread, 1)
				chunk.reSpreadLight(respread, 1)
			}
		}
		if (place && blockLight) { // Light block was placed
			chunk.setBlockLight(cx, y, cz, blockLight)
			spread.length = 0
			spread.push(x, y, z)
			chunk.spreadLight(spread, blockLight - 1, true, 1)
		}
		else if (!place && blockLight) { // Light block was removed
			chunk.setBlockLight(cx, y, cz, 0)
			spread.push(x, y, z)
			let respread = []
			for (let i = 0; i <= 15; i++) respread[i] = []
			chunk.unSpreadLight(spread, blockLight - 1, respread, 1)
			chunk.reSpreadLight(respread, 1)
		}
	}

	fillReqs(x, z) {
		// Chunks must all be loaded first.
		let done = true
		for (let i = x - 4; i <= x + 4; i++) {
			for (let j = z - 4; j <= z + 4; j++) {
				let chunk = this.loaded[(i + this.offsetX) * this.lwidth + j + this.offsetZ]
				if (!chunk.generated) {
					this.generateQueue.push(chunk)
					done = false
				}

				if (!chunk.populated && i >= x - 3 && i <= x + 3 && j >= z - 3 && j <= z + 3) {
					this.populateQueue.push(chunk)
					done = false
				}

				if (!chunk.loaded && i >= x - 2 && i <= x + 2 && j >= z - 2 && j <= z + 2) {
					if (this.loadFrom[`${chunk.x >> 4},${chunk.z >> 4}`]) {
						this.loadQueue.push(chunk)
						done = false
					}
					else chunk.load()
				}

				if (!chunk.lit && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					this.lightingQueue.push(chunk)
					done = false
				}
			}
		}

		return done
	}
	async tick() {
		let pnow = performance.now()
		this.tickCount += multiplayer ? Math.round((pnow - this.lastTick) / 50) : 1
		this.lastTick = pnow

		if (this.addedTime) { // /time command was used
			this.tickCount += 50
			this.addedTime--
		}

		let maxChunkX = (p.x >> 4) + settings.renderDistance
		let maxChunkZ = (p.z >> 4) + settings.renderDistance
		let chunk = maxChunkX + "," + maxChunkZ
		if (chunk !== this.lastChunk) {
			this.lastChunk = chunk
			this.loadChunks()
			this.chunkGenQueue.sort(sortChunks)
		}

		if (controlMap.breakBlock.pressed && (p.lastBreak < now - 250 || p.autoBreak) && screen === "play") {
			changeWorldBlock(0)
		}

		for (let i = 0; i < this.sortedChunks.length; i++) {
			this.sortedChunks[i].tick()
		}

		for (let i = this.entities.length - 1; i >= 0; i--) {
			const entity = this.entities[i]
			entity.update()
			if (entity.canDespawn) {
				this.entities.splice(i, 1)
			}
		}

		// Make sure there's only 1 "world gen" loop running at a time
		if (this.ticking) return
		this.ticking = true

		let doneWork = true
		while (doneWork && (screen === "play" || screen === "loading")) {
			doneWork = false
			debug.start = performance.now()
			if (this.meshQueue.length) {
				// Update all chunk meshes.
				do {
					this.meshQueue.pop().genMesh(indexBuffer, bigArray)
				} while(this.meshQueue.length)
				doneWork = true
				debug("Meshes")
			}

			if (this.generateQueue.length && !doneWork) {
				let chunk = this.generateQueue.pop()
				chunk.generate()
				doneWork = true
			}

			// Carve caves, then place details
			if (this.populateQueue.length && !doneWork) {
				let chunk = this.populateQueue[this.populateQueue.length - 1]
				if (!chunk.caves) await chunk.carveCaves()
				else {
					chunk.populate(details)
					this.populateQueue.pop()
				}
				doneWork = true
			}

			// Load chunk
			if (!doneWork && this.loadQueue.length) {
				this.loadQueue.pop().load()
				doneWork = true
			}

			// Spread light
			if (!doneWork && this.lightingQueue.length) {
				let chunk = this.lightingQueue.pop()
				chunk.fillLight()
				doneWork = true
			}

			if (!doneWork && this.chunkGenQueue.length && !this.lightingQueue.length) {
				let chunk = this.chunkGenQueue[0]
				if (!fillReqs(chunk.x >> 4, chunk.z >> 4)) {
					// The requirements haven't been filled yet; don't do anything else.
				}
				else if (!chunk.optimized) {
					chunk.optimize(screen)
					debug("Optimize")
				}
				else if (!chunk.buffer) {
					chunk.genMesh(indexBuffer, bigArray)
					debug("Initial mesh")
				}
				else {
					this.chunkGenQueue.shift()
					generatedChunks++
					if (generatedChunks === 3000) {
						let ms = Date.now() - this.initTime
						console.log("3000 chunk seconds:", ms/1000, "\nms per chunk:", ms / 3000, "\nChunks per second:", 3000000 / ms)
					}
				}
				doneWork = true
			}

			// Yield the main thread to render passes
			if (doneWork) await yieldThread()
		}
		this.ticking = false
	}
	render() {
		// Was in tick(); moved here just for joseph lol
		if (controlMap.placeBlock.pressed && (p.lastPlace < now - 250 || p.autoBuild)) {
			lookingAt()
			newWorldBlock()
		}
		animateTextures(gl)

		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

		let time = 0
		let delta = performance.now() - this.lastTick
		if (!multiplayer && delta > 100) delta = 0
		time = this.tickCount * 50 + delta * (this.addedTime ? 51 : 1)

		p2.x = round(p.x)
		p2.y = round(p.y)
		p2.z = round(p.z)

		renderedChunks = 0

		let dist = Math.max(settings.renderDistance * 16 - 8, 16)
		if (this.chunkGenQueue.length) {
			let chunk = this.chunkGenQueue[0]
			dist = min(dist, chunkDist(chunk))
		}
		if (dist !== fogDist) {
			if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 30
			else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
			else fogDist = dist
		}

		gl.useProgram(program3D)
		gl.uniform3f(glLocations.uPos, p.x, p.y, p.z)
		gl.uniform1f(glLocations.uDist, fogDist)

		gl.useProgram(program3DFogless)
		gl.uniform3f(glLocations.uPosFogless, p.x, p.y, p.z)
		if (hitBox.pos) {
			p.transform()
			drawHitbox(p)
		}
		initModelView(p)

		let c = this.sortedChunks
		let glob = { renderedChunks } // An object so I can keep track of whether or not they're rendered.
		let fog = false
		for (let i = 0; i < c.length; i++) {
			if (!fog && fogDist < chunkDist(c[i]) + 24) {
				gl.useProgram(program3D)
				fog = true
			}
			c[i].render(p, glob)
		}

		skybox(time / 1000 + 150, matrix)
		use3d()
		gl.useProgram(program3DFogless)
		fog = false
		if (this.doubleRenderChunks.length) {
			gl.depthMask(false)
			gl.uniform1i(glLocations.uTransFogless, 1)
			for (let chunk of this.doubleRenderChunks) {
				if (!fog && fogDist < chunkDist(chunk) + 24) {
					gl.uniform1i(glLocations.uTransFogless, 0)
					gl.useProgram(program3D)
					gl.uniform1i(glLocations.uTrans, 1)
					fog = true
				}
				chunk.render(p, glob)
			}
			if (!fog) gl.uniform1i(glLocations.uTransFogless, 0)
			else gl.uniform1i(glLocations.uTrans, 0)
			gl.depthMask(true)
		}

		renderedChunks = glob.renderedChunks

		gl.disableVertexAttribArray(glLocations.aSkylight)
		gl.disableVertexAttribArray(glLocations.aBlocklight)
		gl.disableVertexAttribArray(glLocations.aShadow)
		// gl.uniform3f(glLocations.uPos, 0, 0, 0)

		// Render entities
		gl.useProgram(programEntity)
		for (let i = this.entities.length - 1; i >= 0; i--) {
			const entity = this.entities[i]
			entity.render()
		}

		// Render players
		if (multiplayer) {
			for (let name in playerEntities) {
				const entity = playerEntities[name]
				// entity.update()
				entity.render()
			}
		}

		// gl.useProgram(program3D)
	}
	loadChunks(cx, cz, sort = true, renderDistance = settings.renderDistance + 4) {
		cx ??= p.x >> 4
		cz ??= p.z >> 4
		p.cx = cx
		p.cz = cz
		const minChunkX = cx - renderDistance
		const maxChunkX = cx + renderDistance
		const minChunkZ = cz - renderDistance
		const maxChunkZ = cz + renderDistance

		this.offsetX = -minChunkX
		this.offsetZ = -minChunkZ
		this.lwidth = renderDistance * 2 + 1
		this.chunkGenQueue.length = 0
		this.lightingQueue.length = 0
		this.populateQueue.length = 0
		this.generateQueue.length = 0

		const chunks = new Array(this.lwidth * this.lwidth)
		for (let i = this.loaded.length - 1; i >= 0; i--) {
			const chunk = this.loaded[i]
			const chunkX = chunk.x >> 4
			const chunkZ = chunk.z >> 4

			// Delete every chunk outside the render distance.
			if (chunkX < minChunkX || chunkX > maxChunkX || chunkZ < minChunkZ || chunkZ > maxChunkZ) {
				chunk.unload()
				delete chunk.blocks
			}
			else { // Move the rest to their correct position
				chunks[(chunkX - minChunkX) * this.lwidth + chunkZ - this.minChunkZ] = chunk
			}
		}
		for (let x = minChunkX, i = 0; x <= maxChunkX; x++) {
			for (let z = minChunkZ; z <= maxChunkZ; z++, i++) {
				let chunk = chunks[i]
				if (!chunk) {
					chunks[i] = chunk = new Chunk(x * 16, z * 16, this)
				}

				const cdx = x - cx
				const cdz = z - cz
				chunk.distSq = cdx * cdx + cdz * cdz
				if (!chunk.buffer && renderFilter(chunk)) {
					this.chunkGenQueue.push(chunk)
				}
			}
		}
		this.loaded = chunks

		if (sort) {
			this.sortedChunks = this.loaded.filter(renderFilter)
			this.sortedChunks.sort(sortChunks)
			this.doubleRenderChunks = this.sortedChunks.filter(chunk => chunk.doubleRender)
		}
	}
	unloadChunks() {
		for (let chunk of this.loaded) {
			if (chunk.buffer) {
				gl.deleteBuffer(chunk.buffer)
				chunk.blocks = null
				chunk.light = null
			}
		}
	}
	getSaveString() {

		let bab = new BitArrayBuilder()
		bab.add(this.name.length, 8)
		for (let c of this.name) bab.add(c.charCodeAt(0), 8)
		version.split(" ")[1].split(".").map(n => bab.add(+n, 8))

		bab.add(this.seed, 32)
		bab.add(this.tickCount, 32)
		bab.add(round(p.x), 20).add(Math.min(round(p.y), 511), 9).add(round(p.z), 20)
		bab.add(p.rx * 100, 11).add(p.ry * 100, 11)
		bab.add(p.flying, 1).add(p.spectator, 1)
		bab.add(superflat, 1).add(caves, 1).add(details, 1).add(this.rivers, 1)

		for (let i = 0; i < inventory.playerStorage.size; i++) {
			const item = inventory.playerStorage.items[i]
			bab.add(item?.id || 0, 16).add(item?.stackSize - 1 || 0, 6)
		}
		bab.add(inventory.hotbar.index - inventory.hotbar.start, 4)

		for (let chunk of this.loaded) {
			let chunkData = chunk.getSave()
			if (chunkData) bab.append(chunkData)
		}

		// Chunks that aren't in the loaded area
		for (let coords in this.loadFrom) {
			const [x, z] = coords.split(",").map(n => n * 16)
			const chunk = new Chunk(x, z, this)

			if (this.version < "Alpha 0.8.1" || this.loadFrom[coords].edits) {
				// Load the chunk and re-save it in the new version format
				chunk.blocks.fill(-1)
				chunk.originalBlocks = chunk.blocks.slice()
				chunk.load()
			}
			else {
				chunk.originalBlocks = { length: 1 } // Just get it to run the function
				chunk.saveData = this.loadFrom[coords]
			}
			bab.append(chunk.getSave())
		}
		return bab.array
	}
	loadSave(data) {
		if (typeof data === "string") {
			if (data.includes("Alpha")) {
				try {
					return this.loadOldSave(data)
				}
				catch(e) {
					alert("Unable to load save string.")
				}
			}
			try {
				let bytes = atob(decompressString(data))
				let arr = new Uint8Array(bytes.length)
				for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
				data = arr
			}
			catch(e) {
				alert("Malformatted save string. Unable to load")
				throw e
			}
		}

		const reader = new BitArrayReader(data)

		const nameLen = reader.read(8)
		this.name = ""
		for (let i = 0; i < nameLen; i++) this.name += String.fromCharCode(reader.read(8))

		// Check for old version; hopefully there's never a false-positive.
		reader.bit += 287
		let version = reader.read(24)
		reader.bit -= 311

		let paletteLen = 0
		let palette = []
		let paletteBits = 0

		if (version === 0x800) {
			// Alpha 0.8.0
			this.rivers = false
			this.setSeed(reader.read(32))
			this.tickCount = reader.read(32)

			p.x = reader.read(20, true)
			p.y = reader.read(8)
			p.z = reader.read(20, true)
			p.rx = reader.read(11, true) / 100
			p.ry = reader.read(11, true) / 100
			for (let i = 0; i < 9; i++) {
				let id = reader.read(16)
				if (!blockData[id]) id = blockIds.pumpkin
				inventory.playerStorage.setItem(id, i + inventory.hotbar.start)
			}
			inventory.hotbar.index = reader.read(4) + inventory.hotbar.start
			p.flying = reader.read(1)
			p.spectator = reader.read(1)

			superflat = reader.read(1)
			caves = reader.read(1)
			details = reader.read(1)

			reader.bit += 24 // Version; we already have that.

			paletteLen = reader.read(16)
			paletteBits = BitArrayBuilder.bits(paletteLen)
			for (let i = 0; i < paletteLen; i++) {
				let id = reader.read(16)
				if (id & STAIR) {
					let rot = id & 0x1800
					id ^= rot // Remove old rotation
					if (!rot) id |= WEST
					else if (rot === WEST) id |= SOUTH
					else if (rot === SOUTH) id |= EAST
				}
				palette.push(id)
			}

			reader.bit += 32 // Section count; no longer used since I realized I can just read to the end.
		}
		else {
			// Current saves
			version = reader.read(24)
			this.setSeed(reader.read(32))
			this.tickCount = reader.read(32)

			p.x = reader.read(20, true)
			p.y = reader.read(9)
			p.z = reader.read(20, true)
			p.rx = reader.read(11, true) / 100
			p.ry = reader.read(11, true) / 100
			p.flying = reader.read(1)
			p.spectator = reader.read(1)
			superflat = reader.read(1)
			caves = reader.read(1)
			details = reader.read(1)
			this.rivers = reader.read(1)

			for (let i = 0; i < 36; i++) {
				let id = reader.read(16)
				let stack = reader.read(6) + 1
				if (!blockData[id]) id = blockIds.pumpkin
				inventory.playerStorage.setItem(id ? new InventoryItem(id, blockData[id].name, stack, blockData[id].iconImg) : null, i)
			}
			inventory.hotbar.index = reader.read(4) + inventory.hotbar.start
		}

		this.version = "Alpha " + [version >> 16, version >> 8 & 0xff, version & 0xff].join(".")

		const getIndex = [
			(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 0 & 7),
			(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 3 & 7),
			(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 0 & 7),
			(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 3 & 7),
			(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 6 & 7),
			(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 6 & 7)
		]

		if (reader.bit >= reader.data.length * 8 - 37) return // Empty save. We're done.

		let chunks = {}
		let previousChunk = null
		while (reader.bit < reader.data.length * 8 - 37) {
			let startPos = reader.bit
			let x = reader.read(16, true) * 8
			let y = reader.read(5, false) * 8
			let z = reader.read(16, true) * 8

			if (version > 0x800) {
				paletteLen = reader.read(9)
				paletteBits = BitArrayBuilder.bits(paletteLen)
				palette = []
				for (let i = 0; i < paletteLen; i++) {
					let id = reader.read(16)
					// if (id & STAIR) {
					// 	let rot = id & 0x1800
					// 	id ^= rot // Remove old rotation
					// 	if (!rot) id |= WEST
					// 	else if (rot === WEST) id |= SOUTH
					// 	else if (rot === SOUTH) id |= EAST
					// }
					palette.push(id)
				}
			}

			let orientation = reader.read(3)

			let cx = x >> 4
			let cz = z >> 4

			// Make them into local chunk coords
			x = x !== cx * 16 ? 8 : 0
			z = z !== cz * 16 ? 8 : 0

			let ckey = `${cx},${cz}`
			let chunk = chunks[ckey]
			if (!chunk) {
				if (previousChunk) previousChunk.endPos = startPos
				if (version >= 0x801) {
					chunks[ckey] = chunk = {
						reader,
						startPos,
						blocks: [],
						endPos: 0
					}
				}
				else chunks[ckey] = chunk = { blocks: [] }
				previousChunk = chunk
			}

			let runs = reader.read(8)
			let singles = reader.read(9)
			for (let j = 0; j < runs; j++) {
				let index = reader.read(9)
				let types = reader.read(9)
				let lenSize = reader.read(4)
				for (let k = 0; k < types; k++) {
					let chain = reader.read(lenSize) + 1
					let block = reader.read(paletteBits)
					for (let l = 0; l < chain; l++) {
						chunk.blocks[getIndex[orientation](index, x, y, z)] = palette[block]
						index++
					}
				}
			}
			for (let j = 0; j < singles; j++) {
				let index = reader.read(9)
				let block = reader.read(paletteBits)
				chunk.blocks[getIndex[orientation](index, x, y, z)] = palette[block]
			}
		}
		previousChunk.endPos = reader.bit

		// Script to hack in some chunks from another save
		// for (let c in loadFrom) {
		// 	const blocks = []
		// 	const o = loadFrom[c].blocks
		// 	for (let i in o) if (o[i] !== "length") blocks[i] = o[i]
		// 	loadFrom[c].blocks = blocks
		// 	chunks[c] = loadFrom[c]
		// }
		this.loadFrom = chunks
	}
}

export { World }