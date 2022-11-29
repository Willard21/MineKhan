import { random, randomSeed, hash } from "./random.js"
import { blockData, blockIds, Block, Sides } from "./blockData.js"
import { textureMap, textureCoords } from "./texture.js"
let world

const { floor, max, abs } = Math
const semiTrans = new Uint8Array(blockData.filter((data, i) => data && i < 256).map(data => data.semiTrans ? 1 : 0))
const transparent = new Uint8Array(1 << 13) // 5 bits of block state
for (let i = 0; i < blockData.length; i++) transparent[i] = blockData[i].transparent ? 1 : 0
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
	top: function(x, y, z) { // Actually the bottom... How did these get flipped?
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
	bottom: function(x, y, z) { // Actually the top
		let blocks = this.blocks
		let ret = this.ret
		blocks[0] = shadow[255 & world.getBlock(x-1, y+1, z-1)]
		blocks[1] = shadow[255 & world.getBlock(x, y+1, z-1)]
		blocks[2] = shadow[255 & world.getBlock(x+1, y+1, z-1)]
		blocks[3] = shadow[255 & world.getBlock(x-1, y+1, z)]
		blocks[4] = shadow[255 & world.getBlock(x, y+1, z)]
		blocks[5] = shadow[255 & world.getBlock(x+1, y+1, z)]
		blocks[6] = shadow[255 & world.getBlock(x-1, y+1, z+1)]
		blocks[7] = shadow[255 & world.getBlock(x, y+1, z+1)]
		blocks[8] = shadow[255 & world.getBlock(x+1, y+1, z+1)]

		ret[0] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]
		ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]
		ret[2] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]
		ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]
		return ret
	},
	north: function(x, y, z) {
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
	south: function(x, y, z) {
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
	east: function(x, y, z) {
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
	west: function(x, y, z) {
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
	top: function(x, y, z, ret, blockLight = 0) { // Actually the bottom... How did these get flipped?
		const face = world.getLight(x, y-1, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x,   y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x-1, y-1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y-1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x,   y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 0, 1, 3)
		ret[1] = average(blocks, 4, 1, 2, 5)
		ret[2] = average(blocks, 4, 5, 7, 8)
		ret[3] = average(blocks, 4, 3, 6, 7)
		// debugger
		return ret
	},
	bottom: function(x, y, z, ret, blockLight = 0) { // Actually the top
		const face = world.getLight(x, y+1, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x,   y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x-1, y+1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y+1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x,   y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 3, 6, 7)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 1, 2, 5)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	north: function(x, y, z, ret, blockLight = 0) {
		const face = world.getLight(x, y, z+1, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x,   y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x-1, y,   z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y,   z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x,   y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 5, 7, 8)
		ret[1] = average(blocks, 4, 3, 6, 7)
		ret[2] = average(blocks, 4, 0, 1, 3)
		ret[3] = average(blocks, 4, 1, 2, 5)
		return ret
	},
	south: function(x, y, z, ret, blockLight = 0) {
		const face = world.getLight(x, y, z-1, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x-1, y,   z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x,   y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x,   y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x+1, y,   z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 1, 2, 5)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 3, 6, 7)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	east: function(x, y, z, ret, blockLight = 0) {
		const face = world.getLight(x+1, y, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x+1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x+1, y,   z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x+1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x+1, y-1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x+1, y+1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x+1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x+1, y,   z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x+1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 1, 2, 5)
		ret[1] = average(blocks, 4, 5, 7, 8)
		ret[2] = average(blocks, 4, 3, 6, 7)
		ret[3] = average(blocks, 4, 0, 1, 3)
		return ret
	},
	west: function(x, y, z, ret, blockLight = 0) {
		const face = world.getLight(x-1, y, z, blockLight)
		if (face === 0 || face === 15) {
			const n = face / 15
			ret[0] = n
			ret[1] = n
			ret[2] = n
			ret[3] = n
			return ret
		}
		let blocks = this.blocks
		blocks[0] = (world.getLight(x-1, y-1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[1] = (world.getLight(x-1, y,   z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[2] = (world.getLight(x-1, y+1, z-1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[3] = (world.getLight(x-1, y-1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[4] = face
		blocks[5] = (world.getLight(x-1, y+1, z  ) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[6] = (world.getLight(x-1, y-1, z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[7] = (world.getLight(x-1, y,   z+1) & 0xf << blockLight * 4) >> blockLight * 4
		blocks[8] = (world.getLight(x-1, y+1, z+1) & 0xf << blockLight * 4) >> blockLight * 4

		ret[0] = average(blocks, 4, 5, 7, 8)
		ret[1] = average(blocks, 4, 1, 2, 5)
		ret[2] = average(blocks, 4, 0, 1, 3)
		ret[3] = average(blocks, 4, 3, 6, 7)
		return ret
	},
}

class Chunk {
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
		this.light = new Uint8Array(16*16*256)
		this.pallete = [0]
		this.palleteMap = { "0": 0 }
		this.palleteSize = 0
		this.renderData = []
		this.renderLength = 0
		world = WoRlD
	}
	getBlock(x, y, z) {
		// if (y < 0 || y > 255) debugger
		return this.blocks[y * 256 + x * 16 + z]
	}
	setBlock(x, y, z, blockID, user) {
		this.edited |= user
		if (semiTrans[blockID & 255]) {
			this.doubleRender = true
			if (!this.world.doubleRenderChunks.includes(this)) {
				this.world.doubleRenderChunks.push(this)
			}
		}
		this.blocks[y * 256 + x * 16 + z] = blockID
	}
	fillLight() {
		let max = 255 // min(this.maxY + 1, 255)
		let blockSpread = []

		// Find top block in chunk, and fill all air blocks above it with light
		this.maxY = 0
		const { blocks } = this
		for (let i = blocks.length - 1; i > 0; i--) {
			if (blocks[i] !== 0 && this.maxY === 0) this.maxY = i >>> 8
			if (!transparent[255 & blocks[i]]) {
				max = i >>> 8
				this.light.fill(15, i - 1, blocks.length)
				break
			}
		}

		// Set vertical columns of light to level 15
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				let stop = false
				for (let y = max; y > 0; y--) {
					const block = this.getBlock(x, y, z)
					const light = lightLevels[255 & block]
					if (light) {
						if (!blockSpread[light]) blockSpread[light] = []
						blockSpread[light].push(x + this.x, y, z + this.z)
						this.setBlockLight(x, y, z, light)
					}
					if (!stop && !transparent[255 & block]) {
						this.tops[z * 16 + x] = y
						stop = true
					}
					else if (!stop) {
						this.setSkyLight(x, y, z, 15)
					}
				}
			}
		}
		// Set vertical columns of light to level 15 in neighboring chunk borders so we won't need to spread into them.
		for (let x = this.x - 1; x <= this.x + 16; x += 17) {
			for (let z = this.z - 1; z <= this.z + 16; z++) {
				for (let y = 255; y > 0 && transparent[255 & world.getBlock(x, y, z)]; y--) {
					world.setLight(x, y, z, 15, 0)
				}
			}
		}
		for (let x = this.x; x < this.x + 16; x++) {
			for (let z = this.z - 1; z <= this.z + 16; z += 17) {
				for (let y = 255; y > 0 && transparent[255 & world.getBlock(x, y, z)]; y--) {
					world.setLight(x, y, z, 15, 0)
				}
			}
		}

		// Spread the light to places where the vertical columns stopped earlier, plus chunk borders
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
	setLight(x, y, z, level) {
		const i = y * 256 + x * 16 + z
		this.light[i] = level
		// debugger
	}
	setBlockLight(x, y, z, level) {
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
	optimize() {
		const { world, x, z, blocks, maxY } = this
		// for (let i = 0; i < this.sections.length; i++) {
		// 	this.sections[i].optimize(screen)
		// }
		let visible = false
		let pos = 0
		let blockState = 0
		let palleteIndex = 0
		let index = 256
		this.renderLength = 0

		//Check all the blocks in the subchunk to see if they're visible.
		for (let j = 1; j <= maxY; j++) {
			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++, index++) {
					blockState = blocks[index]

					if (this.palleteMap[blockState] === undefined) {
						this.palleteMap[blockState] = this.pallete.length
						palleteIndex = this.pallete.length
						this.pallete.push(blockState)
					}
					else {
						palleteIndex = this.palleteMap[blockState]
					}

					visible = blockState
					&&transparent[world.getBlock(x + i - 1, j, z + k)]
					| transparent[world.getBlock(x + i + 1, j, z + k)] << 1
					| transparent[this.getBlock(i, j - 1, k)] << 2
					| transparent[this.getBlock(i, j + 1, k)] << 3
					| transparent[world.getBlock(x + i, j, z + k - 1)] << 4
					| transparent[world.getBlock(x + i, j, z + k + 1)] << 5
					if (visible) {
						pos = (i | j << 4 | k << 12) << 16
						this.renderData[this.renderLength++] = pos | visible << 10 | palleteIndex
					}
				}
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
		let blockState = this.blocks[j * 256 + i * 16 + k]
		let visible = blockState
		&&transparent[world.getBlock(x - 1, y, z)]
		| transparent[world.getBlock(x + 1, y, z)] << 1
		| transparent[world.getBlock(x, y - 1, z)] << 2
		| transparent[world.getBlock(x, y + 1, z)] << 3
		| transparent[world.getBlock(x, y, z - 1)] << 4
		| transparent[world.getBlock(x, y, z + 1)] << 5
		let pos = (i | j << 4 | k << 12) << 16
		let index = -1

		// Find index of current block in this.renderData
		for (let i = 0; i < this.renderLength; i++) {
			if ((this.renderData[i] & 0xffff0000) === pos) {
				index = i
				break
			}
		}

		// Update pallete
		if (this.palleteMap[blockState] === undefined) {
			this.palleteMap[blockState] = this.pallete.length
			this.pallete.push(blockState)
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
		this.renderData[index] = pos | visible << 10 | this.palleteMap[blockState]
	}
	deleteBlock(x, y, z) {
		this.blocks[y * 256 + x * 16 + z] = 0
		this.minY = y < this.minY ? y : this.minY
	}
	async getCaveData() {
		while (!window.workers.length) {
			await Promise.race(window.pendingWorkers)
		}
		this.caveData = window.doWork({
			caves: true,
			x: this.x,
			y: 0,
			z: this.z
		}).then(data => data.caves)
	}
	async carveCaves() {
		const { world } = this

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
		const { glExtensions, gl, glCache, renderLength, renderData, pallete } = this
		let index = 0
		if (!this.renderLength) {
			return index
		}
		let verts = null, texVerts = null, texShapeVerts = null,
			tx = 0, ty = 0

		let shadows = null, slights = [0, 0, 0, 0], blights = [0, 0, 0, 0]
		let blockSides = Object.keys(Block)
		let side = ""

		for (let i = 0; i < renderLength; i++) {
			const data = renderData[i]
			const block = blockData[pallete[data & 0x3ff]]
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

			const shapeVerts = block.shape.verts
			const shapeTexVerts = block.shape.texVerts

			let texNum = 0
			for (let n = 0; n < 6; n++) {
				side = blockSides[n]
				if (sides & Block[side]) {
					shadows = getShadows[side](worldX, worldY, worldZ)
					slights = getLight[side](worldX, worldY, worldZ, slights, 0)
					blights = getLight[side](worldX, worldY, worldZ, blights, 1)
					let directionalFaces = shapeVerts[Sides[side]]

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

export { Chunk }