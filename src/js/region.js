// Handle any and all terrain features that could cross chunk borders
import { hash, Marsaglia, flatness, hilliness, humidity, temperature, height } from "./random.js"
import { biomeData, caveSpawn, BIOMES, seaLevel } from './biomes.js'

class CaveWalker {
	constructor(x, y, z, dx, dy, dz) {
		this.x = x
		this.y = y
		this.z = z
		this.dx = dx
		this.dy = dy
		this.dz = dz
		this.lastIX = x | 0
		this.lastIY = y | 0
		this.lastIZ = z | 0
	}

	normalize() {
		this.dy = Math.min(0, this.dy)
		const len = Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz)
		this.dx /= len
		this.dy /= len
		this.dz /= len
	}
}

class Region {
	constructor(x, z, world) {
		this.x = x
		this.z = z
		this.world = world
		this.rng = new Marsaglia(world.seed * 12345 * hash(x, z) | 0, world.seed * 56789 * hash(z, x) | 0)

		// [[X, Z, BIOME], [X, Z, BIOME], ...]
		this.biomes = []
		for (let count = this.rng.nextShort() % 4 + 1; count >= 0; count--) {
			this.biomes.push([this.rng.nextShort() & 511, this.rng.nextShort() & 511, this.rng.nextShort() % (biomeData.length-1)+1])
		}

		this.biomeMap = new Uint8Array(512*512)
		this.heightMap = new Uint8Array(this.biomeMap.length)
		// For every chunk in the region, store the positions of every construct that could cross chunk borders.
		this.chunkData = []
		for (let i = 0; i < 1024; i++) {
			this.chunkData.push({
				spawns: [[], [], []], // Ores, caves, flowers/trees
				biomeMap: new Uint8Array(this.biomeMap.buffer, 256 * i, 256), // The biomes at any given point
				heightMap: new Uint8Array(this.heightMap.buffer, 256 * i, 256), // The height of the ground
				neighbors: [], // The 3x3 area of chunks around this one
			})
		}

		this.neighbors = []
		this.generated = false
	}

	computeNeighbors() {
		// Computed once during region generation; neighboring regions must exist first.
		this.neighbors = [
			this.world.getRegion(this.x - 512, this.z - 512),
			this.world.getRegion(this.x - 512, this.z),
			this.world.getRegion(this.x - 512, this.z + 512),
			this.world.getRegion(this.x, this.z - 512),
			this,
			this.world.getRegion(this.x, this.z + 512),
			this.world.getRegion(this.x + 512, this.z - 512),
			this.world.getRegion(this.x + 512, this.z),
			this.world.getRegion(this.x + 512, this.z + 512),
		]
		const getChunk = (x, z) => {
			const region = this.neighbors[(x+32 >> 5) * 3 + (z+32 >> 5)]
			x = x & 31
			z = z & 31
			return region.chunkData[x * 32 + z]
		}
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				const chunk = this.chunkData[x * 32 + z].neighbors
				chunk[0] = getChunk(x - 1, z - 1)
				chunk[1] = getChunk(x - 1, z)
				chunk[2] = getChunk(x - 1, z + 1)
				chunk[3] = getChunk(x, z - 1)
				chunk[4] = this.chunkData[x * 32 + z]
				chunk[5] = getChunk(x, z + 1)
				chunk[6] = getChunk(x + 1, z - 1)
				chunk[7] = getChunk(x + 1, z)
				chunk[8] = getChunk(x + 1, z + 1)
			}
		}
	}

	// computeChunkBiomes() {
	// 	const allBiomes = []
	// 	for (const r of this.neighbors) {
	// 		const offsetX = r.x - this.x
	// 		const offsetZ = r.z - this.z

	// 		for (let i = 0; i < r.biomes.length; i++) {
	// 			const b = r.biomes[i]
	// 			allBiomes.push([
	// 				b[0] + offsetX,
	// 				b[1] + offsetZ,
	// 				b[2]
	// 			])
	// 		}
	// 	}

	// 	for (let cx = 0; cx < 32; cx++) {
	// 		for (let cz = 0; cz < 32; cz++) {
	// 			const dists = []
	// 			const centerX = cx * 16 + 8
	// 			const centerZ = cz * 16 + 8

	// 			let closestDist = Infinity

	// 			// Find closest biome
	// 			for (let i = 0; i < allBiomes.length; i++) {
	// 				const b = allBiomes[i]
	// 				const dx = centerX - b[0]
	// 				const dz = centerZ - b[1]
	// 				const dist = dx * dx + dz * dz
	// 				dists.push(dist)
	// 				if (dist < closestDist) closestDist = dist
	// 			}

	// 			// The corner is up to 12 blocks away from the chunk center (8 * Math.SQRT2)
	// 			closestDist = Math.sqrt(closestDist) + 19
	// 			const threshold = closestDist * closestDist

	// 			// Store the ones within the threshold
	// 			const candidates = this.chunkData[cx * 32 + cz].biomes
	// 			for (let i = 0; i < allBiomes.length; i++) {
	// 				if (dists[i] <= threshold) {
	// 					candidates.push(allBiomes[i])
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	// X and Z are in region coordinates.
	// getBiome(x, z, biomes) {
	// 	if (biomes.length === 1) return biomes[0][2]
	// 	let closestBiome = null
	// 	let closestDist = Infinity

	// 	for (let i = 0; i < biomes.length; i++) {
	// 		const b = biomes[i]
	// 		const dx = x - b[0]
	// 		const dz = z - b[1]
	// 		const dist = dx * dx + dz * dz
	// 		if (dist < closestDist) {
	// 			closestDist = dist
	// 			closestBiome = b[2]
	// 		}
	// 	}

	// 	return closestBiome
	// }

	getBiome(flat, hillHeight, wetness, hotness, groundHeight) {
		// Short
		if (groundHeight < 48) {
			if (flat > 0.7) return BIOMES.DEEP_OCEAN
			if (wetness > 0.7) return BIOMES.SWAMP
			return BIOMES.COAST
		}

		// Extreme hills
		if (hillHeight > 0.75 && flat < 0.45) {
			if (wetness < 0.30 && hotness > 0.65) return BIOMES.MESA
			if (hotness < 0.25) return BIOMES.SNOWY_MOUNTAINS
			return BIOMES.MOUNTAINS
		}

		// Dry
		if (wetness < 0.30) {
			if (flat > 0.70 && hillHeight > 0.35) return BIOMES.DESERT
			if (flat > 0.55 && hillHeight <= 0.35) return BIOMES.SAVANNA
			if (flat < 0.55 && hillHeight > 0.45) return BIOMES.BADLANDS
			return BIOMES.DRY_PLAINS
		}

		// Wet + hot
		if (wetness > 0.70 && hotness > 0.65) {
			if (groundHeight < 62) return BIOMES.SWAMP
			if (flat < 0.55) return BIOMES.JUNGLE
			return BIOMES.TROPICAL_FOREST
		}

		// Wet + cold
		if (wetness > 0.60 && hotness < 0.35) {
			if (hillHeight > 0.35) return BIOMES.TAIGA
			return BIOMES.SNOWY_FOREST
		}

		// Dry + cold
		if (hotness < 0.25) {
			if (wetness < 0.45) return BIOMES.TUNDRA
			return BIOMES.SNOWY_PLAINS
		}

		// Temperate
		if (wetness > 0.55) return BIOMES.FOREST
		if (flat > 0.60) return BIOMES.PLAINS
		if (hillHeight > 0.45) return BIOMES.HILLS

		return BIOMES.WOODLAND
	}

	/**
	 * If the tree/cave crosses chunk borders, add it to each chunk it's in.
	 * @param {{}} chunk The region's chunk data
	 * @param {Number} x Chunk coordinates
	 * @param {Number} z Chunk coordinates
	 * @param {import('./biomes.js').BiomeSpawn} spawn
	 * @param {Number} spawnIndex The index of the BiomeSpawn in the Biome
	 */
	addSpawn(chunk, x, y, z, spawn) {
		const dw = spawn.width
		const data = spawn.random ? this.rng.nextShort() : spawn.data
		const minChunkX = x - dw < 0 ? -1 : 0
		const maxChunkX = x + dw > 15 ? 1 : 0
		const minChunkZ = z - dw < 0 ? -1 : 0
		const maxChunkZ = z + dw > 15 ? 1 : 0

		for (let cx = minChunkX; cx <= maxChunkX; cx++) {
			for (let cz = minChunkZ; cz <= maxChunkZ; cz++) {
				// Add the trees to the correct chunks, with coordinates localized to the respective chunk's coordinates
				chunk.neighbors[cx*3 + cz + 4].spawns[spawn.spawnOrder].push([spawn.spawnFunction, data, x - cx * 16, y, z - cz * 16])
			}
		}
	}

	runCaveWalker(allWalkers, walker) {
		const jitter = () => (this.rng.nextShort() - 32768) / 1048576 * 8

		// Must terminate before leaving neighboring-region range:
		// local region + 1 region border = [-512, 1023]
		const min = -512
		const max = 1023

		for (let steps = 0; steps < 20480; steps++) {
			walker.x += walker.dx
			walker.y += walker.dy
			walker.z += walker.dz

			if (walker.x < min || walker.x > max || walker.z < min || walker.z > max || walker.y < 2 || walker.y > 255) {
				return
			}

			const ix = walker.x | 0
			const iy = walker.y | 0
			const iz = walker.z | 0

			if (ix !== walker.lastIX || iy !== walker.lastIY || iz !== walker.lastIZ) {
				const chunkX = ix >> 4
				const chunkZ = iz >> 4

				if (chunkX >= 0 && chunkX < 32 && chunkZ >= 0 && chunkZ < 32) {
					const chunk = this.chunkData[chunkX * 32 + chunkZ]

					this.addSpawn(chunk, ix & 15, iy, iz & 15, caveSpawn)
				}

				walker.lastIX = ix
				walker.lastIY = iy
				walker.lastIZ = iz
			}

			// Gentle random steering
			walker.dx += jitter()
			walker.dy += walker.dy < -0.5 ? 0.05 : jitter()
			walker.dz += jitter()
			walker.normalize()

			// Small chance to fork
			if (allWalkers.length < 50 && this.rng.nextShort() < 256 * 2) {
				const fork = new CaveWalker(
					walker.x,
					walker.y,
					walker.z,
					jitter(), // Maybe allow forks to go in any direction?
					jitter(),
					jitter()
				)
				fork.normalize()
				allWalkers.push(fork)
			}
		}
	}

	spawnCaves() {
		// A few cave systems per region
		const walkers = []
		const caveCount = this.rng.nextShort() % 10 + 10 // 10-20 starters

		for (let i = 0; i < caveCount; i++) {
			const x = this.rng.nextShort() & 511
			const z = this.rng.nextShort() & 511

			// Temporary: straight downward start.
			// Replace later with terrain-slope-based entry direction.
			const y = this.chunkData[x >> 4 << 5 | z >> 4].heightMap[(x & 15) << 4 | z & 15]

			const walker = new CaveWalker(x, y, z, 0, -1, 0)
			walkers.push(walker)
		}

		for (let i = 0; i < walkers.length; i++) {
			this.runCaveWalker(walkers, walkers[i])
		}
	}

	generate() {
		// Do the minimum amount of work for chunks to know what *they* need to do.
		this.computeNeighbors()
		// this.computeChunkBiomes()

		let index = 0
		const biomeMap = this.biomeMap
		const heightMap = this.heightMap
		const macroScale = 500

		// Loop over chunks
		for (let cx = 0; cx < 32; cx++) {
			for (let cz = 0; cz < 32; cz++) {

				const chunk = this.chunkData[cx * 32 + cz]

				// Loop over blocks in chunks (lx = local chunk x, rx = region x)
				for (let lx = 0, rx = cx * 16; lx < 16; lx++, rx++) {
					for (let lz = 0, rz = cz * 16; lz < 16; lz++, rz++) {
						const x = this.x + rx
						const z = this.z + rz

						// Higher flatness = terrain changes spread over larger distances
						// Higher hilliness = larger terrain amplitude
						const flat = flatness.noise2d(x / macroScale, z / macroScale)
						const hillHeight = hilliness.noise2d(x / macroScale, z / macroScale)
						const div = flat * 400 + 50
						const groundHeight = Math.round(height.noise2d(x / div, z / div) * (hillHeight * 120 + 20)) | 0

						const wetness = humidity.noise2d(x / macroScale, z / macroScale)
						const hotness = temperature.noise2d(x / macroScale, z / macroScale)
						const biome = this.getBiome(flat, hillHeight, wetness, hotness, groundHeight)
						biomeMap[index] = biome
						heightMap[index++] = groundHeight

						const spawns = biomeData[biome].spawns
						for (let spawnIndex = 0; spawnIndex < spawns.length; spawnIndex++) {
							if (this.rng.nextShort() < spawns[spawnIndex].spawnThreshold) {
								this.addSpawn(chunk, lx, groundHeight, lz, spawns[spawnIndex])
								break
							}
						}
					}
				}
			}
		}

		this.spawnCaves()
		this.generated = true
	}
}

export { Region }