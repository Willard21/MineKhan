import { texturesFunc } from "./blockData.js"

/**
 * Texture name to index map.
 */
const textureMap = {}
const textureCoords = []
const textureSize = 256
const scale = 1 / 16
const texturePixels = new Uint8Array(textureSize * textureSize * 4)

/**
 * @param {WebGLRenderingContext} gl
 */
function initTextures(gl, glCache) {
	const setPixel = function(textureNum, x, y, r, g, b, a) {
		let texX = textureNum & 15
		let texY = textureNum >> 4
		let offset = (texY * 16 + y) * 1024 + texX * 64 + x * 4
		texturePixels[offset] = r
		texturePixels[offset + 1] = g
		texturePixels[offset + 2] = b
		texturePixels[offset + 3] = a !== undefined ? a : 255
	}

	const base256CharSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEF!#$%&L(MNO)*+,-./:;<=WSTR>Q?@[]P^_{|}~ÀÁÂÃUVÄÅÆÇÈÉÊËÌÍKÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãGäåæçèéêHëìíîXïðñIòóôõö÷øùúJûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦYħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťZ'
	const base256DecodeMap = new Map()
	for (let i = 0; i < 256; i++) base256DecodeMap.set(base256CharSet[i], i)
	function decodeByte(str) {
		let num = 0
		for (let char of str) {
			num <<= 8
			num += base256DecodeMap.get(char)
		}
		return num
	}

	const getPixels = function(str, r = 255, g = 255, b = 255) {
		if (Array.isArray(r)) {
			[r, g, b] = r
		}
		const width = decodeByte(str.substr(0, 2))
		const height = decodeByte(str.substr(2, 2))
		const colorCount = decodeByte(str.substr(4, 1))
		const colors = []
		const pixels = new Uint8ClampedArray(width * height * 4)
		for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255
		let pixi = 0

		for (let i = 0; i < colorCount; i++) {
			const num = decodeByte(str.substr(5 + i * 3, 3))

			let alpha = (num & 63) << 2
			let blue  = (num >>> 6 & 63) << 2
			let green = (num >>> 12 & 63) << 2
			let red   = (num >>> 18 & 63) << 2
			if (alpha >= 240) alpha = 255 // Make sure we didn't accidentally make the texture transparent

			if (red === blue && red === green) {
				red = red / 252 * r | 0
				green = green / 252 * g | 0
				blue = blue / 252 * b | 0
			}
			colors.push([red, green, blue, alpha])
		}

		// Special case for a texture filled with 1 pixel color
		if (colorCount === 1) {
			while (pixi < pixels.length) {
				pixels[pixi + 0] = colors[0][0]
				pixels[pixi + 1] = colors[0][1]
				pixels[pixi + 2] = colors[0][2]
				pixels[pixi + 3] = colors[0][3]
				pixi += 4
			}
			return pixels
		}

		let bytes = []
		for (let i = 5 + colorCount * 3; i < str.length; i++) { // Load the bit-packed index array
			const byte = decodeByte(str[i])
			bytes.push(byte)
		}

		const bits = Math.ceil(Math.log2(colorCount))
		const bitMask = (1 << bits) - 1
		let filledBits = 8
		let byte = bytes.shift()
		while (bytes.length || filledBits) {
			let num = 0
			if (filledBits >= bits) { // The entire number is inside the byte
				num = byte >> filledBits - bits & bitMask
				if (filledBits === bits && bytes.length) {
					byte = bytes.shift()
					filledBits = 8
				}
				else filledBits -= bits
			}
			else {
				num = byte << bits - filledBits & bitMask // Only part of the number is in the byte
				byte = bytes.shift() // Load in the next byte
				num |= byte >> 8 - bits + filledBits // Apply the rest of the number from this byte
				filledBits += 8 - bits
			}

			pixels[pixi + 0] = colors[num][0]
			pixels[pixi + 1] = colors[num][1]
			pixels[pixi + 2] = colors[num][2]
			pixels[pixi + 3] = colors[num][3]
			pixi += 4
		}
		return pixels
	}

	const textures = texturesFunc(setPixel, getPixels)

	{
		// Specify the texture coords for each index
		const s = scale
		for (let i = 0; i < 256; i++) {
			let texX = i & 15
			let texY = i >> 4
			let offsetX = texX * scale
			let offsetY = texY * scale
			textureCoords.push(new Float32Array([offsetX, offsetY, offsetX + s, offsetY, offsetX + s, offsetY + s, offsetX, offsetY + s]))
		}

		// Set all of the textures into 1 big tiled texture
		let n = 0
		for (let name in textures) {
			if (typeof textures[name] === "function") {
				textures[name](n)
			}
			else if (typeof textures[name] === "string") {
				let pix = name.includes("water")
					? getPixels(textures[name], 40, 100, 220)
					: getPixels(textures[name])
				for (let j = 0; j < pix.length; j += 4) {
					setPixel(n, j >> 2 & 15, j >> 6, pix[j], pix[j+1], pix[j+2], pix[j+3])
				}
			}
			textureMap[name] = n
			n++
		}

		//Set the hitbox texture to 1 pixel
		let arr = new Float32Array(192)
		for (let i = 0; i < 192; i += 2) {
			arr[i] = textureCoords[textureMap.hitbox][0] + 0.01
			arr[i + 1] = textureCoords[textureMap.hitbox][1] + 0.01
		}
		textureCoords[textureMap.hitbox] = arr
	}

	const makeTexture = (index, width, height, pixels, edge) => {
		const texture = gl.createTexture()
		gl.activeTexture(index)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, edge)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, edge)
		return texture
	}

	// Big texture with everything in it
	makeTexture(gl.TEXTURE0, textureSize, textureSize, texturePixels, gl.CLAMP_TO_EDGE)
	gl.uniform1i(glCache.uSampler, 0)

	// Dirt texture for the background
	let dirtPixels = new Uint8Array(getPixels(textures.dirt))
	makeTexture(gl.TEXTURE1, 16, 16, dirtPixels, gl.REPEAT)
}

function animateTextures(gl) {
	// const x = Math.random() * 16 | 0
	// const y = Math.random() * 16 | 0

	// const d = Math.random() * 0.25 + 0.65
	// texturePixels[y * textureSize * 4 + x * 4 + 0] = 75 * d
	// texturePixels[y * textureSize * 4 + x * 4 + 1] = 125 * d
	// texturePixels[y * textureSize * 4 + x * 4 + 2] = 64 * d

	// gl.activeTexture(gl.TEXTURE0) // Moved to play()
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, texturePixels)
}

export { initTextures, textureMap, textureCoords, animateTextures }