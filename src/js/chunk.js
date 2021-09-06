import { random, randomSeed, hash } from "./random.js"
import { blockData, blockIds } from "./blockData.js"
import { Section } from "./section.js"

const { floor, min, max } = Math;

class Chunk {
	constructor(x, z, world, glExtensions, gl, glCache, superflat, caves) {
		this.x = x
		this.z = z
		this.maxY = 0
		this.minY = 255
		this.sections = []
		this.cleanSections = []
		this.tops = new Uint8Array(16 * 16) // Store the heighest block at every (x,z) coordinate
		this.optimized = false
		this.generated = false; // Terrain
		this.populated = superflat // Trees and ores
		this.lit = false
		this.lazy = false
		this.edited = false
		this.loaded = false
		// vao for this chunk
		this.vao = glExtensions.vertex_array_object.createVertexArrayOES()
		this.caves = !caves
		this.world = world
		this.gl = gl
		this.glCache = glCache
		this.glExtensions = glExtensions
		this.doubleRender = false
	}
	getBlock(x, y, z) {
		let s = y >> 4
		return this.sections.length > s ? this.sections[s].getBlock(x, y & 15, z) : 0
	}
	setBlock(x, y, z, blockID, user) {
		if (!this.sections[y >> 4]) {
			do {
				this.sections.push(new Section(this.x, this.sections.length * 16, this.z, 16, this, !this.caves, this.world))
			} while (!this.sections[y >> 4])
		}
		if (user && !this.sections[y >> 4].edited) {
			this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
			this.sections[y >> 4].edited = true
			this.edited = true
		}
		if (blockData[blockID].semiTrans) {
			this.doubleRender = true
			if (!this.world.doubleRenderChunks.includes(this)) {
				this.world.doubleRenderChunks.push(this)
			}
		}
		this.sections[y >> 4].setBlock(x, y & 15, z, blockID)
	}
	fillLight() {
		let max = this.sections.length * 16 - 1
		let blockSpread = []

		// Set virtical columns of light to level 15
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				let stop = false
				for (let y = max; y >= 0; y--) {
					let data = blockData[this.getBlock(x, y, z)]
					if (data.lightLevel) {
						if (!blockSpread[data.lightLevel]) blockSpread[data.lightLevel] = []
						blockSpread[data.lightLevel].push(x + this.x, y, z + this.z)
						this.setLight(x, y, z, data.lightLevel, 1)
					}
					if (!stop && !data.transparent) {
						this.tops[z * 16 + x] = y
						stop = true
					}
					else if (!stop) {
						this.setLight(x, y, z, 15, 0)
					}
				}
			}
		}

		// Spread the light to places where the virtical columns stopped earlier, plus chunk borders
		let spread = []
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.tops[z * 16 + x] + 1; y <= max; y++) {
					if (x === 15 || this.tops[z * 16 + x + 1] > y) {
						spread.push(x + this.x, y, z + this.z)
						continue
					}
					if (x === 0 || this.tops[z * 16 + x - 1] > y) {
						spread.push(x + this.x, y, z + this.z)
						continue
					}
					if (z === 15 || this.tops[(z + 1) * 16 + x] > y) {
						spread.push(x + this.x, y, z + this.z)
						continue
					}
					if (z === 0 || this.tops[(z - 1) * 16 + x] > y) {
						spread.push(x + this.x, y, z + this.z)
						continue
					}
					break
				}
			}
		}
		this.spreadLight(spread, 14)

		for (let i = blockSpread.length - 1; i > 0; i--) {
			let blocks = blockSpread[i]
			if (blocks && blocks.length) {
				this.spreadLight(blocks, i - 1, false, 1)
			}
		}

		this.lit = true
	}
	setLight(x, y, z, level, blockLight) {
		if (y < this.sections.length * 16) {
			this.sections[y >> 4].setLight(x, y & 15, z, level, blockLight)
		}
	}
	getLight(x, y, z, blockLight = 0) {
		if (y >= this.sections.length * 16) return 15
		return this.sections[y >> 4].getLight(x, y & 15, z, blockLight)
	}
	trySpread(x, y, z, level, spread, blockLight, update = false) {
		const { world } = this
		if (world.getLight(x, y, z, blockLight) < level) {
			if (blockData[world.getBlock(x, y, z)].transparent) {
				world.setLight(x, y, z, level, blockLight)
				spread.push(x, y, z)
			}
		}
		if (update && (x < this.x || x > this.x + 15 || z < this.z || z > this.z + 15)) {
			let chunk = world.getChunk(x, z)
			if (chunk.buffer && !world.meshQueue.includes(chunk)) {
				world.meshQueue.push(chunk)
			}
		}
	}
	spreadLight(blocks, level, update = false, blockLight = 0) {
		let spread = []
		let x = 0, y = 0, z = 0
		for (let i = 0; i < blocks.length; i += 3) {
			x = blocks[i]
			y = blocks[i+1]
			z = blocks[i+2]
			this.trySpread(x - 1, y, z, level, spread, blockLight, update)
			this.trySpread(x + 1, y, z, level, spread, blockLight, update)
			this.trySpread(x, y - 1, z, level, spread, blockLight, update)
			this.trySpread(x, y + 1, z, level, spread, blockLight, update)
			this.trySpread(x, y, z - 1, level, spread, blockLight, update)
			this.trySpread(x, y, z + 1, level, spread, blockLight, update)
		}
		if (level > 1 && spread.length) {
			this.spreadLight(spread, level - 1, update, blockLight)
		}
	}
	tryUnSpread(x, y, z, level, spread, respread, blockLight) {
		const { world } = this
		let light = world.getLight(x, y, z, blockLight)
		let trans = blockData[world.getBlock(x, y, z)].transparent
		if (light === level) {
			if (trans) {
				world.setLight(x, y, z, 0, blockLight)
				spread.push(x, y, z)
			}
		}
		else if (light > level) {
			respread[light].push(x, y, z)
		}
		if (x < this.x || x > this.x + 15 || z < this.z || z > this.z + 15) {
			let chunk = world.getChunk(x, z)
			if (chunk && chunk.buffer && !world.meshQueue.includes(chunk)) {
				world.meshQueue.push(chunk)
			}
		}
	}
	unSpreadLight(blocks, level, respread, blockLight) {
		let spread = []
		let x = 0, y = 0, z = 0
		for (let i = 0; i < blocks.length; i += 3) {
			x = blocks[i]
			y = blocks[i+1]
			z = blocks[i+2]
			this.tryUnSpread(x - 1, y, z, level, spread, respread, blockLight)
			this.tryUnSpread(x + 1, y, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y - 1, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y + 1, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y, z - 1, level, spread, respread, blockLight)
			this.tryUnSpread(x, y, z + 1, level, spread, respread, blockLight)
		}
		if (level > 1 && spread.length) {
			this.unSpreadLight(spread, level - 1, respread, blockLight)
		}
	}
	reSpreadLight(respread, blockLight) {
		for (let i = respread.length - 1; i > 1; i--) {
			let blocks = respread[i]
			let level = i - 1
			let spread = respread[level]
			for (let j = 0; j < blocks.length; j += 3) {
				let x = blocks[j]
				let y = blocks[j+1]
				let z = blocks[j+2]
				this.trySpread(x - 1, y, z, level, spread, blockLight)
				this.trySpread(x + 1, y, z, level, spread, blockLight)
				this.trySpread(x, y - 1, z, level, spread, blockLight)
				this.trySpread(x, y + 1, z, level, spread, blockLight)
				this.trySpread(x, y, z - 1, level, spread, blockLight)
				this.trySpread(x, y, z + 1, level, spread, blockLight)
			}
		}
	}
	optimize(screen) {
		const { world } = this
		for (let i = 0; i < this.sections.length; i++) {
			this.sections[i].optimize(screen)
		}
		if (!world.meshQueue.includes(this)) {
			world.meshQueue.push(this)
		}
		this.optimized = true
	}
	render(p, global) {
		const { glExtensions, gl } = this
		if (this.buffer === undefined) {
			return
		}
		if (p.canSee(this.x, this.minY, this.z, this.maxY)) {
			global.renderedChunks++
			glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
			gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
			glExtensions.vertex_array_object.bindVertexArrayOES(null)
		}
	}
	updateBlock(x, y, z, world, lazy, screen) {
		if (this.buffer) {
			this.lazy = lazy
			if (this.sections.length > y >> 4) {
				this.sections[y >> 4].updateBlock(x, y & 15, z, world, screen)
			}
		}
	}
	deleteBlock(x, y, z, user) {
		if (!this.sections[y >> 4]) {
			return
		}
		if (user && !this.sections[y >> 4].edited) {
			this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
			this.sections[y >> 4].edited = true
			this.edited = true
		}
		this.sections[y >> 4].deleteBlock(x, y & 15, z)
		this.minY = y < this.minY ? y : this.minY
		this.maxY = y > this.maxY ? y : this.maxY
	}
	async carveCaves() {
		let promises = []
		for (let i = 0; i < this.sections.length; i++) {
			if (!this.sections[i].caves) {
				promises.push(this.sections[i].carveCaves())
			}
		}
		await Promise.all(promises)
		this.caves = true
	}
	populate(trees) {
		const { world } = this
		randomSeed(hash(this.x, this.z) * 210000000)
		let wx = 0, wz = 0, ground = 0, top = 0, rand = 0, place = false

		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				wx = this.x + i
				wz = this.z + k

				ground = this.tops[k * 16 + i]
				if (trees && random() < 0.005 && this.getBlock(i, ground, k) === blockIds.grass) {

					top = ground + floor(4.5 + random(2.5))
					rand = floor(random(4096))
					let tree = random() < 0.6 ? blockIds.oakLog : ++top && blockIds.birchLog

					//Center
					for (let j = ground + 1; j <= top; j++) {
						this.setBlock(i, j, k, tree)
					}
					this.setBlock(i, top + 1, k, blockIds.leaves)
					this.setBlock(i, ground, k, blockIds.dirt)

					//Bottom leaves
					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) {
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
								}
							}
						}
					}

					//2nd layer leaves
					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) {
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
								}
							}
						}
					}

					//3rd layer leaves
					for (let x = -1; x <= 1; x++) {
						for (let z = -1; z <= 1; z++) {
							if (x || z) {
								if (x & z) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
								}
							}
						}
					}

					//Top leaves
					world.spawnBlock(wx + 1, top + 1, wz, blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz - 1, blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz + 1, blockIds.leaves)
					world.spawnBlock(wx - 1, top + 1, wz, blockIds.leaves)
				}

				// Blocks of each per chunk in Minecraft
				// Coal: 185.5
				// Iron: 111.5
				// Gold: 10.4
				// Redstone: 29.1
				// Diamond: 3.7
				// Lapis: 4.1
				ground -= 4

				if (random() < 3.7 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.diamondOre)
					}
				}

				if (random() < 111.5 / 256) {
					let y = random() * 64 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.ironOre)
					}
				}

				if (random() < 185.5 / 256) {
					let y = random() * ground | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.coalOre)
					}
				}

				if (random() < 10.4 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.goldOre)
					}
				}

				if (random() < 29.1 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.redstoneOre)
					}
				}

				if (random() < 4.1 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.lapisOre)
					}
				}
			}
		}

		this.populated = true
	}
	genMesh(indexBuffer, bigArray) {
		const { glExtensions, gl, glCache } = this
		let barray = bigArray
		let index = 0
		for (let i = 0; i < this.sections.length; i++) {
			index = this.sections[i].genMesh(barray, index)
		}

		if (!this.buffer) {
			this.buffer = gl.createBuffer()
		}
		let data = barray.slice(0, index)

		let maxY = 0
		let minY = 255
		let y = 0
		for (let i = 1; i < data.length; i += 6) {
			y = data[i]
			maxY = max(maxY, y)
			minY = min(minY, y)
		}
		this.maxY = maxY
		this.minY = minY
		this.faces = data.length / 32
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
		gl.enableVertexAttribArray(glCache.aVertex)
		gl.enableVertexAttribArray(glCache.aTexture)
		gl.enableVertexAttribArray(glCache.aShadow)
		gl.enableVertexAttribArray(glCache.aSkylight)
		gl.enableVertexAttribArray(glCache.aBlocklight)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 32, 0)
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 32, 12)
		gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 32, 20)
		gl.vertexAttribPointer(glCache.aSkylight, 1, gl.FLOAT, false, 32, 24)
		gl.vertexAttribPointer(glCache.aBlocklight, 1, gl.FLOAT, false, 32, 28)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
		this.lazy = false
	}
	tick() {
		if (this.edited) {
			for (let i = 0; i < this.sections.length; i++) {
				if (this.sections[i].edited) {
					this.sections[i].tick()
				}
			}
		}
	}
	load() {
		const { world } = this
		let chunkX = this.x >> 4
		let chunkZ = this.z >> 4
		let load = null

		for (let i = 0; i < world.loadFrom.length; i++) {
			load = world.loadFrom[i]
			if (load.x === chunkX && load.z === chunkZ) {
				let y = load.y * 16
				for (let j in load.blocks) {
					world.setBlock((j >> 8 & 15) + this.x, (j >> 4 & 15) + y, (j & 15) + this.z, load.blocks[j])
				}
				world.loadFrom.splice(i--, 1)
			}
		}
		this.loaded = true
	}
}

export { Chunk };