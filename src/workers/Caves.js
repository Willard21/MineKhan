/* eslint-env worker */
// @ts-check
import { noiseProfile, randomSeed, random, hash, seedHash } from "../js/random"

// Copy/pasted from src/js/utils.js for the workers
class BitArrayReader {
	/**
	 * @param {Uint8Array} array
	 */
	constructor(array) {
		this.data = array // Byte array; values are assumed to be under 256

		/**
		 * A pointer to the bit position of the reader; can be adjusted to read a different part of the array.
		 */
		this.bit = 0
	}

	/** @param {{data:Uint8Array,bit:Number}} obj */
	static from(obj) {
		let ret = new BitArrayReader(obj.data)
		ret.bit = obj.bit
		return ret
	}
	/**
	 * @param {number} bits
	 */
	read(bits, negative = false) {
		let openBits = 32 - bits
		let { data, bit } = this
		this.bit += bits // Move pointer
		if (bit > data.length * 8 || bit < 0) {
			throw "You done messed up A-A-Ron"
		}

		let unread = 8 - (bit & 7)
		let index = bit >>> 3
		let ret = 0
		while (bits > 0) {
			let n = data[index] & -1 >>> 32 - unread
			ret |= bits >= unread ? n << bits - unread : n >> unread - bits
			bits -= unread
			unread = 8
			index++
		}
		if (negative) {
			return ret << openBits >> openBits
		}
		return ret
	}
}

/**
 * @type {MessagePort[]}
 */
let workerPorts = []

/** @type {ArrayBuffer[][]} */
const messageQueue = []

/**
 * @type {{
 * shape: { cull: {top: Boolean,bottom: Boolean,north: Boolean,south: Boolean,east: Boolean,west: Boolean} },
 * semiTrans: Boolean, transparent: Boolean, hideInterior: Boolean, isCube: Boolean, lightLevel: Number
 * }[]}
 */
let blockData = []
/** @type {Object.<string, number>} */
let blockIds = {}
let workerID = 0
/** @type {string[]} */
let jobQueue = []
/** @type {Object.<string, {reader: BitArrayReader, startPos: Number, endPos: Number, blocks?: {}, edits?: {}}>} */
const saves = {}
let superflat = false
let spawnTrees = true
let spawnCaves = true
let rivers = true
/**
 * @type {((x: Number, z: Number) => Int8Array)}
 */
let getCarveData

/**
 * @type {(seed: number) => void}
 */
let seedNoise
/** @type {Map<String, ArrayBuffer[]>} */ const chunkPortMap = new Map()
/** @type {Map<String, PartialChunk>} */ const chunkMap = new Map()

{
	// This is my compiled cave generation code. I wrote it in C.
	// It includes an OpenSimplexNoise function,
	// plus the logic to carve caves within the borders of the chunk it's operating on.
	const program = new Uint8Array(atob("AGFzbQEAAAABEQNgAABgA3x8fAF8YAJ/fwF/AwQDAAECBAUBcAEBAQUEAQEBAQcdBAZtZW1vcnkCAAFiAAAIZ2V0Q2F2ZXMAAgFkAQAMAQAKzwYDAwABC4YEAgR/CHxEAAAAAAAA8D8gASAAoCACoERVVVVVVVXFv6IiByABoCILIAucIguhIgqhIAcgAKAiDCAMnCIMoSIIoKohA0GACCgCAEQAAAAAAADwPyAHIAKgIgcgB5wiB6EiDaEiCSAKoKogA0EBdHIgCSAIoKpBAnRyIAggCqAgDaAiCapBA3RyIAkgDaCqQQV0ciAJIAqgqkEHdHIgCSAIoKpBCXRyQaOXvWlsQd/mu+MDakEBdkHQAHBBAnRqKAIAIgRBf0YEQEQAAAAAAAAAAA8LIAIgB6EgDCALoCAHoERVVVVVVVXVv6IiAqAhCSABIAuhIAKgIQ0gACAMoSACoCEOQQZBCCAEQbADSBshBkQAAAAAAAAAACEBA0BEAAAAAAAAAEAgDSAEQQN0IgMrA8gCoCIAIACiIA4gAysDwAKgIgIgAqKgIAkgAysD0AKgIgogCqKgoSIIRAAAAAAAAAAAZUUEQCAIIAiiIgggCKIgACADKwPoAiAHoKogAysD2AIgDKCqQf8BcUHAwwBqLQAAIAMrA+ACIAugqmpqQf8BcUHAxQBqLAAAIgNBwccAaiwAALeiIAIgA0HAxwBqLAAAt6KgIAogA0HCxwBqLAAAt6KgoiABoCEBCyAEQQZqIQQgBUEBaiIFIAZHDQALIAFEAqnkvCzicz+iRAAAAAAAAOA/oAvAAgIDfwN8QYjIAEEAQYCkAfwLAEGACCECA0ACQEQAAAAAAADgPyACQQR2QQ9xIgQgAGq3RHsUrkfhepQ/oiIFIAJBCHa3RHsUrkfhepQ/oiIGIAJBD3EiAyABardEexSuR+F6lD+iIgcQAaGZRLpJDAIrh3Y/Zg0ARAAAAAAAAOA/IAYgByAFEAGhmUS6SQwCK4d2P2YNAAJAIARBAmtBC0sNACADQQJJDQBBACEEIANBDUsNAANAIAIgBEEBdEGI7AFqLgEAaiIDQYjIAGotAABBAUcEQCADQQI6AIhICyAEQQFyIgNB0QBGDQIgAiADQQF0QYjsAWouAQBqIgNBiMgAai0AAEEBRwRAIANBAjoAiEgLIARBAmohBAwACwALIAJBiMgAakEBOgAACyACQQFqIgJBgKABRw0AC0GIyAAL").split("").map(c => c.charCodeAt(0))).buffer

	WebAssembly.instantiate(program).then(wasm => {
		/** @type {{getCaves: Function, memory: Uint8ClampedArray, seed_noise?: (seed: Number)=>void}} */
		// @ts-ignore
		const exports = wasm.instance.exports
		console.log(exports)
		const wasmCaves = exports.getCaves // || exports.get_caves || exports.c
		const { buffer } = exports.memory //  || exports.a

		seedNoise = exports.seed_noise || (seed => {
			// Originally this stuff was generated in code
			const GRADIENTS_3D = new Int8Array([-11,4,4,-4,11,4,-4,4,11,11,4,4,4,11,4,4,4,11,-11,-4,4,-4,-11,4,-4,-4,11,11,-4,4,4,-11,4,4,-4,11,-11,4,-4,-4,11,-4,-4,4,-11,11,4,-4,4,11,-4,4,4,-11,-11,-4,-4,-4,-11,-4,-4,-4,-11,11,-4,-4,4,-11,-4,4,-4,-11])
			const POSITIONS = [-1,180,216,528,624,-1,912,288,144,360,252,816,-1,-1,720,216,-1,-1,72,960,-1,-1,912,36,144,360,0,816,-1,480,576,72,324,-1,144,-1,432,-1,624,36,-1,288,108,576,-1,864,-1,180,252,36,144,672,-1,-1,-1,108,-1,-1,396,-1,-1,-1,432,360,252,36,324,-1,768,-1,528,396,0,-1,252,480,-1,672,-1,360]
			const DATA = [0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-1,-255,0,1,255,0,-1,0,-255,1,0,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,-1,0,255,1,0,0,-1,-255,0,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,0,-1,255,0,1,0,-255,-1,0,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-4/3,-4/3,-255.33333333333334,1,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-2/3,-5/3,1,0,1,-4/3,-255.33333333333334,-4/3,1,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-2,-1,2,1,0,-2,-3,-1,1,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-1,-2,2,0,1,-2,-1,-3,1,0,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1,-3,-2,0,2,1,-1,-2,-3,0,1,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-4/3,-1/3,-1/3,1,0,0,-8/3,-2/3,-2/3,2,0,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-4/3,-1/3,0,1,0,-2/3,-8/3,-2/3,0,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-1/3,-4/3,0,0,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-255.33333333333334,-4/3,1,255,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-255.33333333333334,-4/3,-4/3,255,1,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-4/3,-255.33333333333334,1,1,255,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-2/3,-8/3,-2/3,0,2,0]
			const SPHERE = new Int16Array([-529, -528, -527, -513, -512, -511, -497, -496, -495, -289, -288, -287, -274, -273, -272, -271, -270, -258, -257, -256, -255, -254, -242, -241, -240, -239, -238, -225, -224, -223, -33, -32, -31, -18, -17, -16, -15, -14, -2, -1, 0, 1, 2, 14, 15, 16, 17, 18, 31, 32, 33, 223, 224, 225, 238, 239, 240, 241, 242, 254, 255, 256, 257, 258, 270, 271, 272, 273, 274, 287, 288, 289, 495, 496, 497, 511, 512, 513, 527, 528, 529])

			const positions = new Int32Array(buffer, 0, 80)
			const data = new Float64Array(buffer, positions.byteLength, DATA.length)
			const source = new Uint8Array(buffer, data.byteOffset + data.byteLength, 256)
			const perm = new Uint8Array(buffer, source.byteOffset + source.byteLength, 256)
			const perm3D = new Uint8Array(buffer, perm.byteOffset + perm.byteLength, 256)
			const gradients3D = new Int8Array(buffer, perm3D.byteOffset + perm3D.byteLength, GRADIENTS_3D.length)
			const caves = new Uint8Array(buffer, gradients3D.byteOffset + gradients3D.byteLength, 16 * 16 * 82)
			const sphere = new Int16Array(buffer, caves.byteOffset + caves.byteLength, SPHERE.length)

			sphere.set(SPHERE)
			positions.set(POSITIONS)
			data.set(DATA)
			gradients3D.set(GRADIENTS_3D)

			for (let i = 0; i < 256; i++) source[i] = i
			for (let i = 0; i < 3; i++) {
				seed = seed * 1664525 + 1013904223 | 0
			}
			for (let i = 255; i >= 0; i--) {
				seed = seed * 1664525 + 1013904223 | 0
				let r = (seed + 31) % (i + 1)
				if (r < 0) r += i + 1
				perm[i] = source[r]
				perm3D[i] = perm[i] % 24 * 3
				source[r] = source[i]
			}
		})
		getCarveData = (x, z) => {
			const ptr = wasmCaves(x, z)
			const arr = new Int8Array(buffer, ptr, 20992)
			return arr
		}
	})
}

// Leaves from top to bottom.
const leafPos = [
	[-1, 1, 0], [1, 1, 0], [0, 1, -1], [0, 1, 1], [0, 1, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1],
	[-2, -1, -1], [-2, -1, 0], [-2, -1, 1], [-1, -1, -2], [-1, -1, -1], [-1, -1, 0], [-1, -1, 1], [-1, -1, 2], [0, -1, -2], [0, -1, -1],
	[0, -1, 1], [0, -1, 2], [1, -1, -2], [1, -1, -1], [1, -1, 0], [1, -1, 1], [1, -1, 2], [2, -1, -1], [2, -1, 0], [2, -1, 1],
	[-2, -2, -1], [-2, -2, 0], [-2, -2, 1], [-1, -2, -2], [-1, -2, -1], [-1, -2, 0], [-1, -2, 1], [-1, -2, 2], [0, -2, -2], [0, -2, -1],
	[0, -2, 1], [0, -2, 2], [1, -2, -2], [1, -2, -1], [1, -2, 0], [1, -2, 1], [1, -2, 2], [2, -2, -1], [2, -2, 0], [2, -2, 1],
]
const randomLeaves = [
	[-2, -2, -2], [-2, -2, 2], [2, -2, -2], [2, -2, 2],
	[-2, -1, -2], [-2, -1, 2], [2, -1, -2], [2, -1, 2],
	[-1,  0, -1], [-1,  0, 1], [1,  0, -1], [1,  0, 1]
]
const sphereOffsets = new Int8Array([
	-2,-1,-1,-2,-1,0,-2,-1,1,-2,0,-1,-2,0,0,-2,0,1,-2,1,-1,-2,1,0,-2,1,1,-1,-2,-1,-1,-2,0,-1,-2,1,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,1,
	-1,-1,2,-1,0,-2,-1,0,-1,-1,0,0,-1,0,1,-1,0,2,-1,1,-2,-1,1,-1,-1,1,0,-1,1,1,-1,1,2,-1,2,-1,-1,2,0,-1,2,1,0,-2,-1,0,-2,0,0,-2,1,0,-1,-2,0,-1,-1,0,-1,0,0,-1,1,0,-1,
	2,0,0,-2,0,0,-1,0,0,0,0,0,1,0,0,2,0,1,-2,0,1,-1,0,1,0,0,1,1,0,1,2,0,2,-1,0,2,0,0,2,1,1,-2,-1,1,-2,0,1,-2,1,1,-1,-2,1,-1,-1,1,-1,0,1,-1,1,1,-1,2,1,0,-2,1,0,-1,1,0,
	0,1,0,1,1,0,2,1,1,-2,1,1,-1,1,1,0,1,1,1,1,1,2,1,2,-1,1,2,0,1,2,1,2,-1,-1,2,-1,0,2,-1,1,2,0,-1,2,0,0,2,0,1,2,1,-1,2,1,0,2,1,1
])

class PartialChunk {
	/**
	 * @param {number} x
	 * @param {number} z
	 */
	constructor(x, z) {
		this.x = x
		this.z = z
		this.cx = x >> 4
		this.cz = z >> 4
		const buffer = new ArrayBuffer(0)
		this.blocks = new Int16Array(buffer)
		this.tops = new Int16Array(buffer)
		this.light = new Uint8Array(buffer)
		this.flags = new Int8Array(buffer) // flagPool.pop()
		/**
		 * @type {Number[]}
		 */
		this.renderData = []
		this.doubleRender = false
		/**
		 * Edits this chunk made to its neighbors
		 * @type {Number[][]}
		 * */
		this.neighbors = [[], [], [], [], [], [], [], [], []]
		this.maxY = 0
		this.minY = 255
		/**
		 * Edits neighbors made to this chunk
		 * @type {Int32Array[]}
		 */
		this.edits = []
		this.stage = 0
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	getBlock(x, y, z) {
		return this.blocks[y * 256 + x * 16 + z]
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {number} blockID
	 */
	setBlock(x, y, z, blockID) {
		const chunkIndex = ((x >> 4) + 1) * 3 + ((z >> 4) + 1)
		const blockIndex = y * 256 + (x&15) * 16 + (z&15)
		if (chunkIndex === 4) {
			this.blocks[blockIndex] = blockID
		}
		else {
			this.neighbors[chunkIndex].push(blockIndex << 16 | blockID)
		}
	}
	generateGround() {
		const { grass, dirt, stone, bedrock, sand, water } = blockIds
		const { blocks, tops } = this
		const { abs } = Math
		const cx = this.x
		const cz = this.z

		const waterHeight = 55
		const smoothness = 0.01 // How close hills and valleys are together
		const hilliness = 80 // Height of the hills
		const extra = 30 // Extra blocks stacked onto the terrain
		let gen = 0
		let index2d = 0
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				if (superflat) {
					gen = 4
					tops[index2d] = gen
				}
				else {
					let n = noiseProfile.noise((cx + i) * smoothness, (cz + k) * smoothness)
					gen = Math.round(n * hilliness + extra)
					if (rivers) {
						const m = (1 - abs(noiseProfile.noise((cz + k - 5432.123) * 0.003, (cx + i + 9182.543) * 0.003) - 0.5))**50
						gen = Math.round((waterHeight - 5 - gen) * m + gen)
					}
					tops[index2d] = gen > waterHeight ? gen : waterHeight
				}
				if (gen < this.minY) this.minY = gen
				if (gen > this.maxY) this.maxY = gen

				let index = index2d
				blocks[index] = bedrock
				index += 256
				for (let max = (gen - 3) * 256; index < max; index += 256) {
					blocks[index] = stone
				}
				if (gen > waterHeight || !rivers || superflat) {
					blocks[index] = dirt
					blocks[index + 256] = dirt
					blocks[index + 512] = dirt
					blocks[index + 768] = grass
				}
				else {
					blocks[index] = sand
					blocks[index + 256] = sand
					blocks[index + 512] = sand
					blocks[index + 768] = sand
					for (index += 1024; index < (waterHeight + 1) * 256; index += 256) blocks[index] = water
					if (gen <= waterHeight) this.doubleRender = true
				}
				index2d++
			}
		}
	}
	carveCaves() {
		const { tops, blocks } = this
		const arr = getCarveData(this.x, this.z)
		const lowest = (Math.min(...tops) - 1) * 256
		for (let i = 512; i < lowest; i++) {
			if (arr[i] === 1) {
				// Carve a sphere centered at index i
				let ix = i >> 4 & 15
				let iy = i >> 8
				let iz = i & 15
				for (let j = 0; j < sphereOffsets.length; j += 3) {
					this.setBlock(ix + sphereOffsets[j], iy + sphereOffsets[j + 1], iz + sphereOffsets[j + 2], 0)
				}
				if (iy - 3 < this.minY) this.minY = iy - 3
			}
			else if (arr[i] === 2) {
				blocks[i] = 0
				if (i >> 8 < this.minY + 1) this.minY = (i >> 8) - 1
			}
		}
	}
	addTrees() {
		const { floor, min } = Math
		const { blocks, tops, x, z } = this

		// Really need to import blockIds and blockData.
		const { grass, oakLog, birchLog, leaves, dirt, stone, diamondOre, goldOre, ironOre, coalOre, lapisOre, redstoneOre, poppy, cornflower, dandelion } = blockIds

		randomSeed(hash(x, z) * 210000000) // Hash is seeded with the world seed, so this doesn't need to be.

		// Spawn trees and ores
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				let ground = tops[i * 16 + k]

				// Tree
				if (spawnTrees && random() < 0.005 && this.getBlock(i, ground, k) === grass) {
					let top = ground + floor(4.5 + random(2.5))
					let rand = floor(random(4096))
					let tree = random() < 0.6 ? oakLog : ++top && birchLog
					if (top + 1 > this.maxY) this.maxY = top + 1

					// Tree trunk
					for (let j = ground + 1; j <= top; j++) {
						this.setBlock(i, j, k, tree)
					}
					tops[i * 16 + k] = top + 1 // Say the top of the tree is the top
					this.setBlock(i, ground, k, dirt)

					// Leaves
					for (let [dx, dy, dz] of leafPos) {
						this.setBlock(i + dx, top + dy, k + dz, leaves)
					}

					// 12 randomly placed leaves
					for (let [dx, dy, dz] of randomLeaves) {
						if (rand & 1) {
							this.setBlock(i + dx, top + dy, k + dz, leaves)
						}
						rand >>>= 1
					}
				}

				// Blocks of each per chunk in Minecraft
				// Coal: 185.5
				// Iron: 111.5
				// Gold: 10.4
				// Redstone: 29.1
				// Diamond: 3.7
				// Lapis: 4.1
				ground -= 4
				// while (blocks[ground * 256 + i * 16 + k] !== stone) ground--

				let xzi = i * 16 + k
				if (random() < 3.7 / 256) {
					let y = random(1, 16) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = diamondOre
					}
				}

				if (random() < 111.5 / 256) {
					let y = random(1, min(64, ground)) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = ironOre
					}
				}

				if (random() < 185.5 / 256) {
					let y = random(1, ground) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = coalOre
					}
				}

				if (random() < 10.4 / 256) {
					let y = random(1, 32) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = goldOre
					}
				}

				if (random() < 29.1 / 256) {
					let y = random(1, 16) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = redstoneOre
					}
				}

				if (random() < 4.1 / 256) {
					let y = random(1, 32) << 8
					if (blocks[xzi + y] === stone) {
						blocks[xzi + y] = lapisOre
					}
				}
			}
		}

		// Spawn flower patches; 1 in 4 chunks will have a patch
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {

				if (spawnTrees && random() < 0.0009765625) {
					const types = []
					if (random() < 0.5) types.push(poppy)
					if (random() < 0.5) types.push(cornflower)
					if (random() < 0.5) types.push(dandelion)

					for (let i = 0; i < types.length * 4; i++) {
						let x = i + random(-2, 3) | 0
						let z = k + random(-2, 3) | 0
						if (x < 0) x += random(x, 5)
						if (x > 15) x -= random(x-15, 5)
						let y = tops[x * 16 + z]
						let index = y * 256 + x * 16 + z
						if (blocks[index] === grass && !blocks[index + 256]) {
							blocks[index + 256] = types[random(types.length) | 0]
						}
					}
				}
			}
		}
	}
	applyNeighborEdits() {
		// TO-DO: Resolve overlapping neighbor edits at chunk corners deterministically
		const { max } = Math
		for (let arr of this.edits) {
			for (let i = 0; i < arr.length; i++) {
				const data = arr[i]
				const blockID = data & 0xffff
				const pos = data >>> 16

				// Leaves aren't allowed to overwrite non-air blocks
				if (blockID !== blockIds.leaves || !this.blocks[pos]) {
					this.blocks[pos] = blockID
				}

				const y = data >>> 24
				const xz = data >> 16 & 255
				if (y > this.tops[xz]) this.tops[xz] = y
				this.maxY = max(this.maxY, y) // Leaves are usually higher than than the ground
			}
		}
	}
	/**
	 * @param {Object.<number, number>} blocks
	 */
	loadFromBlocks(blocks) {
		let last = 0
		for (let j in blocks) {
			last = +j
			let block = blocks[last]
			if (!blockData[block]) { // Loading a non-existent block. Replace it with a pumpkin.
				if (blockData[block & 255]) block &= 255
				else block = blockIds.pumpkin
			}
			this.blocks[last] = block
			if (!this.doubleRender && blockData[block].semiTrans) {
				this.doubleRender = true
			}
		}
		if (last >> 8 > this.maxY) this.maxY = last >> 8
	}
	load() {
		const { max } = Math

		// Load player edits if they exist
		const str = `${this.cx},${this.cz}`
		const load = saves[str]

		if (load) {
			if (load.reader) load.reader = BitArrayReader.from(load.reader)
			delete saves[str]
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

				/** @type {((index:number,x:number,y:number,z:number)=>number)[]} */
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
					const paletteBits = Math.ceil(Math.log2(paletteLen))
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
	}
	addLight() {
		const { blocks, tops, light, maxY } = this
		// Drop light straight down from the sky
		light.fill(15, (maxY + 1) * 256)
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				const xz = x * 16 + z
				for (let y = maxY * 256; y > 0; y -= 256) {
					const block = blocks[y + xz]
					if (block && !blockData[block].transparent) {
						tops[xz] = y >> 8
						break
					}
					light[y + xz] = 15
				}
			}
		}

		// Calculate where sky light can potentially spread from based on tops
		let skyLightSpread = []
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				const i = x * 16 + z
				let y = tops[i]
				const nx = x && tops[i - 16]
				const px = x < 15 ? tops[i + 16] : 0
				const nz = z && tops[i - 1]
				const pz = z < 15 ? tops[i + 1] : 0
				// Check all 4 neighbors heights; if there's a chance they're casting a shadow, try to spread these blocks outward.
				while (x > 0 && nx - y > 1 || x < 15 && px - y > 1 || z > 0 && nz - y > 1 || z < 15 && pz - y > 1) {
					y++
					skyLightSpread.push(y * 256 + i)
				}
			}
		}
		const skyLights = []
		skyLights[15] = skyLightSpread
		this.spreadLight(skyLights, false)
	}

	/**
	 * Spreads light within a single 16×256×16 chunk using a level-based flood fill.
	 *
	 * @param {Array<number[]>} sources - Array of 16 arrays (one per light level),
	 *   where each contains the block indices emitting that level of light.
	 *   This structure is reused and modified in-place during the spread.
	 * @param {boolean} block - If true, modifies block light (upper 4 bits).
	 *   If false, modifies skylight (lower 4 bits).
	 *
	 * Light spreads to transparent blocks if the existing light level is ≤ the new level.
	 * Only spreads within the same chunk — no boundary checks.
	 */
	spreadLight(sources, block) {
		const { blocks, light } = this
		const shift = block ? 4 : 0

		/**
		 * A helper function for the BFS lighting
		 * @param {Number} index The index of the block to push
		 * @param {Number[]} pushTo The array to push the index to
		 * @param {Number} newLevel The light level to assign to the block if it's transparent and darker than this
		 */
		const pushIfValid = (index, pushTo, newLevel) => {
			if (blockData[blocks[index]].transparent && (light[index] >> shift & 15) < newLevel) {
				light[index] = block ? light[index] & 15 | newLevel << 4 : light[index] & 0xf0 | newLevel
				pushTo.push(index)
			}
		}
		for (let i = 0; i < sources.length; i++) if (!sources[i]) sources[i] = []
		for (let level = sources.length - 1; level > 0; level--) {
			const coords = sources[level]
			for (let i = 0; i < coords.length; i++) {
				const index = coords[i]
				if (level === 1) continue

				if (index & 15)                 pushIfValid(index - 1, sources[level - 1], level - 1)
				if ((index & 15) < 15)          pushIfValid(index + 1, sources[level - 1], level - 1)
				if (index >> 4 & 15)            pushIfValid(index - 16, sources[level - 1], level - 1)
				if ((index >> 4 & 15) < 15)     pushIfValid(index + 16, sources[level - 1], level - 1)
				if (index >> 8)                 pushIfValid(index - 256, sources[level - 1], level - 1)
				if (index + 256 < light.length) pushIfValid(index + 256, sources[level - 1], level - 1)
			}
		}
	}
	preprocessBlocks() {
		const flags = this.flags = new Int8Array(65536) // flagPool.pop()
		const { blocks, renderData, maxY } = this

		for (let i = 0; i < 256; i++) {
			flags[maxY * 256 + i] = 8 // The top blocks
		}
		/** @type {Number[][]} */
		const blockSpread = []
		for (let i = 256; i < (maxY + 1) * 256; i++) {
			const x = i >> 4 & 15
			const z = i & 15
			const b = blocks[i]
			const data = blockData[b]

			// Set bit flags on adjacent blocks
			if (data.transparent) {
				if (b === 0) flags[i] |= 128 // This is an air block, so it can't be rendered. This bit makes it negative.
				else if (data.hideInterior) {

					// Toggle visibilty flags. The neighbors will toggle them again, leaving them off.
					flags[i] ^= +(b === (x ? blocks[i - 16] : 0)) << 0
					| +(b === (x < 15 ? blocks[i + 16] : 0)) << 1
					| +(b === blocks[i - 256]) << 2
					| +(b === blocks[i + 256]) << 3
					| +(b === (z ? blocks[i - 1] : 0)) << 4
					| +(b === (z < 15 ? blocks[i + 1] : 0)) << 5
				}

				// Toggle neighbor's visibility flags.
				flags[i - 256] ^= 8 // Top face of block below is visible
				flags[i + 256] ^= 4 // Bottom face of block above is visible
				if (z)      flags[i - 1] ^= 32 // South face of North block is visible
				if (z < 15) flags[i + 1] ^= 16 // North face of South block is visible
				if (x)      flags[i - 16] ^= 2 // West face of East block is visible
				if (x < 15) flags[i + 16] ^= 1 // East face of West block is visible
			}
			else if (!data.isCube) {
				const cull = data.shape.cull
				if (!cull.bottom) {
					flags[i - 256] |= 8 // Top face of block below is visible
				}
				if (!cull.top) {
					flags[i + 256] |= 4 // Bottom face of block above is visible
				}
				if (!cull.south && z) {
					flags[i - 1] |= 32 // South face of North block is visible
				}
				if (!cull.north && z < 15) {
					flags[i + 1] |= 16 // North face of South block is visible
				}
				if (!cull.west && x) {
					flags[i - 16] |= 2 // West face of East block is visible
				}
				if (!cull.east && x < 15) {
					flags[i + 16] |= 1 // East face of West block is visible
				}
			}

			// Some lighting stuff
			const light = data.lightLevel
			if (light) {
				if (!blockSpread[light]) blockSpread[light] = []
				blockSpread[light].push(i)
				this.light[i] |= light * 16
			}
		}

		// Compute renderData for inner 14x14 column after ensuring all flags are accurate
		for (let index = 256; index < (maxY + 1) * 256; index++) {
			if (!blockData[blocks[index]].isCube) {
				const cull = blockData[blocks[index]].shape.cull
				if (!cull.west)   flags[index] |= 1
				if (!cull.east)   flags[index] |= 2
				if (!cull.bottom) flags[index] |= 4
				if (!cull.top)    flags[index] |= 8
				if (!cull.south)  flags[index] |= 16
				if (!cull.north)  flags[index] |= 32
			}
			const x = index >> 4 & 15
			const z = index & 15
			if (x && x < 15 && z && z < 15 && flags[index] > 0) {
				renderData.push(index << 16 | flags[index] << 10)
			}
		}

		this.spreadLight(blockSpread, true)
	}

	sendEditsToNeighbors() {
		/**
		 * @param {Number} x Target chunk's world x coordinate
		 * @param {Number} z Target chunk's world x coordinate
		 * @param {Number[]} editData An array of bit-packed block data
		 */
		const sendEdit = (x, z, editData) => {
			const coords = x+','+z
			if (chunkMap.has(coords)) {
				chunkMap.get(coords)?.edits.push(new Int32Array(editData)) // Chunk is in this thread
			}
			else {
				editData.push(x, z)
				const typedData = new Int32Array(editData)
				chunkPortMap.get(coords)?.push(typedData.buffer) // Chunk is in another thread
			}
		}
		sendEdit(this.x-16, this.z-16, this.neighbors[0])
		sendEdit(this.x-16, this.z,    this.neighbors[1])
		sendEdit(this.x-16, this.z+16, this.neighbors[2])
		sendEdit(this.x,    this.z-16, this.neighbors[3])
		sendEdit(this.x,    this.z+16, this.neighbors[5])
		sendEdit(this.x+16, this.z-16, this.neighbors[6])
		sendEdit(this.x+16, this.z,    this.neighbors[7])
		sendEdit(this.x+16, this.z+16, this.neighbors[8])
	}

	stage1() {
		this.stage = 1
		const buffer = new ArrayBuffer(65536 * 3 + 256)
		this.blocks = new Int16Array(buffer, 0, 65536)
		this.tops = new Int16Array(buffer, this.blocks.byteLength, 256)
		this.light = new Uint8Array(buffer, this.blocks.byteLength + 256, 65536)
		this.generateGround()
		if (superflat) return
		if (spawnCaves) this.carveCaves()
		if (spawnTrees) this.addTrees()
		this.sendEditsToNeighbors()
	}
	stage2() {
		if (!superflat && this.edits.length !== 8 || this.stage !== 1) return false
		this.applyNeighborEdits()
		this.load()
		this.preprocessBlocks()
		this.addLight()
		this.stage = 2

		postMessage({
			x: this.x,
			z: this.z,
			maxY: this.maxY,
			minY: this.minY,
			tops: this.tops,
			light: this.light,
			visFlags: this.flags,
			blocks: this.blocks,
			renderData: this.renderData,
			doubleRender: this.doubleRender
		// @ts-ignore
		}, [this.blocks.buffer, this.flags.buffer])
		return true
	}
}

function sendMessages() {
	for (let i = 0; i < messageQueue.length; i++) {
		if (messageQueue[i].length) {
			workerPorts[i].postMessage(messageQueue[i], messageQueue[i])
			messageQueue[i].length = 0
		}
	}
}

// Loop over all jobs, advancing the first eligible chunk by 1 stage before checking for new data, then repeating.
const channel = new MessageChannel()
let looping = false // Prevent duplicate loops
function workLoop() {
	looping = true
	let progress = false
	for (let i = 0; i < 20; i++) {
		let index = -1
		for (let coords of jobQueue) {
			index++
			const [x, z] = coords.split(",").map(n => Number(n))
			let chunk = chunkMap.get(coords)
			if (!chunk) chunk = new PartialChunk(x, z)
			if (chunk.stage === 0) {
				chunk.stage1()
				progress = true
				break
			}
			else if (chunk.stage2()) {
				jobQueue.splice(index, 1)
				progress = true
				break
			}
		}
	}
	sendMessages()
	if (progress) channel.port1.postMessage("")
	else looping = false
}
channel.port2.onmessage = workLoop

let interval = setInterval(() => self.postMessage("ready"), 100) // Sometimes the page lags and messages are lost

/**
 * @param {MessageEvent} e
 */
function neighborEditsReceived(e) {
	for (const editsBuffer of e.data) {
		const arr = new Int32Array(editsBuffer)
		const z = arr.at(-1)
		const x = arr.at(-2)
		const coords = `${x},${z}`
		const edits = new Int32Array(editsBuffer, 0, (editsBuffer.byteLength - 8) / 4)
		chunkMap.get(coords)?.edits.push(edits)
	}
	if (!looping) workLoop()
}
self.onmessage = function(e) {
	if (e.data.blockIds) {
		blockData = e.data.blockData
		blockIds = e.data.blockIds
		workerID = e.data.workerID
		workerPorts = e.data.workerPorts
		for (let i = 0; i < workerPorts.length; i++) {
			if (i !== workerID) {
				workerPorts[i].onmessage = neighborEditsReceived
			}
			messageQueue.push([])
		}
		// setTimeout(() => {
		// 	let port
		// 	while(!port) port = workerPorts[Math.random() * workerPorts.length | 0]
		// 	port.postMessage(workerPorts.indexOf(port))
		// }, 500)
		clearInterval(interval)
		return
	}
	if (e.data.seed) {
		seedHash(e.data.seed)
		seedNoise(e.data.seed)
		noiseProfile.noiseSeed(e.data.seed)
		superflat = e.data.superflat
		spawnCaves = e.data.spawnCaves
		spawnTrees = e.data.spawnTrees
		rivers = e.data.rivers
	}

	if (e.data.jobList) {
		/** @type {string[][]} */
		const jobList = e.data.jobList
		Object.assign(saves, e.data.saves)
		for (let id = 0; id < jobList.length; id++) {
			if (id === workerID) {
				for (let coords of jobList[id]) {
					const [x, z] = coords.split(",").map(n => +n)
					chunkMap.set(coords, new PartialChunk(x, z))
				}
				jobQueue.push(...jobList[id])
			}
			else {
				for (let chunk of jobList[id]) {
					chunkPortMap.set(chunk, messageQueue[id])
				}
			}
		}
		if (!looping) workLoop()
	}
}
