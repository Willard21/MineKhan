import { random, randomSeed, hash, noiseProfile } from "./random.js"
import { blockData, blockIds, Block } from "./blockData.js"
import { BitArrayBuilder, BitArrayReader } from "./utils.js"
import { shapes } from "./shapes.js"

const { floor, max, abs } = Math
const hideInterior = new Uint8Array(255)
hideInterior.set(blockData.slice(0, 255).map(data => data.hideInterior))
const shadow = new Uint8Array(blockData.map(data => data.shadow ? 1 : 0))
const lightLevels = new Uint8Array(blockData.map(data => data.lightLevel || 0))

// Save the coords for a small sphere used to carve out caves
let sphere = new Int8Array([-2,-1,-1,-2,-1,0,-2,-1,1,-2,0,-1,-2,0,0,-2,0,1,-2,1,-1,-2,1,0,-2,1,1,-1,-2,-1,-1,-2,0,-1,-2,1,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,1,-1,-1,2,-1,0,-2,-1,0,-1,-1,0,0,-1,0,1,-1,0,2,-1,1,-2,-1,1,-1,-1,1,0,-1,1,1,-1,1,2,-1,2,-1,-1,2,0,-1,2,1,0,-2,-1,0,-2,0,0,-2,1,0,-1,-2,0,-1,-1,0,-1,0,0,-1,1,0,-1,2,0,0,-2,0,0,-1,0,0,0,0,0,1,0,0,2,0,1,-2,0,1,-1,0,1,0,0,1,1,0,1,2,0,2,-1,0,2,0,0,2,1,1,-2,-1,1,-2,0,1,-2,1,1,-1,-2,1,-1,-1,1,-1,0,1,-1,1,1,-1,2,1,0,-2,1,0,-1,1,0,0,1,0,1,1,0,2,1,1,-2,1,1,-1,1,1,0,1,1,1,1,1,2,1,2,-1,1,2,0,1,2,1,2,-1,-1,2,-1,0,2,-1,1,2,0,-1,2,0,0,2,0,1,2,1,-1,2,1,0,2,1,1])

// {
// 	let blocks = []
// 	let radius = 3.5
// 	let radsq = radius * radius
// 	for (let i = -radius; i <= radius; i++) {
// 		for (let j = -radius; j <= radius; j++) {
// 			for (let k = -radius; k <= radius; k++) {
// 				if (i*i + j*j + k*k < radsq) {
// 					blocks.push(i|0, j|0, k|0)
// 				}
// 			}
// 		}
// 	}
// 	sphere = new Int8Array(blocks)
// }
// console.log(sphere)

const carveSphere = (x, y, z, world) => {
	if (y > 3) {
		for (let i = 0; i < sphere.length; i += 3) {
			world.setWorldBlock(x + sphere[i], y + sphere[i + 1], z + sphere[i + 2], blockIds.air, true)
		}
	}
}

let getShadows
{
	const shade = [1, 0.85, 0.7, 0.6, 0.3]
	const ret = []
	getShadows = [
		b => { // Bottom
			ret[0] = shade[b[0] + b[3] + b[1] + b[4]]*0.75
			ret[1] = shade[b[3] + b[6] + b[4] + b[7]]*0.75
			ret[2] = shade[b[7] + b[4] + b[8] + b[5]]*0.75
			ret[3] = shade[b[4] + b[1] + b[5] + b[2]]*0.75
			return ret
		},
		b => { // Top
			ret[0] = shade[b[20] + b[19] + b[23] + b[22]]
			ret[1] = shade[b[26] + b[25] + b[23] + b[22]]
			ret[2] = shade[b[24] + b[21] + b[25] + b[22]]
			ret[3] = shade[b[18] + b[21] + b[19] + b[22]]
			return ret
		},
		b => { // North
			ret[0] = shade[b[17] + b[26] + b[23] + b[14]]*0.95
			ret[1] = shade[b[11] + b[20] + b[23] + b[14]]*0.95
			ret[2] = shade[b[11] + b[2]  + b[5]  + b[14]]*0.95
			ret[3] = shade[b[17] + b[8]  + b[5]  + b[14]]*0.95
			return ret
		},
		b => { // South
			ret[0] = shade[b[9]  + b[18] + b[12] + b[21]]*0.95
			ret[1] = shade[b[21] + b[12] + b[24] + b[15]]*0.95
			ret[2] = shade[b[12] + b[3]  + b[15] + b[6]]*0.95
			ret[3] = shade[b[0]  + b[9]  + b[3]  + b[12]]*0.95
			return ret
		},
		b => { // East
			ret[0] = shade[b[15] + b[24] + b[16] + b[25]]*0.8
			ret[1] = shade[b[25] + b[16] + b[26] + b[17]]*0.8
			ret[2] = shade[b[16] + b[7] + b[17] + b[8]]*0.8
			ret[3] = shade[b[6] + b[15] + b[7] + b[16]]*0.8
			return ret
		},
		b => { // West
			ret[0] = shade[b[11] + b[20] + b[10] + b[19]]*0.8
			ret[1] = shade[b[19] + b[10] + b[18] + b[9]]*0.8
			ret[2] = shade[b[10] + b[1]  + b[9]  + b[0]]*0.8
			ret[3] = shade[b[2]  + b[11] + b[1]  + b[10]]*0.8
			return ret
		},
	]
}

/**
 * Function to compute smooth lighting.
 * @param {Number[]} l Array of numbers to average
 * @param {Number} a The index of the face
 * @param {Number} b The second index of the 4 numbers
 * @param {Number} c The third index of the 4 numbers
 * @param {Number} d The fourth index of the 4 numbers
 * @returns 
 */
const average = (l, a, b, c, d) => {
	a = l[a]
	b = l[b]
	c = l[c]
	d = l[d]
	let count = 1
	let zero = 0
	let total = a
	if (b && abs(a-b) <= 2) {
		total += b
		count++
	}
	else zero++
	if (c && abs(a-c) <= 2) {
		total += c
		count++
	}
	else zero++
	if (d && abs(a-d) <= 2) {
		total += d
		count++
	}
	else zero++

	let mx = max(a, b, c, d)
	if (mx > 2) {
		return total / (count * 15)
	}
	if (mx > 1) {
		return zero ? total / (count * 15 + 15) : total / (count * 15)
	}
	return total / 60
}

let getLight
{
	const blocks = []
	getLight = [
		(lights27, ret, blockMask, blockShift) => { // Bottom
			const face = (lights27[4] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[3] & blockMask) >> blockShift
			blocks[2] = (lights27[6] & blockMask) >> blockShift
			blocks[3] = (lights27[1] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[7] & blockMask) >> blockShift
			blocks[6] = (lights27[2] & blockMask) >> blockShift
			blocks[7] = (lights27[5] & blockMask) >> blockShift
			blocks[8] = (lights27[8] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 0, 1, 3)
			ret[1] = average(blocks, 4, 1, 2, 5)
			ret[2] = average(blocks, 4, 5, 7, 8)
			ret[3] = average(blocks, 4, 3, 6, 7)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // Top
			const face = (lights27[22] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[18] & blockMask) >> blockShift
			blocks[1] = (lights27[21] & blockMask) >> blockShift
			blocks[2] = (lights27[24] & blockMask) >> blockShift
			blocks[3] = (lights27[19] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[25] & blockMask) >> blockShift
			blocks[6] = (lights27[20] & blockMask) >> blockShift
			blocks[7] = (lights27[23] & blockMask) >> blockShift
			blocks[8] = (lights27[26] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 3, 6, 7)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 1, 2, 5)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // North
			const face = (lights27[14] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[2] & blockMask) >> blockShift
			blocks[1] = (lights27[5] & blockMask) >> blockShift
			blocks[2] = (lights27[8] & blockMask) >> blockShift
			blocks[3] = (lights27[11] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[17] & blockMask) >> blockShift
			blocks[6] = (lights27[20] & blockMask) >> blockShift
			blocks[7] = (lights27[23] & blockMask) >> blockShift
			blocks[8] = (lights27[26] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 5, 7, 8)
			ret[1] = average(blocks, 4, 3, 6, 7)
			ret[2] = average(blocks, 4, 0, 1, 3)
			ret[3] = average(blocks, 4, 1, 2, 5)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // South
			const face = (lights27[12] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[9] & blockMask) >> blockShift
			blocks[2] = (lights27[18] & blockMask) >> blockShift
			blocks[3] = (lights27[3] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[21] & blockMask) >> blockShift
			blocks[6] = (lights27[6] & blockMask) >> blockShift
			blocks[7] = (lights27[15] & blockMask) >> blockShift
			blocks[8] = (lights27[24] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 1, 2, 5)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 3, 6, 7)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // East
			const face = (lights27[16] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[6] & blockMask) >> blockShift
			blocks[1] = (lights27[15] & blockMask) >> blockShift
			blocks[2] = (lights27[24] & blockMask) >> blockShift
			blocks[3] = (lights27[7] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[25] & blockMask) >> blockShift
			blocks[6] = (lights27[8] & blockMask) >> blockShift
			blocks[7] = (lights27[17] & blockMask) >> blockShift
			blocks[8] = (lights27[27] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 1, 2, 5)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 3, 6, 7)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // West
			const face = (lights27[10] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[9] & blockMask) >> blockShift
			blocks[2] = (lights27[18] & blockMask) >> blockShift
			blocks[3] = (lights27[1] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[19] & blockMask) >> blockShift
			blocks[6] = (lights27[2] & blockMask) >> blockShift
			blocks[7] = (lights27[11] & blockMask) >> blockShift
			blocks[8] = (lights27[20] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 5, 7, 8)
			ret[1] = average(blocks, 4, 1, 2, 5)
			ret[2] = average(blocks, 4, 0, 1, 3)
			ret[3] = average(blocks, 4, 3, 6, 7)
			return ret
		}
	]
}

class Chunk {
	/**
	 * @param {Number} x
	 * @param {Number} z
	 * @param {World} world
	 * @param {{vertex_array_object: OES_vertex_array_object}} glExtensions
	 * @param {WebGLRenderingContext} gl
	 * @param {Object} glCache
	 * @param {Boolean} superflat
	 * @param {Boolean} caves
	 */
	constructor(x, z, world, glExtensions, gl, glCache, superflat, caves) {
		this.x = x
		this.z = z
		this.maxY = 0
		this.minY = 255
		this.tops = new Uint8Array(16 * 16) // Store the heighest block at every (x,z) coordinate
		this.optimized = false
		this.generated = false // Terrain
		this.populated = superflat // Details and ores
		this.lit = false
		this.lightDropped = false
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
		this.blocks = new Int16Array(16*16*256)
		this.originalBlocks = new Int16Array(0)
		this.light = new Uint8Array(16*16*256)
		this.renderData = []
		this.renderLength = 0
		this.hasBlockLight = false

		// These are temporary and will be removed after the chunk is generated.
		this.blockSpread = []
		this.visFlags = new Int8Array(0)
		this.shadowFlags = new Int8Array(0)
	}
	getBlock(x, y, z) {
		// if (y < 0 || y > 255) debugger
		return this.blocks[y * 256 + x * 16 + z]
	}
	setBlock(x, y, z, blockID, user) {
		if (user && !this.edited) {
			this.edited = true
			this.saveData = null
			if (!this.originalBlocks.length) this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}

		if (blockData[blockID & 255].semiTrans) {
			this.doubleRender = true
			if (!this.world.doubleRenderChunks.includes(this)) {
				this.world.doubleRenderChunks.push(this)
			}
		}
		this.blocks[y * 256 + x * 16 + z] = blockID
	}
	deleteBlock(x, y, z, user) {
		if (user && !this.edited) {
			this.edited = true
			this.saveData = null
			if (!this.originalBlocks.length) this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}
		this.blocks[y * 256 + x * 16 + z] = 0
		this.minY = y < this.minY ? y : this.minY
	}

	processBlocks() {
		// Do some pre-processing for dropLight, optimize, and genMesh. It's more efficient to do it all at once.
		const { blocks, maxY, blockSpread, world } = this
		const cube = shapes.cube.cull

		const chunkN = world.getChunk(this.x, this.z + 16).blocks
		const chunkS = world.getChunk(this.x, this.z - 16).blocks
		const chunkE = world.getChunk(this.x + 16, this.z).blocks
		const chunkW = world.getChunk(this.x - 16, this.z).blocks

		const flags = new Int8Array((maxY + 1) * 256)
		this.visFlags = flags
		// this.shadowFlags = new Int32Array(flags.length >> 5)
		for (let i = flags.length - 256; i < flags.length; i++) {
			flags[i] = 8 // Up is Air
		}
		for (let i = 0; i < 255; i++) this.shadowFlags[i] = 1
		for (let i = 256; i < flags.length; i++) {
			const x = i >> 4 & 15
			const z = i & 15
			const b = blocks[i]
			const data = blockData[b]

			// Set bit flags on adjacent blocks
			if (data.transparent) {
				if (b === 0) flags[i] |= 128 // This is an air block, so it can't be rendered. This bit makes it negative.
				else if (hideInterior[b] === 1) {

					// Toggle visibilty flags. The neighbors will toggle them again, leaving them off.
					flags[i] ^= (b === (i >> 4 & 15 ? blocks[i - 16] : chunkW[i + 240])) << 0
					| (b === (~i >> 4 & 15 ? blocks[i + 16] : chunkE[i - 240])) << 1
					| (b === blocks[i - 256]) << 2
					| (b === blocks[i + 256]) << 3
					| (b === (i & 15 ? blocks[i - 1] : chunkS[i + 15])) << 4
					| (b === (~i & 15 ? blocks[i + 1] : chunkN[i - 15])) << 5
				}

				// Toggle neighbor's visibility flags.
				flags[i - 256] ^= 8 // Top face of block below is visible
				if (i < flags.length - 256) flags[i + 256] ^= 4 // Bottom face of block above is visible
				if (z)      flags[i - 1] ^= 32 // South face of North block is visible
				if (z < 15) flags[i + 1] ^= 16 // North face of South block is visible
				if (x)      flags[i - 16] ^= 2 // West face of East block is visible
				if (x < 15) flags[i + 16] ^= 1 // East face of West block is visible
			}
			else if (data.shape.cull !== cube) {
				if (!data.shape.cull.bottom) {
					flags[i - 256] |= 8 // Top face of block below is visible
				}
				if (!data.shape.cull.top && i < flags.length - 256) {
					flags[i + 256] |= 4 // Bottom face of block above is visible
				}
				if (!data.shape.cull.south && z) {
					flags[i - 1] |= 32 // South face of North block is visible
				}
				if (!data.shape.cull.north && z < 15) {
					flags[i + 1] |= 16 // North face of South block is visible
				}
				if (!data.shape.cull.west && x) {
					flags[i - 16] |= 2 // West face of East block is visible
				}
				if (!data.shape.cull.east && x < 15) {
					flags[i + 16] |= 1 // East face of West block is visible
				}
			}

			// Some lighting stuff
			const light = lightLevels[255 & b]
			if (light) {
				if (!blockSpread[light]) blockSpread[light] = []
				blockSpread[light].push(this.x + x, i >> 8, this.z + z)
				this.light[i] |= light * 16
			}
		}
	}

	dropLight() {
		// Drop light from the sky without spreading it.
		if (this.lightDropped) return
		const { blocks, hasBlockLight } = this

		if (!hasBlockLight) this.light.fill(15, (this.maxY + 1) * 256)
		else {
			// May introduce a subtle lighting glitch, but it's worth it for the time savings.
			let end = Math.min((this.maxY + 14) * 256, blocks.length)
			this.light.fill(15, end)
			for (let i = this.maxY * 256; i < end; i++) this.light[i] |= 15
		}

		// Set vertical columns of light to level 15
		this.tops.fill(0)
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.maxY; y > 0; y--) {
					const block = blocks[y * 256 + x * 16 + z]
					if (block && !blockData[block].transparent) {
						this.tops[x * 16 + z] = y
						break
					}
					this.light[y * 256 + x * 16 + z] |= 15
				}
			}
		}

		this.lightDropped = true
	}
	fillLight() {
		const { world } = this
		this.processBlocks()
		this.dropLight()
		let blockSpread = this.blockSpread
		this.blockSpread = null

		// Drop light in neighboring chunk borders so we won't need to spread into them as much.
		world.getChunk(this.x - 1, this.z).dropLight()
		world.getChunk(this.x + 17, this.z).dropLight()
		world.getChunk(this.x, this.z - 1).dropLight()
		world.getChunk(this.x, this.z + 17).dropLight()

		// Spread the light to places where the vertical columns stopped earlier, plus chunk borders
		let spread = []
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.tops[x * 16 + z] + 1; y <= this.maxY; y++) {
					if (   x === 15 || this.tops[x * 16 + z + 1 ] > y
						|| x === 0  || this.tops[x * 16 + z - 1 ] > y
						|| z === 15 || this.tops[x * 16 + z + 16] > y
						|| z === 0  || this.tops[x * 16 + z - 16] > y
					) {
						spread.push(x + this.x, y, z + this.z)
					}
					else break
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
	setLight(x, y, z, level) {
		const i = y * 256 + x * 16 + z
		this.light[i] = level
		// debugger
	}
	setBlockLight(x, y, z, level) {
		this.hasBlockLight = true
		const i = y * 256 + x * 16 + z
		this.light[i] = level << 4 | this.light[i] & 15
	}
	setSkyLight(x, y, z, level) {
		const i = y * 256 + x * 16 + z
		this.light[i] = level | this.light[i] & 240
	}
	getLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z]
	}
	getBlockLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z] >>> 4
	}
	getSkyLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z] & 15
	}
	trySpread(x, y, z, level, spread, blockLight, update = false) {
		if (y > 255) return
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
		for (let i = 0; i < blocks.length; i += 3) {
			let x = blocks[i]
			let y = blocks[i+1]
			let z = blocks[i+2]
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
		if (y > 255) return
		const { world } = this
		let light = world.getLight(x, y, z, blockLight)
		if (light === level) {
			if (blockData[world.getBlock(x, y, z)].transparent) {
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
	generate() {
		if (this.generated) return
		const cx = this.x
		const cz = this.z

		const { grass, dirt, stone, bedrock, sand, water } = blockIds

		const waterHeight = this.maxY = 55
		const smoothness = 0.01 // How close hills and valleys are together
		const hilliness = 80 // Height of the hills
		const extra = 30 // Extra blocks stacked onto the terrain
		const superflat = this.populated
		let gen = 0
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				if (superflat) gen = 4
				else {
					let n = noiseProfile.noise((cx + i) * smoothness, (cz + k) * smoothness)
					gen = Math.round(n * hilliness + extra)
					if (this.world.rivers) {
						const m = (1 - abs(noiseProfile.noise((cz + k - 5432.123) * 0.003, (cx + i + 9182.543) * 0.003) - 0.5))**50
						gen = Math.round((waterHeight - 5 - gen) * m + gen)
					}
				}

				this.tops[i * 16 + k] = gen
				if (gen > this.maxY) this.maxY = gen

				let index = i * 16 + k
				this.blocks[index] = bedrock
				index += 256
				for (let max = (gen - 3) * 256; index < max; index += 256) {
					this.blocks[index] = stone
				}
				if (gen > waterHeight || !this.world.rivers || superflat) {
					this.blocks[index] = dirt
					this.blocks[index + 256] = dirt
					this.blocks[index + 512] = dirt
					this.blocks[index + 768] = grass
				}
				else {
					this.blocks[index] = sand
					this.blocks[index + 256] = sand
					this.blocks[index + 512] = sand
					this.blocks[index + 768] = sand
					for (index += 1024; index < (waterHeight + 1) * 256; index += 256) this.blocks[index] = water
					if (gen <= waterHeight) this.doubleRender = true
				}
			}
		}
		if (this.doubleRender) this.world.doubleRenderChunks.push(this)
		this.generated = true
		this.getCaveData() // Queue up the multithreaded cave gen
	}
	optimize() {
		const { blocks, renderData, world, x, z, maxY } = this
		const flags = this.visFlags // Computed in this.processBlocks()
		this.visFlags = null

		// Load adjacent chunks blocks
		const chunkN = world.getChunk(x, z + 17).blocks
		const chunkS = world.getChunk(x, z - 1).blocks
		const chunkE = world.getChunk(x + 17, z).blocks
		const chunkW = world.getChunk(x - 1, z).blocks
		// let max = (maxY - 1) * 256
		// for (let i = 256; i <= max; i += 16) if (trans[chunkN[i]]) flags[i + 15] |= 32

		// Culling faces on chunk borders as needed
		for (let y = 1; y <= maxY; y++) {
			let indexN = y * 256
			let indexS = indexN + 15
			let indexE = indexN
			let indexW = indexN + 240
			for (let i = 0; i < 16; i++) {
				if (blockData[chunkN[indexN]].transparent || !blockData[chunkN[indexN]].shape.cull.south) flags[indexN + 15] ^= 32
				if (blockData[chunkS[indexS]].transparent || !blockData[chunkS[indexS]].shape.cull.north) flags[indexS - 15] ^= 16
				if (blockData[chunkE[indexE]].transparent || !blockData[chunkE[indexE]].shape.cull.west) flags[indexE + 240] ^= 2
				if (blockData[chunkW[indexW]].transparent || !blockData[chunkW[indexW]].shape.cull.east) flags[indexW - 240] ^= 1
				indexN += 16
				indexS += 16
				indexE++
				indexW++
			}
		}

		//Check all the blocks in the chunk to see if they're visible.
		const cube = shapes.cube.cull
		for (let index = 256; index < flags.length; index++) {
			const cull = blockData[blocks[index]].shape.cull
			if (cull !== cube) {
				if (!cull.bottom) flags[index] |= 4
				if (!cull.top)    flags[index] |= 8
				if (!cull.south)  flags[index] |= 16
				if (!cull.north)  flags[index] |= 32
				if (!cull.west)   flags[index] |= 1
				if (!cull.east)   flags[index] |= 2
			}
			if (flags[index] > 0) {
				renderData[this.renderLength++] = index << 16 | flags[index] << 10
			}
		}
		this.minY = renderData[0] >>> 24

		// The bottom layer of bedrock is only ever visible on top
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				if (blockData[blocks[256 + i*16 + k]].transparent) {
					this.minY = 0
					renderData.push(i*16 + k << 16 | 1 << 13)
				}
			}
		}
		this.renderLength = renderData.length

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
	updateBlock(x, y, z, world) {
		if (!this.buffer) return
		if (!world.meshQueue.includes(this)) {
			world.meshQueue.push(this)
		}
		let i = x
		let j = y
		let k = z
		x += this.x
		z += this.z
		let index = j * 256 + i * 16 + k
		let blockState = this.blocks[index]
		const cull = blockData[blockState].shape.cull

		let w = blockData[i ? this.blocks[index - 16] : world.getBlock(x - 1, j, z)]
		let e = blockData[i < 15 ? this.blocks[index + 16] : world.getBlock(x + 1, j, z)]
		let d = blockData[y ? this.blocks[index - 256]: 4]
		let u = blockData[this.blocks[index + 256]]
		let s = blockData[k ? this.blocks[index - 1] : world.getBlock(x, j, z - 1)]
		let n = blockData[k < 15 ? this.blocks[index + 1] : world.getBlock(x, j, z + 1)]

		let visible = blockState
		&& (w.transparent || !w.shape.cull.east   || !cull.west)
		+  (e.transparent || !e.shape.cull.west   || !cull.east) * 2
		+  (d.transparent || !d.shape.cull.top    || !cull.bottom) * 4
		+  (u.transparent || !u.shape.cull.bottom || !cull.top) * 8
		+  (s.transparent || !s.shape.cull.north  || !cull.south) * 16
		+  (n.transparent || !n.shape.cull.south  || !cull.north) * 32

		if (blockState < 256 && hideInterior[blockState]) {
			visible ^= w === blockState
			| (e === blockState) << 1
			| (d === blockState) << 2
			| (u === blockState) << 3
			| (s === blockState) << 4
			| (n === blockState) << 5
		}

		let pos = index << 16
		index = -1

		// Find index of current block in this.renderData
		for (let i = 0; i < this.renderLength; i++) {
			if ((this.renderData[i] & 0xffff0000) === pos) {
				index = i
				break
			}
		}

		// Update palette
		// if (!this.paletteMap[blockState]) {
		// 	this.paletteMap[blockState] = this.palette.length
		// 	this.palette.push(blockState)
		// }

		if (index < 0 && !visible) {
			// Wasn't visible before, isn't visible after.
			return
		}
		if (!visible) {
			// Was visible before, isn't visible after.
			this.renderData.splice(index, 1)
			this.renderLength--
			return
		}
		if (visible && index < 0) {
			if (y <= this.minY) this.minY = y - 1
			if (y > this.maxY) this.maxY = y
			// Wasn't visible before, is visible after.
			index = this.renderLength++
		}
		this.renderData[index] = pos | visible << 10// | this.paletteMap[blockState]
	}
	getCaveData() {
		if (this.caves || this.caveData) return
		this.caveData = new Promise(resolve => {
			window.parent.doWork({
				caves: true,
				x: this.x,
				y: 0,
				z: this.z
			}, resolve)
		})
	}
	async carveCaves() {
		const { world } = this
		this.caves = true

		const { carve, air } = await this.caveData

		// Find the lowest point we need to check.
		let lowest = 255
		for (let i = 0; i < 256; i++) {
			let n = this.tops[i]
			lowest = lowest < n ? lowest : n
		}
		lowest = (lowest - 1) * 256

		// Set air blocks
		for (let i = 0; i < air.length; i++) {
			let index = air[i]
			// if (index === 20030) debugger
			if (index < lowest || index >> 8 <= this.tops[index & 255]) {
				this.blocks[index] = 0
			}
		}

		// // Carve spheres
		for (let i = 0; i < carve.length; i++) {
			let index = carve[i]
			// if (index === 20030) debugger
			if (index < lowest || index >> 8 <= this.tops[index & 255]) {
				let x = index >> 4 & 15
				let y = index >> 8
				let z = index & 15
				carveSphere(x + this.x, y, z + this.z, world)
			}
		}

		// let sx = this.x, sy = 0, sz = this.z
		// let cy = 0
		// for (let xz = 0; xz < 256; xz++) {
		// 	cy = this.tops[xz]
		// 	cy = cy > 82 ? 82 : cy
		// 	for (let y = 2; y <= cy; y++) {
		// 		let i = y * 256 + xz
		// 		let c = caves[i]
		// 		if (c === 1) {
		// 			carveSphere(sx + (xz >> 4), sy + y, sz + (xz & 15), world)
		// 		}
		// 		else if (c === 2) {
		// 			this.blocks[i] = 0
		// 		}
		// 	}
		// }
		this.caveData = null
	}
	populate(details) {
		if (this.populated) return
		const { world } = this
		randomSeed(hash(this.x, this.z) * 210000000)
		let wx = 0, wz = 0, ground = 0, top = 0, rand = 0, place = false

		// Spawn trees and ores
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				wx = this.x + i
				wz = this.z + k

				ground = this.tops[i * 16 + k]
				let topBlock = this.getBlock(i, ground, k)
				if (details && random() < 0.005 && topBlock === blockIds.grass) {

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
							if (x || z) { // Not center
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
				while (this.getBlock(i, ground, k) !== blockIds.stone) ground--

				if (random() < 3.7 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.diamondOre)
					}
				}

				if (random() < 111.5 / 256) {
					let y = random() * 64 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.ironOre)
					}
				}

				if (random() < 185.5 / 256) {
					let y = random() * ground | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.coalOre)
					}
				}

				if (random() < 10.4 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.goldOre)
					}
				}

				if (random() < 29.1 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.redstoneOre)
					}
				}

				if (random() < 4.1 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, blockIds.lapisOre)
					}
				}
			}
		}

		// Spawn water pools; 1 in 5000 blocks
		let queue = []
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				wx = this.x + i
				wz = this.z + k
				ground = this.tops[i * 16 + k]

				if (details && random() < 0.0002 && world.getBlock(wx, ground, wz) === blockIds.grass) {
					let size = 0
					let maxSize = random(7, 30) | 0
					queue.push(wx, wz)
					while(queue.length) {
						let x = queue.shift()
						let z = queue.shift()
						if (Math.abs(x - wx) > 15 || Math.abs(z - wz) > 15) continue
						if ((size < 3 || random() < 0.5) && world.getBlock(x, ground, z) === blockIds.grass) {
							world.setWorldBlock(x, ground, z, blockIds.water)
							world.setWorldBlock(x, ground + 1, z, blockIds.air) // Remove any flowers above the water
							size++

							// Waterfall
							if (!world.getBlock(x - 1, ground, z)
								|| !world.getBlock(x + 1, ground, z)
								|| !world.getBlock(x, ground, z - 1)
								|| !world.getBlock(x, ground, z + 1)
							) {
								maxSize -= Math.min(size, 3)
								if (maxSize < 7) maxSize = 7
								size = 0
								world.setWorldBlock(x, --ground, z, blockIds.water)
								queue.length = 0
							}
							if (size < maxSize) queue.push(x - 1, z, x + 1, z, x, z - 1, x, z + 1)
						}
					}
				}
			}
		}

		// Spawn flower patches; 1 in 500 blocks
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				wx = this.x + i
				wz = this.z + k

				if (details && random() < 0.002) {
					const types = []
					if (random() < 0.5) types.push(blockIds.poppy)
					if (random() < 0.5) types.push(blockIds.cornflower)
					if (random() < 0.5) types.push(blockIds.dandelion)

					for (let i = 0; i < types.length * 4; i++) {
						let x = wx + random(-2, 3) | 0
						let z = wz + random(-2, 3) | 0
						let y = world.getSurfaceHeight(x, z)
						if (world.getBlock(x, y, z) === blockIds.grass && !world.getBlock(x, y + 1, z)) {
							world.spawnBlock(x, y + 1, z, types[random(types.length) | 0])
						}
					}
				}
			}
		}

		this.populated = true
	}
	getSurroundingBlocks(loc, sides, blocks27, lights27) {
		// Used in this.genMesh()
		// Note that, while this *does* do more work than simply loading the blocks/lights as they're needed,
		// the improved cache efficiency nearly doubled the overall speed of genMesh (on Chrome).
		const chunkX = loc >> 4 & 15
		const chunkY = loc >> 8
		const chunkZ = loc & 15

		const worldX = chunkX + this.x
		const worldY = chunkY
		const worldZ = chunkZ + this.z

		// Preload any blocks that will be used for the shadows/lighting.
		if (chunkX && chunkZ && chunkX < 15 && chunkZ < 15) {
			const index = loc
			let topLight = this.light[index + 256]
			lights27[22] = topLight
			if (topLight !== 15 || sides !== 8) {
				// Bottom layer
				lights27[0] = this.light[index - 273]
				lights27[1] = this.light[index - 272]
				lights27[2] = this.light[index - 271]
				lights27[3] = this.light[index - 257]
				lights27[4] = this.light[index - 256]
				lights27[5] = this.light[index - 255]
				lights27[6] = this.light[index - 241]
				lights27[7] = this.light[index - 240]
				lights27[8] = this.light[index - 239]

				// Middle layer
				lights27[9] = this.light[index - 17]
				lights27[10] = this.light[index - 16]
				lights27[11] = this.light[index - 15]
				lights27[12] = this.light[index - 1]
				lights27[14] = this.light[index + 1]
				lights27[15] = this.light[index + 15]
				lights27[16] = this.light[index + 16]
				lights27[17] = this.light[index + 17]

				// Top layer
				lights27[18] = this.light[index + 239]
				lights27[19] = this.light[index + 240]
				lights27[20] = this.light[index + 241]
				lights27[21] = this.light[index + 255]
				lights27[23] = this.light[index + 257]
				lights27[24] = this.light[index + 271]
				lights27[25] = this.light[index + 272]
				lights27[26] = this.light[index + 273]
			}
			if (sides !== 8) {
				// Bottom layer
				blocks27[0] = shadow[255 & this.blocks[index - 273]]
				blocks27[1] = shadow[255 & this.blocks[index - 272]]
				blocks27[2] = shadow[255 & this.blocks[index - 271]]
				blocks27[3] = shadow[255 & this.blocks[index - 257]]
				blocks27[4] = shadow[255 & this.blocks[index - 256]]
				blocks27[5] = shadow[255 & this.blocks[index - 255]]
				blocks27[6] = shadow[255 & this.blocks[index - 241]]
				blocks27[7] = shadow[255 & this.blocks[index - 240]]
				blocks27[8] = shadow[255 & this.blocks[index - 239]]

				// Middle layer
				blocks27[9] = shadow[255 & this.blocks[index - 17]]
				blocks27[10] = shadow[255 & this.blocks[index - 16]]
				blocks27[11] = shadow[255 & this.blocks[index - 15]]
				blocks27[12] = shadow[255 & this.blocks[index - 1]]
				blocks27[14] = shadow[255 & this.blocks[index + 1]]
				blocks27[15] = shadow[255 & this.blocks[index + 15]]
				blocks27[16] = shadow[255 & this.blocks[index + 16]]
				blocks27[17] = shadow[255 & this.blocks[index + 17]]
			}

			// Top layer
			blocks27[18] = shadow[255 & this.blocks[index + 239]]
			blocks27[19] = shadow[255 & this.blocks[index + 240]]
			blocks27[20] = shadow[255 & this.blocks[index + 241]]
			blocks27[21] = shadow[255 & this.blocks[index + 255]]
			blocks27[22] = shadow[255 & this.blocks[index + 256]]
			blocks27[23] = shadow[255 & this.blocks[index + 257]]
			blocks27[24] = shadow[255 & this.blocks[index + 271]]
			blocks27[25] = shadow[255 & this.blocks[index + 272]]
			blocks27[26] = shadow[255 & this.blocks[index + 273]]
		}
		else {
			// Lights
			let topLight = this.light[loc + 256]
			lights27[22] = topLight
			if (topLight !== 15 || sides !== 8) {
				// Lights in this chunk
				for (let x = -1, i = 0; x <= 1; x++) {
					for (let z = -1; z <= 1; z++, i++) {
						if (chunkX + x >= 0 && chunkZ + z >= 0 && chunkX + x < 16 && chunkZ + z < 16) {
							const index = loc + x * 16 + z
							lights27[i] = this.light[index - 256]
							lights27[i+9] = this.light[index]
							lights27[i+18] = this.light[index + 256]
						}
					}
				}

				// Lights in the other chunks
				for (let x = -1, i = 0; x <= 1; x++) {
					for (let z = -1; z <= 1; z++, i++) {
						if (chunkX + x < 0 || chunkZ + z < 0 || chunkX + x > 15 || chunkZ + z > 15) {
							let chunk = this.world.getChunk(worldX + x, worldZ + z)
							let index = worldY * 256 + (worldX + x & 15) * 16 + (worldZ + z & 15)
							lights27[i] = chunk.light[index - 256]
							lights27[i+9] = chunk.light[index]
							lights27[i+18] = chunk.light[index + 256]
						}
					}
				}
			}

			// Blocks in this chunk
			for (let x = -1, i = 0; x <= 1; x++) {
				for (let z = -1; z <= 1; z++, i++) {
					if (chunkX + x >= 0 && chunkZ + z >= 0 && chunkX + x < 16 && chunkZ + z < 16) {
						const index = loc + x * 16 + z
						blocks27[i] = shadow[255 & this.blocks[index - 256]]
						blocks27[i+9] = shadow[255 & this.blocks[index]]
						blocks27[i+18] = shadow[255 & this.blocks[index + 256]]
					}
				}
			}

			// Blocks in the other chunks
			for (let x = -1, i = 0; x <= 1; x++) {
				for (let z = -1; z <= 1; z++, i++) {
					if (chunkX + x < 0 || chunkZ + z < 0 || chunkX + x > 15 || chunkZ + z > 15) {
						const chunk = this.world.getChunk(worldX + x, worldZ + z)
						const index = worldY * 256 + (worldX + x & 15) * 16 + (worldZ + z & 15)
						blocks27[i] = shadow[255 & chunk.blocks[index - 256]]
						blocks27[i+9] = shadow[255 & chunk.blocks[index]]
						blocks27[i+18] = shadow[255 & chunk.blocks[index + 256]]
					}
				}
			}
		}
	}
	genMesh(indexBuffer, bigArray) {
		const { glExtensions, gl, glCache, renderLength, renderData } = this
		let index = 0
		if (!this.renderLength) {
			return index
		}
		let verts = null, texVerts = null, texShapeVerts = null,
			tx = 0, ty = 0

		let blockLight = 0
		let skyLight = 0
		let shadows = [1, 1, 1, 1], slights = [1, 1, 1, 1], blights = [1, 1, 1, 1]
		let blockMasks = Object.values(Block)
		const blocks27 = new Uint8Array(27)
		const lights27 = new Uint8Array(27)
		const cube = shapes.cube
		const edges = [[1, -0.5], [1, 0.5], [2, 0.5], [2, -0.5], [0, 0.5], [0, -0.5]]

		for (let i = 0; i < renderLength; i++) {
			const data = renderData[i]
			const sides = data >> 10 & 0x3f // 6 bit flags indicating which faces should be rendered
			const loc = data >>> 16 // #yyyyxxzz
			const block = blockData[this.blocks[loc]]
			const tex = block.textures
			const chunkX = loc >> 4 & 15
			const chunkY = loc >> 8
			const chunkZ = loc & 15

			const worldX = chunkX + this.x
			const worldY = chunkY
			const worldZ = chunkZ + this.z

			// Preload any blocks that will be used for the shadows/lighting.
			this.getSurroundingBlocks(loc, sides, blocks27, lights27)

			let shapeVerts = block.shape.verts
			let shapeTexVerts = block.shape.texVerts
			if (block.shape.getShape) {
				let newShape = block.shape.getShape(worldX, chunkY, worldZ, this.world, blockData)
				shapeVerts = newShape.verts
				shapeTexVerts = newShape.texVerts
			}

			if (block.shape !== cube) {
				// shadows = noShadows
				const light = this.light[loc]
				blockLight = (light >>> 4) / 15
				skyLight = (light & 15) / 15
			}

			for (let n = 0; n < 6; n++) {
				if (sides & blockMasks[n] && shapeVerts[n].length) {
					// Determine if lighting or shading are needed for a given face.
					let directionalFaces = shapeVerts[n]
					if (block.shape !== cube && (directionalFaces.length > 1 || directionalFaces[0][edges[n][0]] !== edges[n][1])) {
						// shadows = noShadows
						// if (block.name.includes("Door")) {
						// 	console.log(block.name, n, skyLight, block.id, directionalFaces[0])
						// }
						for (let a = 0; a < 4; a++) {
							blights[a] = blockLight
							slights[a] = skyLight
						}
					}
					else {
						slights = getLight[n](lights27, slights, 0x0f, 0)
						blights = getLight[n](lights27, blights, 0xf0, 4)
					}
					shadows = getShadows[n](blocks27)

					// Add vertices for a single rectangle.
					for (let facei = 0; facei < directionalFaces.length; facei++) {
						verts = directionalFaces[facei]
						texVerts = tex[n]
						tx = texVerts[0]
						ty = texVerts[1]
						texShapeVerts = shapeTexVerts[n][facei]

						bigArray[index] = verts[0] + worldX
						bigArray[index+1] = verts[1] + worldY
						bigArray[index+2] = verts[2] + worldZ
						bigArray[index+3] = tx + texShapeVerts[0]
						bigArray[index+4] = ty + texShapeVerts[1]
						bigArray[index+5] = shadows[0]
						bigArray[index+6] = slights[0]
						bigArray[index+7] = blights[0]

						bigArray[index+8] = verts[3] + worldX
						bigArray[index+9] = verts[4] + worldY
						bigArray[index+10] = verts[5] + worldZ
						bigArray[index+11] = tx + texShapeVerts[2]
						bigArray[index+12] = ty + texShapeVerts[3]
						bigArray[index+13] = shadows[1]
						bigArray[index+14] = slights[1]
						bigArray[index+15] = blights[1]

						bigArray[index+16] = verts[6] + worldX
						bigArray[index+17] = verts[7] + worldY
						bigArray[index+18] = verts[8] + worldZ
						bigArray[index+19] = tx + texShapeVerts[4]
						bigArray[index+20] = ty + texShapeVerts[5]
						bigArray[index+21] = shadows[2]
						bigArray[index+22] = slights[2]
						bigArray[index+23] = blights[2]

						bigArray[index+24] = verts[9] + worldX
						bigArray[index+25] = verts[10] + worldY
						bigArray[index+26] = verts[11] + worldZ
						bigArray[index+27] = tx + texShapeVerts[6]
						bigArray[index+28] = ty + texShapeVerts[7]
						bigArray[index+29] = shadows[3]
						bigArray[index+30] = slights[3]
						bigArray[index+31] = blights[3]
						index += 32
					}
				}
			}
		}

		if (!this.buffer) {
			this.buffer = gl.createBuffer()
		}
		let data = new Float32Array(bigArray.buffer, 0, index)

		// let maxY = 0
		// let minY = 255
		// for (let i = 1; i < data.length; i += 6) {
		// 	const y = data[i]
		// 	maxY = y > maxY ? y : maxY
		// 	minY = y < minY ? y : minY
		// }
		// this.maxY = maxY
		// this.minY = minY

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
	}
	tick() {
		if (this.edited) {
			// tick()
		}
	}
	compressSection(blocks) {
		let section = []
		let blockSet = new Set()
		for (let i = 0; i < 6; i++) section.push(new Int16Array(512).fill(-1))
		for (let i in blocks) {
			blockSet.add(blocks[i])
			let y = i >> 6
			let x = i >> 3 & 7
			let z = i & 7

			// 3 copies of the section, all oriented in different directions so we can see which one compresses the most
			section[0][(y & 7) << 6 | (x & 7) << 3 | z & 7] = blocks[i]
			section[1][(y & 7) << 6 | (z & 7) << 3 | x & 7] = blocks[i]
			section[2][(x & 7) << 6 | (y & 7) << 3 | z & 7] = blocks[i]
			section[3][(x & 7) << 6 | (z & 7) << 3 | y & 7] = blocks[i]
			section[4][(z & 7) << 6 | (x & 7) << 3 | y & 7] = blocks[i]
			section[5][(z & 7) << 6 | (y & 7) << 3 | x & 7] = blocks[i]
		}

		let palette = {}
		let paletteBlocks = Array.from(blockSet)
		paletteBlocks.forEach((block, index) => palette[block] = index)
		let paletteBits = BitArrayBuilder.bits(paletteBlocks.length)

		let bestBAB = null
		for (let i = 0; i < 6; i++) {
			let bab = new BitArrayBuilder()
			bab.add(paletteBlocks.length, 9)
			for (let block of paletteBlocks) bab.add(block, 16)

			// Store the orientation so it can be loaded properly
			let blocks = section[i]
			bab.add(i, 3)

			let run = null
			let runs = []
			let singles = []
			for (let i = 0; i < blocks.length; i++) {
				const block = blocks[i]
				if (block >= 0) {
					if (!run && i < blocks.length - 2 && blocks[i + 1] >= 0 && blocks[i + 2] >= 0) {
						run = [i, []]
						runs.push(run)
					}
					if (run) {
						if (run[1].length && block === run[1].at(-1)[1]) run[1].at(-1)[0]++
						else run[1].push([1, block])
					}
					else singles.push([i, blocks[i]])
				}
				else run = null
			}

			bab.add(runs.length, 8)
			bab.add(singles.length, 9)
			for (let [start, blocks] of runs) {
				// Determine the number of bits needed to store the lengths of each block type
				let maxBlocks = 0
				for (let block of blocks) maxBlocks = Math.max(maxBlocks, block[0])
				let lenBits = BitArrayBuilder.bits(maxBlocks)

				bab.add(start, 9).add(blocks.length, 9).add(lenBits, 4)
				for (let [count, block] of blocks) bab.add(count - 1, lenBits).add(palette[block], paletteBits)
			}
			for (let [index, block] of singles) {
				bab.add(index, 9).add(palette[block], paletteBits)
			}
			if (!bestBAB || bab.bitLength < bestBAB.bitLength) {
				bestBAB = bab
			}
		}
		return bestBAB
	}
	getSave() {
		if (!this.originalBlocks.length) return

		const bab = new BitArrayBuilder()
		if (this.edited || !this.saveData?.reader) {

			// Find all the edited blocks and sort them into 8x8x8 sections
			const sectionMap = {}
			const { blocks, originalBlocks } = this
			for (let i = 0; i < blocks.length; i++) {
				if (blocks[i] !== originalBlocks[i]) {
					let y = i >> 8
					let x = (i >> 4 & 15) + this.x
					let z = (i & 15) + this.z
					let str = `${x>>3},${y>>3},${z>>3}` // 8x8x8 sections
					if (!sectionMap[str]) {
						sectionMap[str] = []
					}
					sectionMap[str][(y & 7) << 6 | (x & 7) << 3 | z & 7] = blocks[i]
				}
			}

			// Compress edited blocks into binary
			for (let [coords, section] of Object.entries(sectionMap)) {
				let [sx, sy, sz] = coords.split(",").map(Number)
				bab.add(sx, 16).add(sy, 5).add(sz, 16)

				bab.append(this.compressSection(section))
			}
		}
		else {
			const { reader, startPos, endPos } = this.saveData
			reader.bit = startPos
			while (reader.bit < endPos) {
				let len = Math.min(endPos - reader.bit, 8)
				bab.add(reader.read(len), len)
			}
		}
		return bab
	}
	loadFromBlocks(blocks) {
		let last = 0
		for (let j in blocks) {
			last = +j
			let block = blocks[last]
			if (!blockData[block]) {
				if (blockData[block & 255]) block &= 255
				else block = blockIds.pumpkin
			}
			this.blocks[last] = block
			if (!this.doubleRender && blockData[block].semiTrans) {
				this.doubleRender = true
				if (!this.world.doubleRenderChunks.includes(this)) {
					this.world.doubleRenderChunks.push(this)
				}
			}
		}
		if (last >> 8 > this.maxY) this.maxY = last >> 8
	}
	load() {
		if (this.loaded) return
		const chunkX = this.x >> 4
		const chunkZ = this.z >> 4
		const str = `${chunkX},${chunkZ}`
		const load = this.world.loadFrom[str]

		if (load) {
			delete this.world.loadFrom[str]
			if (load.reader && !load.edits) this.saveData = {
				reader: load.reader,
				startPos: load.startPos,
				endPos: load.endPos
			}
			this.originalBlocks = this.blocks.slice()

			if (load.blocks) {
				// The initial world load had to parse the blocks, so they were stored.
				this.loadFromBlocks(load.blocks)
			}
			else if (load.reader) {
				// The chunk was loaded, then later unloaded.
				const getIndex = [
					(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 0 & 7),
					(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 3 & 7),
					(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 0 & 7),
					(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 3 & 7),
					(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 6 & 7),
					(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 6 & 7)
				]
				const { reader, startPos, endPos } = load

				reader.bit = startPos
				while (reader.bit < endPos) {
					let x = reader.read(16, true) * 8
					let y = reader.read(5, false) * 8
					let z = reader.read(16, true) * 8

					const paletteLen = reader.read(9)
					const paletteBits = BitArrayBuilder.bits(paletteLen)
					const palette = []
					for (let i = 0; i < paletteLen; i++) {
						let block = reader.read(16)
						if (!blockData[block]) {
							if (blockData[block & 255]) block &= 255
							else block = blockIds.pumpkin
						}
						palette.push(block)
						if (blockData[block].semiTrans) {
							this.doubleRender = true
							if (!this.world.doubleRenderChunks.includes(this)) {
								this.world.doubleRenderChunks.push(this)
							}
						}
					}

					const orientation = reader.read(3)

					const cx = x >> 4
					const cz = z >> 4

					// Make them into local chunk coords
					x = x !== cx * 16 ? 8 : 0
					z = z !== cz * 16 ? 8 : 0

					const runs = reader.read(8)
					const singles = reader.read(9)
					for (let j = 0; j < runs; j++) {
						let index = reader.read(9)
						const types = reader.read(9)
						const lenSize = reader.read(4)
						for (let k = 0; k < types; k++) {
							const chain = reader.read(lenSize) + 1
							const block = reader.read(paletteBits)
							for (let l = 0; l < chain; l++) {
								const i = getIndex[orientation](index, x, y, z)
								this.blocks[i] = palette[block]
								this.maxY = max(this.maxY, i >> 8)
								index++
							}
						}
					}
					for (let j = 0; j < singles; j++) {
						const index = reader.read(9)
						const block = reader.read(paletteBits)
						const i = getIndex[orientation](index, x, y, z)
						this.blocks[i] = palette[block]
						this.maxY = max(this.maxY, i >> 8)
					}
				}
			}

			// Edits happened while the chunk was unloaded.
			if (load.edits) {
				this.loadFromBlocks(load.edits)
			}
		}
		this.loaded = true
	}
	unload() {
		if (this.originalBlocks) {
			const save = this.getSave()
			if (save) {
				const chunkX = this.x >> 4
				const chunkZ = this.z >> 4
				const str = `${chunkX},${chunkZ}`
				this.world.loadFrom[str] = {
					startPos: 0,
					endPos: save.bitLength,
					reader: new BitArrayReader(save.array)
				}
			}
		}
		if (this.buffer) this.gl.deleteBuffer(this.buffer)
	}
}

export { Chunk }