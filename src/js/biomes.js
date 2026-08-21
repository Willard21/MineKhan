import { blockIds } from "./blockData"
const seaLevel = 63

const generateGrassGround = (blocks, x, z, groundLevel) => {
	const { grass, dirt, stone, bedrock } = blockIds
	let index = x * 16 + z
	const top = index + 256 * groundLevel
	const dirtLayer = top - 256 * 3

	blocks[index] = bedrock
	for (index += 256; index < dirtLayer; index += 256) blocks[index] = stone
	for (; index < top; index += 256) blocks[index] = dirt
	blocks[index] = grass
}

const generateForestGround = generateGrassGround

const generateDesertGround = (blocks, x, z, groundLevel) => {
	const { sand, sandstone, stone, bedrock } = blockIds
	let index = x * 16 + z
	const top = index + 256 * groundLevel
	const sandLayer = top - 256 * 2
	const sandstoneLayer = sandLayer - 256 * 4

	blocks[index] = bedrock
	for (index += 256; index < sandstoneLayer; index += 256) blocks[index] = stone
	for (; index < sandLayer; index += 256) blocks[index] = sandstone
	for (; index <= top; index += 256) blocks[index] = sand
}

const generateSnowGround = (blocks, x, z, groundLevel) => {
	const { snow, dirt, stone, bedrock } = blockIds
	let index = x * 16 + z
	const top = index + 256 * groundLevel
	const dirtLayer = top - 256 * 3

	blocks[index] = bedrock
	for (index += 256; index < dirtLayer; index += 256) blocks[index] = stone
	for (; index < top; index += 256) blocks[index] = dirt
	blocks[index] = snow
}

const generateOceanGround = (blocks, x, z, groundLevel) => {
	const { water, gravel, stone, bedrock } = blockIds
	let index = x * 16 + z
	const top = index + 256 * groundLevel
	const gravelLayer = top - 256 * 2

	blocks[index] = bedrock
	for (index += 256; index < gravelLayer; index += 256) blocks[index] = stone
	for (; index <= top; index += 256) blocks[index] = gravel
	for (; index <= seaLevel * 256; index += 256) blocks[index] = water
}

const generateMesaGround = (blocks, x, z, groundLevel) => {
	const { redSand, redSandstone, terracotta, bedrock } = blockIds

	const base = x * 16 + z
	blocks[base] = bedrock

	let index = groundLevel * 256 + base

	for (let i = 0; i < 3 && index >= 256; i++, index -= 256) {
		blocks[index] = redSand
	}

	for (let i = 0; i < 4 && index >= 256; i++, index -= 256) {
		blocks[index] = redSandstone
	}

	while (index >= 256) {
		blocks[index] = terracotta
		index -= 256
	}
}

/**
 * Sets blocks in the chunk that could potentially fall outside the chunk
 * @param {Int16Array} blocks Chunk block array
 * @param {number} x Local chunk X
 * @param {number} y Local chunk Y
 * @param {number} z Local chunk Z
 * @param {number} blockID The block to set
 */
const setBlock = (chunk, x, y, z, blockID) => {
	if (x >= 0 && x < 16 && z >= 0 && z < 16 && y > 0) {
		chunk.blocks[y * 256 + x * 16 + z] = blockID
		chunk.maxY = Math.max(y, chunk.maxY)
	}
}

/**
 * @callback SpawnFunction
 * @param {Int16Array} blocks Chunk block array
 * @param {number} data Spawn metadata (16-bit packed data)
 * @param {number} x Local chunk X
 * @param {number} y Local chunk Y
 * @param {number} z Local chunk Z
 * @returns {undefined}
 */


// Leaves from top to bottom.
const forestTreeLeaves = [
	[-1, 1, 0], [1, 1, 0], [0, 1, -1], [0, 1, 1], [0, 1, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1],
	[-2, -1, -1], [-2, -1, 0], [-2, -1, 1], [-1, -1, -2], [-1, -1, -1], [-1, -1, 0], [-1, -1, 1], [-1, -1, 2], [0, -1, -2], [0, -1, -1],
	[0, -1, 1], [0, -1, 2], [1, -1, -2], [1, -1, -1], [1, -1, 0], [1, -1, 1], [1, -1, 2], [2, -1, -1], [2, -1, 0], [2, -1, 1],
	[-2, -2, -1], [-2, -2, 0], [-2, -2, 1], [-1, -2, -2], [-1, -2, -1], [-1, -2, 0], [-1, -2, 1], [-1, -2, 2], [0, -2, -2], [0, -2, -1],
	[0, -2, 1], [0, -2, 2], [1, -2, -2], [1, -2, -1], [1, -2, 0], [1, -2, 1], [1, -2, 2], [2, -2, -1], [2, -2, 0], [2, -2, 1],
]
const randomForestTreeLeaves = [
	[-2, -2, -2], [-2, -2, 2], [2, -2, -2], [2, -2, 2],
	[-2, -1, -2], [-2, -1, 2], [2, -1, -2], [2, -1, 2],
	[-1,  0, -1], [-1,  0, 1], [1,  0, -1], [1,  0, 1]
]

/** Place a forest tree
 * @type {SpawnFunction} */
const forestTree = (chunk, data, x, y, z) => {
	const type = data & 1 ? blockIds.birchLog : blockIds.oakLog
	const height = 4 + (data & 1) + (data >> 1 & 3)
	data >>>= 3

	// Place the trunk
	for (let i = 1; i <= height; i++) {
		setBlock(chunk, x, y + i, z, type)
	}

	y += height // Leaves are placed relative to the top of the tree, not the bottom.

	// Place the consistent leaves
	const leaves = blockIds.leaves
	for (let i = 0; i < forestTreeLeaves.length; i++) {
		const pos = forestTreeLeaves[i]
		setBlock(chunk, x + pos[0], y + pos[1], z + pos[2], leaves)
	}

	// Place the random leaves
	for (let i = 0; i < randomForestTreeLeaves.length; i++) {
		const pos = randomForestTreeLeaves[i]
		if (data >>> i & 1) setBlock(chunk, x + pos[0], y + pos[1], z + pos[2], leaves)
	}
}

const spruceTree = (chunk, data, x, y, z) => {
	const height = 6 + (data & 3)
	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.spruceLog)

	const leaves = blockIds.leaves
	const top = y + height
	for (let dy = -3; dy <= 1; dy++) {
		const r = dy < 0 ? 2 : 1
		for (let dx = -r; dx <= r; dx++) {
			for (let dz = -r; dz <= r; dz++) {
				if (Math.abs(dx) + Math.abs(dz) <= r + 1) {
					setBlock(chunk, x + dx, top + dy, z + dz, leaves)
				}
			}
		}
	}
}

const acaciaTree = (chunk, data, x, y, z) => {
	const height = 4 + (data & 1)
	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.acaciaLog)

	const dirX = data & 2 ? 1 : -1
	const dirZ = data & 4 ? 1 : -1
	const topY = y + height
	setBlock(chunk, x + dirX, topY + 1, z + dirZ, blockIds.acaciaLog)

	for (let dx = -2; dx <= 2; dx++) {
		for (let dz = -2; dz <= 2; dz++) {
			if (Math.abs(dx) + Math.abs(dz) <= 3) {
				setBlock(chunk, x + dirX + dx, topY + 1, z + dirZ + dz, blockIds.leaves)
			}
		}
	}
}

const jungleTree = (chunk, data, x, y, z) => {
	const height = 7 + (data & 3)
	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.jungleLog)

	const top = y + height
	for (let dx = -2; dx <= 2; dx++) {
		for (let dz = -2; dz <= 2; dz++) {
			for (let dy = -2; dy <= 1; dy++) {
				if (Math.abs(dx) + Math.abs(dz) <= 3) {
					setBlock(chunk, x + dx, top + dy, z + dz, blockIds.leaves)
				}
			}
		}
	}
}

const giantJungleTree = (chunk, data, x, y, z) => {
	const height = 21 + (data & 3)
	for (let dx = 0; dx <= 1; dx++) {
		for (let dz = 0; dz <= 1; dz++) {
			for (let i = 1; i <= height; i++) {
				setBlock(chunk, x + dx, y + i, z + dz, blockIds.jungleLog)
			}
		}
	}

	const top = y + height
	for (let dx = -3; dx <= 4; dx++) {
		for (let dz = -3; dz <= 4; dz++) {
			for (let dy = -3; dy <= 1; dy++) {
				if (Math.abs(dx - 0.5) + Math.abs(dz - 0.5) <= 5) {
					setBlock(chunk, x + dx, top + dy, z + dz, blockIds.leaves)
				}
			}
		}
	}
}

const swampTree = (chunk, data, x, y, z) => {
	forestTree(chunk, data, x, y, z)
	// const top = y + 5
	// for (let dx = -2; dx <= 2; dx += 2) {
	// 	for (let dz = -2; dz <= 2; dz += 2) {
	// 		for (let i = 0; i < 3; i++) setBlock(chunk, x + dx, top - i, z + dz, blockIds.vine)
	// 	}
	// }
}

const boulder = (chunk, data, x, y, z) => {
	for (let dx = -1; dx <= 1; dx++) {
		for (let dz = -1; dz <= 1; dz++) {
			for (let dy = 0; dy <= 1; dy++) {
				if (Math.abs(dx) + Math.abs(dz) + dy <= 2) {
					setBlock(chunk, x + dx, y + dy + 1, z + dz, data)
				}
			}
		}
	}
}

const mesaPillar = (chunk, data, x, y, z) => {
	const height = 4 + (data & 3)
	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.redTerracotta)
}

// const icePatch = (chunk, data, x, y, z) => {
// 	for (let dx = -1; dx <= 1; dx++) {
// 		for (let dz = -1; dz <= 1; dz++) {
// 			if (Math.abs(dx) + Math.abs(dz) <= 2) {
// 				setBlock(chunk, x + dx, y + 1, z + dz, blockIds.packedIce)
// 			}
// 		}
// 	}
// }

const reeds = (chunk, data, x, y, z) => {
	const height = 2 + (data & 1)
	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.sugarCane)
}

// const kelpPatch = (chunk, data, x, y, z) => {
// 	const height = 3 + (data & 3)
// 	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.kelp)
// }

// const vine = (chunk, data, x, y, z) => {
// 	const height = 2 + (data & 3)
// 	for (let i = 1; i <= height; i++) setBlock(chunk, x, y + i, z, blockIds.vine)
// }


/** Place a cactus between 1 and 4 blocks tall with a cactusFlower on top
 * @type {SpawnFunction} */
const desertCactus = (chunk, data, x, y, z) => {
	const height = (data & 3) + 1
	for (let i = 0; i < height; i++) setBlock(chunk, x, y + i + 1, z, blockIds.cactus)
	setBlock(chunk, x, y + height + 1, z, blockIds.cactusFlower)
}

/** Place a 1x1x1 block of type `type` right above the ground
 * @type {SpawnFunction} */
const flower = (chunk, type, x, y, z) => {
	setBlock(chunk, x, y + 1, z, type)
}

/** Place a lily pad at sea level
 * @type {SpawnFunction} */
const lilyPad = (chunk, type, x, y, z) => {
	if (y < seaLevel) setBlock(chunk, x, seaLevel + 1, z, type)
}

// No lilacs, peonys, roses, or witherRoses
const flowerTypes = [
	blockIds.poppy,
	blockIds.dandelion,
	blockIds.cornflower,
	blockIds.allium,
	blockIds.azureBluet,
	blockIds.blueOrchid,
	blockIds.lilyOfTheValley,
	blockIds.orangeTulip,
	blockIds.oxeyeDaisy,
	blockIds.pinkTulip,
	blockIds.redTulip,
	blockIds.torchflower,
	blockIds.whiteTulip
]
/** Place a flower from the flowerTypes list
 * @type {SpawnFunction} */
const randomFlower = (chunk, rand, x, y, z) => {
	setBlock(chunk, x, y + 1, z, flowerTypes[rand % flowerTypes.length])
}

const sphere = (() => {
	let blocks = []
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			for (let k = -1; k <= 1; k++) blocks.push(i, j, k)
			blocks.push(i, j, 2, i, j, -2, 2, i, j, -2, i, j, i, 2, j, i, -2, j)
		}
	}
	return new Int8Array(blocks)
})()

/** Carve out a ball of air
 * @type {SpawnFunction} */
const carveSphere = (chunk, data, x, y, z) => {
	if (y > 3) {
		for (let i = 0; i < sphere.length; i += 3) {
			setBlock(chunk, x + sphere[i], y + sphere[i + 1], z + sphere[i + 2], data)
		}
	}
}

class BiomeSpawn {
	/**
	 * Stores all the data involved in spawning a biome decoration
	 * @param {SpawnFunction} spawnFunction The function the chunk will call to place this spawn
	 * @param {number} spawnThreshold Should be 256 * spawnsPerChunk
	 * @param {number} width How far out past the spawn point it extends
	 * @param {number} data 16 bits of metadata to store about the spawn (like blockIDs)
	 * @param {boolean} random Whether or not data should be filled with random bits
	 * @param {number} [spawnAmount=1] The number of objects to spawn (turns this into a cluster spawn)
	 * @param {number} [spawnOrder=2] Ores are 0, caves are 1, trees/flowers are 2
	 */
	constructor(spawnFunction, spawnThreshold, width, data, random, spawnAmount = 1, spawnOrder = 2) {
		this.spawnFunction = spawnFunction
		this.spawnThreshold = spawnThreshold
		this.width = width
		this.spawnOrder = spawnOrder
		this.data = data
		this.random = random
		this.spawnAmount = spawnAmount
	}
}

class Biome {
	/**
	 * Stores all the data used to generate and decorate a biome
	 *
	 * @param {String} name
	 * @param {(blocks: Uint16Array, x: Number, z: Number, groundLevel: Number) => void} groundGenerator
	 * Generates the terrain column for this biome
	 *
	 * @param {BiomeSpawn[]} spawns
	 * Things like trees, flowers, bushes, rocks, etc.
	 *
	 * @param {Object} options
	 * Optional biome-specific terrain controls
	 *
	 * @param {Number|null} options.minHeight
	 * Clamp terrain to at least this height
	 *
	 * @param {Number|null} options.maxHeight
	 * Clamp terrain to at most this height
	 *
	 * @param {Number|null} options.fillBelowHeight
	 * Fill air below this level with water (swamps, oceans)
	 *
	 * @param {Number|null} options.deepBlock
	 * Optional replacement for deep underground stone
	 * (mesa, badlands, etc.)
	 *
	 * @param {Number|null} options.heightBlendStrength
	 * Optional future use for smoothly pulling terrain
	 * toward a target biome height
	 */
	constructor(name, groundGenerator, spawns = [], options = {}) {
		this.name = name
		this.groundGenerator = groundGenerator
		this.spawns = spawns

		this.minHeight = options.minHeight ?? null
		this.maxHeight = options.maxHeight ?? null
		this.fillBelowHeight = options.fillBelowHeight ?? null
		this.deepBlock = options.deepBlock ?? null
		this.heightBlendStrength = options.heightBlendStrength ?? null
	}
}

/** @type {Biome[]} */
const biomeData = [
	new Biome("Deep Ocean", generateOceanGround, [
		// new BiomeSpawn(kelpPatch, 256 * 6, 2, 0, true),
		// new BiomeSpawn(seagrassPatch, 256 * 8, 1, 0, true)
	], {
		maxHeight: 48,
		fillBelowHeight: 62
	}),

	new Biome("Swamp", generateGrassGround, [
		new BiomeSpawn(swampTree, 256 * 3, 2, 0, true),
		new BiomeSpawn(reeds, 256 * 4, 1, 0, true),
		new BiomeSpawn(lilyPad, 256 * 4, 2, 0, false, 8),
		new BiomeSpawn(randomFlower, 256 * 2, 0, 0, true)
	], {
		minHeight: 60,
		maxHeight: 63,
		fillBelowHeight: 62
	}),

	new Biome("Coast", generateGrassGround, [
		new BiomeSpawn(reeds, 256 * 4, 1, 0, true),
		new BiomeSpawn(boulder, 256 * 2, 2, blockIds.stone, false)
	], {
		maxHeight: 64,
		fillBelowHeight: 62
	}),

	new Biome("Mesa", generateMesaGround, [
		new BiomeSpawn(flower, 256 * 3, 0, blockIds.deadBush, false),
		new BiomeSpawn(mesaPillar, 128, 3, 0, true)
	], {
		minHeight: 70
	}),

	new Biome("Snowy Mountains", generateSnowGround, [
		new BiomeSpawn(spruceTree, 256 * 2, 2, 0, true),
		// new BiomeSpawn(icePatch, 128, 2, 0, true),
		new BiomeSpawn(boulder, 128, 2, blockIds.packedIce, false)
	], {
		minHeight: 90
	}),

	new Biome("Mountains", generateGrassGround, [
		new BiomeSpawn(spruceTree, 256 * 2, 2, 0, true),
		new BiomeSpawn(boulder, 256, 2, blockIds.mossyCobblestone, false)
	], {
		minHeight: 80
	}),

	new Biome("Desert", generateDesertGround, [
		new BiomeSpawn(desertCactus, 256, 0, 0, true),
		new BiomeSpawn(flower, 256 * 4, 0, blockIds.deadBush, false),
	], {}),

	new Biome("Savanna", generateGrassGround, [
		new BiomeSpawn(acaciaTree, 256 * 3, 2, 0, true),
		new BiomeSpawn(flower, 256 * 4, 1, blockIds.tallGrass, false, 5)
	], {}),

	new Biome("Badlands", generateMesaGround, [
		new BiomeSpawn(flower, 256 * 3, 0, blockIds.deadBush, false),
		new BiomeSpawn(boulder, 256, 2, blockIds.stone, false)
	], {}),

	new Biome("Dry Plains", generateGrassGround, [
		new BiomeSpawn(flower, 256 * 4, 1, blockIds.tallGrass, false, 5),
		new BiomeSpawn(flower, 256 * 2, 0, blockIds.deadBush, false)
	], {}),

	new Biome("Jungle", generateGrassGround, [
		new BiomeSpawn(jungleTree, 256 * 8, 3, 0, true),
		new BiomeSpawn(giantJungleTree, 128, 4, 0, true),
		// new BiomeSpawn(vine, 256 * 4, 2, 0, true),
		new BiomeSpawn(randomFlower, 256 * 3, 0, 0, true)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Tropical Forest", generateGrassGround, [
		new BiomeSpawn(jungleTree, 256 * 5, 2, 0, true),
		new BiomeSpawn(randomFlower, 256 * 3, 0, 0, true)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Taiga", generateGrassGround, [
		new BiomeSpawn(spruceTree, 256 * 6, 2, 0, true),
		new BiomeSpawn(flower, 256 * 4, 1, blockIds.fern, false, 3),
		new BiomeSpawn(flower, 128, 1, blockIds.brownMushroom, false, 4),
	], {
		fillBelowHeight: 62
	}),

	new Biome("Snowy Forest", generateSnowGround, [
		new BiomeSpawn(spruceTree, 256 * 5, 2, 0, true),
		// new BiomeSpawn(icePatch, 128, 2, 0, true)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Tundra", generateSnowGround, [
		new BiomeSpawn(flower, 256 * 2, 0, blockIds.deadBush, false),
		// new BiomeSpawn(icePatch, 256, 2, 0, true)
	], {}),

	new Biome("Snowy Plains", generateSnowGround, [
		new BiomeSpawn(randomFlower, 128, 0, 0, true),
		new BiomeSpawn(spruceTree, 256 * 2, 2, 0, true)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Forest", generateForestGround, [
		new BiomeSpawn(forestTree, 256 * 6, 2, 0, true),
		new BiomeSpawn(randomFlower, 256 * 2, 0, 0, true),
		new BiomeSpawn(flower, 128, 1, blockIds.brownMushroom, false, 4),
		new BiomeSpawn(flower, 128, 1, blockIds.redMushroom, false, 4)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Plains", generateGrassGround, [
		new BiomeSpawn(randomFlower, 256 * 4, 0, 0, true),
		new BiomeSpawn(flower, 256 * 6, 1, blockIds.tallGrass, false, 5)
	], {
		fillBelowHeight: 62
	}),

	new Biome("Hills", generateGrassGround, [
		new BiomeSpawn(forestTree, 256 * 3, 2, 0, true),
		new BiomeSpawn(boulder, 256, 2, 0, false),
		new BiomeSpawn(randomFlower, 256, 0, 0, true)
	], {}),

	new Biome("Woodland", generateGrassGround, [
		new BiomeSpawn(forestTree, 256 * 4, 2, 0, true),
		new BiomeSpawn(randomFlower, 256 * 2, 0, 0, true),
		new BiomeSpawn(flower, 256 * 3, 1, blockIds.tallGrass, false, 5)
	], {
		fillBelowHeight: 62
	})
]
console.log(JSON.stringify(Object.fromEntries(biomeData.map((biome, index) => [
	biome.name.replace(/./g, c => c === ' ' ? '_' : c.toUpperCase()),
	index
])), null, '\t'))

// BIOMES should be the output from the console.log here. It helps with type hints to do it this way.
const BIOMES = {
	"DEEP_OCEAN": 0,
	"SWAMP": 1,
	"COAST": 2,
	"MESA": 3,
	"SNOWY_MOUNTAINS": 4,
	"MOUNTAINS": 5,
	"DESERT": 6,
	"SAVANNA": 7,
	"BADLANDS": 8,
	"DRY_PLAINS": 9,
	"JUNGLE": 10,
	"TROPICAL_FOREST": 11,
	"TAIGA": 12,
	"SNOWY_FOREST": 13,
	"TUNDRA": 14,
	"SNOWY_PLAINS": 15,
	"FOREST": 16,
	"PLAINS": 17,
	"HILLS": 18,
	"WOODLAND": 19
}
const caveSpawn = new BiomeSpawn(carveSphere, 0, 2, blockIds.air, false, 1, 1)

export { Biome, BiomeSpawn, BIOMES, biomeData, caveSpawn, seaLevel }

// Alright, here's my existing biomes. Go ahead and finish filling them out. For the spawnFunctions of each biomeSpawn, just pretend any exist that you want to use, and we'll implement them later. The biome `name` is mainly just to be self-documenting, since I don't use it anywhere.
