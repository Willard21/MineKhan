import { random, randomSeed, hash, noiseProfile } from "./random.js"
import { blockData, blockIds, Block } from "./blockData.js"
import { textureMap, textureCoords } from "./texture.js"
let world

const { floor, max, abs } = Math
const semiTrans = new Uint8Array(blockData.filter((data, i) => data && i < 256).map(data => data.semiTrans ? 1 : 0))
const transparent = new Uint8Array(1 << 13) // 5 bits of block state
for (let i = 0; i < blockData.length; i++) transparent[i] = blockData[i].transparent ? 1 : 0
const hideInterior = new Uint8Array(255)
hideInterior.set(blockData.slice(0, 255).map(data => data.hideInterior))

transparent.fill(1, 256) // Anything other than default cubes should be considered transparent for lighting and face culling

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

function carveSphere(x, y, z, world) {
	if (y > 3) {
		for (let i = 0; i < sphere.length; i += 3) {
			world.setWorldBlock(x + sphere[i], y + sphere[i + 1], z + sphere[i + 2], blockIds.air, true)
		}
	}
}

let getShadows = {
	shade: [1, 0.85, 0.7, 0.6, 0.3],
	ret: [],
	blocks: [],
	top: function(x, y, z, world) { // Actually the bottom... How did these get flipped?
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x-1, y-1, z-1)]
		blocks[1] = shadow[255 & world.getBlock(x, y-1, z-1)]
		blocks[2] = shadow[255 & world.getBlock(x+1, y-1, z-1)]
		blocks[3] = shadow[255 & world.getBlock(x-1, y-1, z)]
		blocks[4] = shadow[255 & world.getBlock(x, y-1, z)]
		blocks[5] = shadow[255 & world.getBlock(x+1, y-1, z)]
		blocks[6] = shadow[255 & world.getBlock(x-1, y-1, z+1)]
		blocks[7] = shadow[255 & world.getBlock(x, y-1, z+1)]
		blocks[8] = shadow[255 & world.getBlock(x+1, y-1, z+1)]

		ret[0] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.75
		ret[1] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.75
		ret[2] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.75
		ret[3] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.75
		return ret
	},
	bottom: function(x, y, z, world) { // Actually the top
		let ret = this.ret
		let b0 = shadow[255 & world.getBlock(x-1, y+1, z-1)]
		let b1 = shadow[255 & world.getBlock(x, y+1, z-1)]
		let b2 = shadow[255 & world.getBlock(x+1, y+1, z-1)]
		let b3 = shadow[255 & world.getBlock(x-1, y+1, z)]
		let b4 = shadow[255 & world.getBlock(x, y+1, z)]
		let b5 = shadow[255 & world.getBlock(x+1, y+1, z)]
		let b6 = shadow[255 & world.getBlock(x-1, y+1, z+1)]
		let b7 = shadow[255 & world.getBlock(x, y+1, z+1)]
		let b8 = shadow[255 & world.getBlock(x+1, y+1, z+1)]

		ret[0] = this.shade[b6 + b3 + b7 + b4]
		ret[1] = this.shade[b8 + b5 + b7 + b4]
		ret[2] = this.shade[b2 + b1 + b5 + b4]
		ret[3] = this.shade[b0 + b1 + b3 + b4]
		return ret
	},
	north: function(x, y, z, world) {
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x-1, y-1, z+1)]
		blocks[1] = shadow[255 & world.getBlock(x, y-1, z+1)]
		blocks[2] = shadow[255 & world.getBlock(x+1, y-1, z+1)]
		blocks[3] = shadow[255 & world.getBlock(x-1, y, z+1)]
		blocks[4] = shadow[255 & world.getBlock(x, y, z+1)]
		blocks[5] = shadow[255 & world.getBlock(x+1, y, z+1)]
		blocks[6] = shadow[255 & world.getBlock(x-1, y+1, z+1)]
		blocks[7] = shadow[255 & world.getBlock(x, y+1, z+1)]
		blocks[8] = shadow[255 & world.getBlock(x+1, y+1, z+1)]

		ret[0] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
		ret[1] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
		ret[2] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
		ret[3] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
		return ret
	},
	south: function(x, y, z, world) {
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x-1, y-1, z-1)]
		blocks[1] = shadow[255 & world.getBlock(x-1, y, z-1)]
		blocks[2] = shadow[255 & world.getBlock(x-1, y+1, z-1)]
		blocks[3] = shadow[255 & world.getBlock(x, y-1, z-1)]
		blocks[4] = shadow[255 & world.getBlock(x, y, z-1)]
		blocks[5] = shadow[255 & world.getBlock(x, y+1, z-1)]
		blocks[6] = shadow[255 & world.getBlock(x+1, y-1, z-1)]
		blocks[7] = shadow[255 & world.getBlock(x+1, y, z-1)]
		blocks[8] = shadow[255 & world.getBlock(x+1, y+1, z-1)]

		ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
		ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
		ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
		ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
		return ret
	},
	east: function(x, y, z, world) {
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x+1, y-1, z-1)]
		blocks[1] = shadow[255 & world.getBlock(x+1, y, z-1)]
		blocks[2] = shadow[255 & world.getBlock(x+1, y+1, z-1)]
		blocks[3] = shadow[255 & world.getBlock(x+1, y-1, z)]
		blocks[4] = shadow[255 & world.getBlock(x+1, y, z)]
		blocks[5] = shadow[255 & world.getBlock(x+1, y+1, z)]
		blocks[6] = shadow[255 & world.getBlock(x+1, y-1, z+1)]
		blocks[7] = shadow[255 & world.getBlock(x+1, y, z+1)]
		blocks[8] = shadow[255 & world.getBlock(x+1, y+1, z+1)]

		ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.8
		ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.8
		ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.8
		ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.8
		return ret
	},
	west: function(x, y, z, world) {
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x-1, y-1, z-1)]
		blocks[1] = shadow[255 & world.getBlock(x-1, y, z-1)]
		blocks[2] = shadow[255 & world.getBlock(x-1, y+1, z-1)]
		blocks[3] = shadow[255 & world.getBlock(x-1, y-1, z)]
		blocks[4] = shadow[255 & world.getBlock(x-1, y, z)]
		blocks[5] = shadow[255 & world.getBlock(x-1, y+1, z)]
		blocks[6] = shadow[255 & world.getBlock(x-1, y-1, z+1)]
		blocks[7] = shadow[255 & world.getBlock(x-1, y, z+1)]
		blocks[8] = shadow[255 & world.getBlock(x-1, y+1, z+1)]

		ret[0] = this.shade[blocks[7] + blocks[8] + blocks[4] + blocks[5]]*0.8
		ret[1] = this.shade[blocks[5] + blocks[4] + blocks[2] + blocks[1]]*0.8
		ret[2] = this.shade[blocks[4] + blocks[3] + blocks[1] + blocks[0]]*0.8
		ret[3] = this.shade[blocks[6] + blocks[7] + blocks[3] + blocks[4]]*0.8
		return ret
	},
}

function average(l, a, b, c, d) {
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

let getLight = {
	blocks: [],
	top: function(x, y, z, ret, blockLight, world) { // Actually the bottom... How did these get flipped?
		const face = world.getLight(x, y-1, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x,   y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x-1, y-1, z  ) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y-1, z  ) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x,   y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 0, 1, 3)
		ret[1] = average(blocks, 4, 1, 2, 5)
		ret[2] = average(blocks, 4, 5, 7, 8)
		ret[3] = average(blocks, 4, 3, 6, 7)
		return ret
	},
	bottom: function(x, y, z, ret, blockLight, world) { // Actually the top
		const face = world.getLight(x, y+1, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x,   y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x-1, y+1, z  ) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y+1, z  ) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x,   y+1, z+1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 3, 6, 7)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 1, 2, 5)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	north: function(x, y, z, ret, blockLight, world) {
		const face = world.getLight(x, y, z+1, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x,   y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x-1, y,   z+1) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y,   z+1) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x,   y+1, z+1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 5, 7, 8)
		ret[1] = average(blocks, 4, 3, 6, 7)
		ret[2] = average(blocks, 4, 0, 1, 3)
		ret[3] = average(blocks, 4, 1, 2, 5)
		return ret
	},
	south: function(x, y, z, ret, blockLight, world) {
		const face = world.getLight(x, y, z-1, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x-1, y,   z-1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x,   y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x,   y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x+1, y,   z-1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 1, 2, 5)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 3, 6, 7)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	east: function(x, y, z, ret, blockLight, world) {
		const face = world.getLight(x+1, y, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x+1, y,   z-1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x+1, y-1, z  ) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y+1, z  ) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x+1, y,   z+1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 1, 2, 5)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 3, 6, 7)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	west: function(x, y, z, ret, blockLight, world) {
		const face = world.getLight(x-1, y, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		blockLight *= 4
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight) >> blockLight
		blocks[1] = (world.getLight(x-1, y,   z-1) & 0xf << blockLight) >> blockLight
		blocks[2] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight) >> blockLight
		blocks[3] = (world.getLight(x-1, y-1, z  ) & 0xf << blockLight) >> blockLight
		blocks[4] = face
		blocks[5] = (world.getLight(x-1, y+1, z  ) & 0xf << blockLight) >> blockLight
		blocks[6] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight) >> blockLight
		blocks[7] = (world.getLight(x-1, y,   z+1) & 0xf << blockLight) >> blockLight
		blocks[8] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight) >> blockLight

		ret[0] = average(blocks, 4, 5, 7, 8)
		ret[1] = average(blocks, 4, 1, 2, 5)
		ret[2] = average(blocks, 4, 0, 1, 3)
		ret[3] = average(blocks, 4, 3, 6, 7)
		return ret
	},
}

class Chunk {
	/**
	 * @param {Number} x
	 * @param {Number} z
	 * @param {*} WoRlD
	 * @param {{vertex_array_object: OES_vertex_array_object}} glExtensions
	 * @param {WebGLRenderingContext} gl
	 * @param {Object} glCache
	 * @param {Boolean} superflat
	 * @param {Boolean} caves
	 */
	constructor(x, z, WoRlD, glExtensions, gl, glCache, superflat, caves) {
		this.x = x
		this.z = z
		this.maxY = 0
		this.minY = 255
		this.tops = new Uint8Array(16 * 16) // Store the heighest block at every (x,z) coordinate
		this.optimized = false
		this.generated = false // Terrain
		this.populated = superflat // Trees and ores
		this.lit = false
		this.edited = false
		this.loaded = false
		// vao for this chunk
		this.vao = glExtensions.vertex_array_object.createVertexArrayOES()
		this.caves = !caves
		this.world = WoRlD
		this.gl = gl
		this.glCache = glCache
		this.glExtensions = glExtensions
		this.doubleRender = false
		this.blocks = new Int16Array(16*16*256)
		this.originalBlocks = new Int16Array(0)
		this.light = new Uint8Array(16*16*256)
		this.palette = [0, blockIds.grass, blockIds.dirt, blockIds.stone, blockIds.bedrock]
		this.paletteMap = []
		for (let i = 0; i < 256; i++) this.paletteMap[i] = 0
		for (let i = 0; i < this.palette.length; i++) this.paletteMap[this.palette[i]] = i
		this.paletteSize = 2
		this.renderData = []
		this.renderLength = 0
		this.hasBlockLight = false
		world = WoRlD
	}
	getBlock(x, y, z) {
		// if (y < 0 || y > 255) debugger
		return this.blocks[y * 256 + x * 16 + z]
	}
	setBlock(x, y, z, blockID, user) {
		if (user && !this.edited) {
			this.edited = true
			this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}

		if (semiTrans[blockID & 255]) {
			this.doubleRender = true
			if (!this.world.doubleRenderChunks.includes(this)) {
				this.world.doubleRenderChunks.push(this)
			}
		}
		this.blocks[y * 256 + x * 16 + z] = blockID
	}
	fillLight() {
		let blockSpread = []

		this.maxY = 0
		const { blocks, hasBlockLight } = this

		// Find top block in chunk, and fill all air blocks above it with light
		for (let i = blocks.length - 1; !this.maxY && i > 255; i--) {
			if (blocks[i]) this.maxY = i >>> 8
		}
		if (!hasBlockLight) this.light.fill(15, this.maxY * 256)
		else for (let i = this.maxY * 256; i < blocks.length; i++) this.light[i] |= 15

		// Set vertical columns of light to level 15
		this.tops.fill(0)
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				let stop = false
				for (let y = this.maxY; y > 0; y--) {
					const block = this.getBlock(x, y, z)
					if (block > 74) { // 75 (glowstone) is the first light-emitting block
						// Spread block light
						const light = lightLevels[255 & block]
						if (light) {
							if (!blockSpread[light]) blockSpread[light] = []
							blockSpread[light].push(x + this.x, y, z + this.z)
							this.setBlockLight(x, y, z, light)
						}
					}

					if (!stop && block && !transparent[block]) {
						this.tops[z * 16 + x] = y
						stop = true
					}
					else if (!stop) {
						this.light[y * 256 + x * 16 + z] |= 15
						// this.setSkyLight(x, y, z, 15)
					}
				}
			}
		}

		// Set vertical columns of light to level 15 in neighboring chunk borders so we won't need to spread into them.
		for (let x = this.x - 1; x <= this.x + 16; x += 17) {
			for (let z = this.z - 1; z <= this.z + 16; z++) {
				if (world.getLight(x, 255, z) === 0) {
					let chunk = world.getChunk(x, z)
					let index = 255 * 256 + (x - chunk.x) * 16 + z - chunk.z
					let block = chunk.blocks[index]
					while (!block || transparent[block]) {
						chunk.light[index] |= 15
						index -= 256
						block = chunk.blocks[index]
					}
				}
			}
		}
		for (let x = this.x; x < this.x + 16; x++) {
			for (let z = this.z - 1; z <= this.z + 16; z += 17) {
				if (world.getLight(x, 255, z) === 0) {
					let chunk = world.getChunk(x, z)
					let index = 255 * 256 + (x - chunk.x) * 16 + z - chunk.z
					for (; transparent[255 & chunk.blocks[index]]; index -= 256) {
						chunk.light[index] |= 15
					}
				}
			}
		}

		// Spread the light to places where the vertical columns stopped earlier, plus chunk borders
		let spread = []
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.tops[z * 16 + x] + 1; y <= this.maxY; y++) {
					if (   x === 15 || this.tops[z * 16 + x + 1 ] > y
						|| x === 0  || this.tops[z * 16 + x - 1 ] > y
						|| z === 15 || this.tops[z * 16 + x + 16] > y
						|| z === 0  || this.tops[z * 16 + x - 16] > y
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
			if (transparent[world.getBlock(x, y, z)]) {
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
		let trans = transparent[world.getBlock(x, y, z)]
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
	generate() {
		let trueX = this.x
		let trueZ = this.z

		const { grass, dirt, stone, bedrock } = blockIds

		if (this.generated) {
			// throw "Wot? Why?"
			return false
		}

		const smoothness = 0.01 // How close hills and valleys are together
		const hilliness = 80 // Height of the hills
		const extra = 30 // Extra blocks stacked onto the terrain
		const superflat = this.populated
		let gen = 0
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				gen = superflat ? 4 : Math.round(noiseProfile.noise((trueX + i) * smoothness, (trueZ + k) * smoothness) * hilliness) + extra
				this.tops[k * 16 + i] = gen

				let index = i * 16 + k
				this.blocks[index] = bedrock
				index += 256
				for (let max = (gen - 3) * 256; index < max; index += 256) {
					this.blocks[index] = stone
				}
				this.blocks[index] = dirt
				this.blocks[index + 256] = dirt
				this.blocks[index + 512] = dirt
				this.blocks[index + 768] = grass
			}
		}
		this.generated = true
		this.getCaveData() // Queue up the multithreaded cave gen
	}
	optimize() {
		const { world, x, z, blocks, maxY } = this
		let index = 256
		this.renderLength = 0

		//Check all the blocks in the chunk to see if they're visible.
		for (let j = 1; j <= maxY; j++) {
			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++, index++) {
					let blockState = blocks[index]
					if (!blockState) continue

					if (!this.paletteMap[blockState]) {
						this.paletteMap[blockState] = this.palette.length
						this.palette.push(blockState)
					}

					let s = i      ? blocks[index - 16] : world.getBlock(x + i - 1, j, z + k)
					let n = i < 15 ? blocks[index + 16] : world.getBlock(x + i + 1, j, z + k)
					let d = blocks[index - 256]
					let u = blocks[index + 256]
					let w = k      ? blocks[index - 1] : world.getBlock(x + i, j, z + k - 1)
					let e = k < 15 ? blocks[index + 1] : world.getBlock(x + i, j, z + k + 1)

					let visible = transparent[s]
					+ transparent[n] * 2
					+ transparent[d] * 4
					+ transparent[u] * 8
					+ transparent[w] * 16
					+ transparent[e] * 32

					if (blockState > 6 && blockState < 256 && hideInterior[blockState]) {
						visible ^= s === blockState
						| (n === blockState) << 1
						| (d === blockState) << 2
						| (u === blockState) << 3
						| (w === blockState) << 4
						| (e === blockState) << 5
					}

					if (visible) {
						let pos = (i | j << 4 | k << 12) << 16
						this.renderData[this.renderLength++] = pos | visible << 10 | this.paletteMap[blockState]
					}
				}
			}
		}

		// The bottom layer of bedrock is only ever visible on top
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				let visible = transparent[this.blocks[256 + i*16 + k]] << 3
				let pos = (i | k << 12) << 16
				this.renderData[this.renderLength++] = pos | visible << 10 | 4
			}
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

		let s = i      ? this.blocks[index - 16] : world.getBlock(x - 1, j, z)
		let n = i < 15 ? this.blocks[index + 16] : world.getBlock(x + 1, j, z)
		let d = y      ? this.blocks[index - 256]: 4
		let u =          this.blocks[index + 256]
		let w = k      ? this.blocks[index - 1] : world.getBlock(x, j, z - 1)
		let e = k < 15 ? this.blocks[index + 1] : world.getBlock(x, j, z + 1)

		let visible = blockState && transparent[s]
		+ transparent[n] * 2
		+ transparent[d] * 4
		+ transparent[u] * 8
		+ transparent[w] * 16
		+ transparent[e] * 32

		if (blockState < 256 && hideInterior[blockState]) {
			visible ^= s === blockState
			| (n === blockState) << 1
			| (d === blockState) << 2
			| (u === blockState) << 3
			| (w === blockState) << 4
			| (e === blockState) << 5
		}

		let pos = (i | j << 4 | k << 12) << 16
		index = -1

		// Find index of current block in this.renderData
		for (let i = 0; i < this.renderLength; i++) {
			if ((this.renderData[i] & 0xffff0000) === pos) {
				index = i
				break
			}
		}

		// Update palette
		if (!this.paletteMap[blockState]) {
			this.paletteMap[blockState] = this.palette.length
			this.palette.push(blockState)
		}

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
			// Wasn't visible before, is visible after.
			index = this.renderLength++
		}
		this.renderData[index] = pos | visible << 10 | this.paletteMap[blockState]
	}
	deleteBlock(x, y, z, user) {
		if (user && !this.edited) {
			this.edited = true
			this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}
		this.blocks[y * 256 + x * 16 + z] = 0
		this.minY = y < this.minY ? y : this.minY
	}
	async getCaveData() {
		if (this.caves) return
		this.caveData = new Promise(async resolve => {
			while (!window.workers.length) {
				await Promise.race(window.pendingWorkers)
			}
			window.doWork({
				caves: true,
				x: this.x,
				y: 0,
				z: this.z
			}).then(data => resolve(data.caves))
		})
	}
	async carveCaves() {
		const { world } = this
		this.caves = true

		const caves = await this.caveData

		let sx = this.x, sy = 0, sz = this.z
		let cy = 0
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				cy = this.tops[z * 16 + x]
				cy = cy > 82 ? 82 : cy
				for (let y = 2; y <= cy; y++) {
					let i = y * 256 + x * 16 + z
					if (caves[i] === 1) {
						carveSphere(sx + x, sy + y, sz + z, world)
					}
					else if (caves[i] === 2) {
						this.blocks[i] = 0
					}
				}
			}
		}
		this.caveData = null
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

				const FLOWER   = 0x300
				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 0.0025 &&
					this.getBlock(i, ground, k) === blockIds.grass &&
					this.getBlock(i + 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k + 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k + 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k + 1) === blockIds.grass
				   ) {
					this.setBlock(i, ground + 1, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.poppy | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.poppy | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.poppy | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.poppy | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.poppy | FLOWER)
				}
				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 0.0025 &&
					this.getBlock(i, ground, k) === blockIds.grass &&
					this.getBlock(i + 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k + 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k + 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k + 1) === blockIds.grass
				   ) {
					this.setBlock(i, ground + 1, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.cornflower | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.cornflower | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.cornflower | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.cornflower | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.cornflower | FLOWER)
				}
				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 0.0025 &&
					this.getBlock(i, ground, k) === blockIds.grass &&
					this.getBlock(i + 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k + 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k + 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k) === blockIds.grass &&
					this.getBlock(i, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i + 1, ground, k - 1) === blockIds.grass &&
					this.getBlock(i - 1, ground, k + 1) === blockIds.grass
				   ) {
					this.setBlock(i, ground + 1, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dandelion | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dandelion | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dandelion | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dandelion | FLOWER)
					this.setBlock(i + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), ground + 1, k + Math.floor(Math.random() * 3) - Math.floor(Math.random() * 3), _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dandelion | FLOWER)
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
		const { glExtensions, gl, glCache, renderLength, renderData, palette } = this
		let index = 0
		if (!this.renderLength) {
			return index
		}
		let verts = null, texVerts = null, texShapeVerts = null,
			tx = 0, ty = 0

		let shadows = null, slights = [0, 0, 0, 0], blights = [0, 0, 0, 0]
		let blockSides = Object.keys(Block)
		let blockMasks = Object.values(Block)

		for (let i = 0; i < renderLength; i++) {
			const data = renderData[i]
			const block = blockData[palette[data & 0x3ff]]
			const tex = block.textures
			const sides = data >> 10 & 0x3f // 6 bit flags indicating which faces should be rendered
			const loc = data >>> 16 // #zzyyyyxx
			const chunkX = loc & 15
			const chunkY = loc >> 4 & 255
			const chunkZ = loc >> 12 & 15

			const worldX = chunkX + this.x
			const worldY = chunkY
			const worldZ = chunkZ + this.z
			// console.log(worldY)
			// debugger

			const corner = !chunkX || !chunkZ || !chunkY || chunkX === 15 || chunkZ === 15

			const shapeVerts = block.shape.verts
			const shapeTexVerts = block.shape.texVerts

			let texNum = 0
			for (let n = 0; n < 6; n++) {
				if (sides & blockMasks[n]) {
					let side = blockSides[n]
					if (corner) {
						shadows = getShadows[side](worldX, worldY, worldZ, this.world)
					}
					else {
						shadows = getShadows[side](chunkX, chunkY, chunkZ, this)
					}
					slights = getLight[side](worldX, worldY, worldZ, slights, 0, this.world)
					blights = getLight[side](worldX, worldY, worldZ, blights, 1, this.world)

					let directionalFaces = shapeVerts[n]

					// Add vertices for a single rectangle.
					for (let facei = 0; facei < directionalFaces.length; facei++) {
						verts = directionalFaces[facei]
						texVerts = textureCoords[textureMap[tex[texNum]]]
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
				texNum++
			}
		}

		if (!this.buffer) {
			this.buffer = gl.createBuffer()
		}
		let data = new Float32Array(bigArray.buffer, 0, index)

		let maxY = 0
		let minY = 255
		for (let i = 1; i < data.length; i += 6) {
			const y = data[i]
			maxY = y > maxY ? y : maxY
			minY = y < minY ? y : minY
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
	}
	tick() {
		if (this.edited) {
			// tick()
		}
	}
	load() {
		if (this.loaded) {
			return
		}
		const { world } = this
		let chunkX = this.x >> 4
		let chunkZ = this.z >> 4
		let str = `${chunkX},${chunkZ}`
		let load = world.loadFrom[str]
		if (load) {
			this.edited = true
			this.originalBlocks = this.blocks.slice()

			for (let j in load) {
				let block = load[j]
				this.blocks[+j] = block
				if (!this.doubleRender && blockData[block].semiTrans) {
					this.doubleRender = true
					if (!this.world.doubleRenderChunks.includes(this)) {
						this.world.doubleRenderChunks.push(this)
					}
				}
				// world.setBlock((j >> 8 & 15) + this.x, (j >> 4 & 15) + y, (j & 15) + this.z, load.blocks[j])
			}

			delete world.loadFrom[str]
			// world.loadKeys.splice(world.loadKeys.indexOf(str), 1)
		}
		this.loaded = true
	}
}

export { Chunk }