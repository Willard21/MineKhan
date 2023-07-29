async function Worker() {
	// Originally this stuff was generated in code
	const GRADIENTS_3D = new Int8Array([-11,4,4,-4,11,4,-4,4,11,11,4,4,4,11,4,4,4,11,-11,-4,4,-4,-11,4,-4,-4,11,11,-4,4,4,-11,4,4,-4,11,-11,4,-4,-4,11,-4,-4,4,-11,11,4,-4,4,11,-4,4,4,-11,-11,-4,-4,-4,-11,-4,-4,-4,-11,11,-4,-4,4,-11,-4,4,-4,-11])
	const POSITIONS = [-1,180,216,528,624,-1,912,288,144,360,252,816,-1,-1,720,216,-1,-1,72,960,-1,-1,912,36,144,360,0,816,-1,480,576,72,324,-1,144,-1,432,-1,624,36,-1,288,108,576,-1,864,-1,180,252,36,144,672,-1,-1,-1,108,-1,-1,396,-1,-1,-1,432,360,252,36,324,-1,768,-1,528,396,0,-1,252,480,-1,672,-1,360]
	const DATA = [0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-1,-255,0,1,255,0,-1,0,-255,1,0,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,-1,0,255,1,0,0,-1,-255,0,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,0,-1,255,0,1,0,-255,-1,0,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-4/3,-4/3,-255.33333333333334,1,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-2/3,-5/3,1,0,1,-4/3,-255.33333333333334,-4/3,1,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-2,-1,2,1,0,-2,-3,-1,1,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-1,-2,2,0,1,-2,-1,-3,1,0,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1,-3,-2,0,2,1,-1,-2,-3,0,1,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-4/3,-1/3,-1/3,1,0,0,-8/3,-2/3,-2/3,2,0,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-4/3,-1/3,0,1,0,-2/3,-8/3,-2/3,0,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-1/3,-4/3,0,0,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-255.33333333333334,-4/3,1,255,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-255.33333333333334,-4/3,-4/3,255,1,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-4/3,-255.33333333333334,1,1,255,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-2/3,-8/3,-2/3,0,2,0]
	let SPHERE = new Int16Array([-529, -528, -527, -513, -512, -511, -497, -496, -495, -289, -288, -287, -274, -273, -272, -271, -270, -258, -257, -256, -255, -254, -242, -241, -240, -239, -238, -225, -224, -223, -33, -32, -31, -18, -17, -16, -15, -14, -2, -1, 0, 1, 2, 14, 15, 16, 17, 18, 31, 32, 33, 223, 224, 225, 238, 239, 240, 241, 242, 254, 255, 256, 257, 258, 270, 271, 272, 273, 274, 287, 288, 289, 495, 496, 497, 511, 512, 513, 527, 528, 529])

	let data, positions, perm, perm3D, caves, gradients3D, sphere
	function seedNoise(seed, buffer) {
		positions = new Int32Array(buffer, 0, 80)
		data = new Float64Array(buffer, positions.byteLength, DATA.length)
		const source = new Uint8Array(buffer, data.byteOffset + data.byteLength, 256)
		perm = new Uint8Array(buffer, source.byteOffset + source.byteLength, 256)
		perm3D = new Uint8Array(buffer, perm.byteOffset + perm.byteLength, 256)
		gradients3D = new Int8Array(buffer, perm3D.byteOffset + perm3D.byteLength, GRADIENTS_3D.length)
		caves = new Uint8Array(buffer, gradients3D.byteOffset + gradients3D.byteLength, 16 * 16 * 82)
		sphere = new Int16Array(buffer, caves.byteOffset + caves.byteLength, SPHERE.length)

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
	}

	/*
	const { abs, floor } = Math
	const NORM_3D = 1.0 / 206.0
	const SQUISH_3D = 1 / 3
	const STRETCH_3D = -1 / 6
	function noise(x, y, z) {
		const stretchOffset = (x + y + z) * STRETCH_3D
		const xs = x + stretchOffset
		const ys = y + stretchOffset
		const zs = z + stretchOffset
		const xsb = floor(xs)
		const ysb = floor(ys)
		const zsb = floor(zs)
		const xins = xs - xsb
		const yins = ys - ysb
		const zins = zs - zsb
		const inSum = xins + yins + zins

		const bits = yins - zins + 1
		| xins - yins + 1 << 1
		| xins - zins + 1 << 2
		| inSum << 3
		| inSum + zins << 5
		| inSum + yins << 7
		| inSum + xins << 9

		const n = bits * 571183418275 + 1013904223 >>> 1

		let c = positions[n % 80]
		if (c === -1) return 0
		let value = 0
		const squishOffset = (xsb + ysb + zsb) * SQUISH_3D
		const dx0 = x - (xsb + squishOffset)
		const dy0 = y - (ysb + squishOffset)
		const dz0 = z - (zsb + squishOffset)
		const count = c < 432 ? 6 : 8
		for (let j = 0; j < count ; j++) {
			const dx = dx0 + data[c]
			const dy = dy0 + data[c+1]
			const dz = dz0 + data[c+2]
			let attn = 2 - dx * dx - dy * dy - dz * dz
			if (attn > 0) {
				let i = perm3D[(perm[xsb + data[c+3] & 0xFF] + (ysb + data[c+4]) & 0xFF) + (zsb + data[c+5]) & 0xFF]
				attn *= attn
				value += attn * attn * (gradients3D[i] * dx + gradients3D[i + 1] * dy + gradients3D[i + 2] * dz)
			}
			c += 6
		}

		return value * NORM_3D + 0.5
	}
	const smooth = 0.02
	const caveSize = 0.0055
	function isCave(x, y, z) {
		// Generate a 3D rigid multifractal noise shell.
		// Then generate another one with different coordinates.
		// Overlay them on top of each other, and the overlapping edges should form a cave-like structure.
		// This is extremely slow, and requires generating 1 or 2 noise values for every single block in the world.
		// TODO: replace with a crawler system of some sort, that will never rely on a head position in un-generated chunks.

		return abs(0.5 - noise(x * smooth, y * smooth, z * smooth)) < caveSize
			&& abs(0.5 - noise(y * smooth, z * smooth, x * smooth)) < caveSize
	}
	*/

	// This is my compiled cave generation code. I wrote it in C. It includes my OpenSimplexNoise function, plus the logic to carve caves within the borders of the chunk it's operating on.
	const program = new Uint8Array(atob("AGFzbQEAAAABEQNgAABgA3x8fAF8YAJ/fwF/AwQDAAECBAUBcAEBAQUEAQEBAQcdBAZtZW1vcnkCAAFiAAAIZ2V0Q2F2ZXMAAgFkAQAMAQAKzwYDAwABC4YEAgR/CHxEAAAAAAAA8D8gASAAoCACoERVVVVVVVXFv6IiByABoCILIAucIguhIgqhIAcgAKAiDCAMnCIMoSIIoKohA0GACCgCAEQAAAAAAADwPyAHIAKgIgcgB5wiB6EiDaEiCSAKoKogA0EBdHIgCSAIoKpBAnRyIAggCqAgDaAiCapBA3RyIAkgDaCqQQV0ciAJIAqgqkEHdHIgCSAIoKpBCXRyQaOXvWlsQd/mu+MDakEBdkHQAHBBAnRqKAIAIgRBf0YEQEQAAAAAAAAAAA8LIAIgB6EgDCALoCAHoERVVVVVVVXVv6IiAqAhCSABIAuhIAKgIQ0gACAMoSACoCEOQQZBCCAEQbADSBshBkQAAAAAAAAAACEBA0BEAAAAAAAAAEAgDSAEQQN0IgMrA8gCoCIAIACiIA4gAysDwAKgIgIgAqKgIAkgAysD0AKgIgogCqKgoSIIRAAAAAAAAAAAZUUEQCAIIAiiIgggCKIgACADKwPoAiAHoKogAysD2AIgDKCqQf8BcUHAwwBqLQAAIAMrA+ACIAugqmpqQf8BcUHAxQBqLAAAIgNBwccAaiwAALeiIAIgA0HAxwBqLAAAt6KgIAogA0HCxwBqLAAAt6KgoiABoCEBCyAEQQZqIQQgBUEBaiIFIAZHDQALIAFEAqnkvCzicz+iRAAAAAAAAOA/oAvAAgIDfwN8QYjIAEEAQYCkAfwLAEGACCECA0ACQEQAAAAAAADgPyACQQR2QQ9xIgQgAGq3RHsUrkfhepQ/oiIFIAJBCHa3RHsUrkfhepQ/oiIGIAJBD3EiAyABardEexSuR+F6lD+iIgcQAaGZRLpJDAIrh3Y/Zg0ARAAAAAAAAOA/IAYgByAFEAGhmUS6SQwCK4d2P2YNAAJAIARBAmtBC0sNACADQQJJDQBBACEEIANBDUsNAANAIAIgBEEBdEGI7AFqLgEAaiIDQYjIAGotAABBAUcEQCADQQI6AIhICyAEQQFyIgNB0QBGDQIgAiADQQF0QYjsAWouAQBqIgNBiMgAai0AAEEBRwRAIANBAjoAiEgLIARBAmohBAwACwALIAJBiMgAakEBOgAACyACQQFqIgJBgKABRw0AC0GIyAAL").split("").map(c => c.charCodeAt(0))).buffer

	const wasm = await WebAssembly.instantiate(program)
	// const wasm = await WebAssembly.instantiateStreaming(fetch('http://localhost:4000//caves.wasm'))
	// const wasm = await WebAssembly.instantiateStreaming(fetch('http://localhost:4000//wasm_bg.wasm'))

	const exports = wasm.instance.exports
	const wasmCaves = exports.getCaves || exports.get_caves || exports.c
	const wasmMemory = exports.memory || exports.a

	self.onmessage = function(e) {
		if (e.data && e.data.seed) {
			if (exports.seed_noise) exports.seed_noise(e.data.seed)
			else seedNoise(e.data.seed, wasmMemory.buffer)
			self.postMessage(e.data)
		}
		if (e.data && e.data.caves) {
			const { x, z } = e.data
			const ptr = wasmCaves(x, z)
			// const buffer = wasmMemory.buffer.slice(ptr, ptr + 20992)
			const arr = new Int8Array(wasmMemory.buffer, ptr, 20992)

			let air = []
			let carve = []
			for (let i = 512; i < arr.length; i++) {
				if (arr[i] === 1) carve.push(i)
				else if (arr[i] === 2) air.push(i)
			}
			let airArr = new Uint16Array(air)
			let carveArr = new Uint16Array(carve)

			self.postMessage({
				air: airArr,
				carve: carveArr
			}, [airArr.buffer, carveArr.buffer])
		}
	}
}
Worker()