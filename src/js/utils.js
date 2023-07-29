const { floor } = Math

function timeString(millis) {
	if (millis > 300000000000 || !millis) {
		return "never"
	}
	const SECOND = 1000
	const MINUTE = SECOND * 60
	const HOUR = MINUTE * 60
	const DAY = HOUR * 24
	const YEAR = DAY * 365

	let years = floor(millis / YEAR)
	millis -= years * YEAR

	let days = floor(millis / DAY)
	millis -= days * DAY

	let hours = floor(millis / HOUR)
	millis -= hours * HOUR

	let minutes = floor(millis / MINUTE)
	millis -= minutes * MINUTE

	let seconds = floor(millis / SECOND)

	if (years) {
		return `${years} year${years > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} ago`
	}
	if (days) {
		return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
	}
	if (hours) {
		return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
	}
	if (minutes) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""} ago`
	}
	return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
}

function roundBits(number) {
	return (number * 1000000 + 0.5 | 0) / 1000000
}

function compareArr(arr, out) {
	let minX = 1000
	let maxX = -1000
	let minY = 1000
	let maxY = -1000
	let minZ = 1000
	let maxZ = -1000
	let num = 0
	for (let i = 0; i < arr.length; i += 3) {
		num = arr[i]
		minX = minX > num ? num : minX
		maxX = maxX < num ? num : maxX
		num = arr[i + 1]
		minY = minY > num ? num : minY
		maxY = maxY < num ? num : maxY
		num = arr[i + 2]
		minZ = minZ > num ? num : minZ
		maxZ = maxZ < num ? num : maxZ
	}
	out[0] = minX
	out[1] = minY
	out[2] = minZ
	out[3] = maxX
	out[4] = maxY
	out[5] = maxZ
	return out
}

class BitArrayBuilder {
	constructor() {
		this.bitLength = 0
		this.data = [] // Byte array
	}
	add(num, bits) {
		if (+num !== +num || +bits !== +bits || +bits < 0) throw "Broken"
		num &= -1 >>> 32 - bits
		let index = this.bitLength >>> 3
		let openBits = 8 - (this.bitLength & 7)
		this.bitLength += bits
		while (bits > 0) {
			this.data[index] |= openBits >= bits ? num << openBits - bits : num >>> bits - openBits
			bits -= openBits
			index++
			openBits = 8
		}
		return this // allow chaining like arr.add(x, 16).add(y, 8).add(z, 16)
	}
	/**
	 * Takes all the bits from another BAB and adds them to this one.
	 * @param {BitArrayBuilder} bab The BAB to append
	 */
	append(bab) {
		// If our bits are already aligned, just add them directly
		if ((this.bitLength & 7) === 0) {
			this.data.push(...bab.data)
			this.bitLength += bab.bitLength
			return
		}

		// Add them 1 at a time, except for the last one
		let bits = bab.bitLength
		let i = 0
		while (bits > 7) {
			this.add(bab.data[i++], 8)
			bits -= 8
		}
		if (bits) {
			this.add(bab.data[i] >>> 8 - bits, bits)
		}
	}
	get array() {
		return new Uint8Array(this.data)
	}
	/**
	 * @param {Number} num
	 * @returns The number of bits required to hold num
	 */
	static bits(num) {
		return Math.ceil(Math.log2(num))
	}
}
class BitArrayReader {
	/**
	 * @param {Uint8Array} array An array of values from 0 to 255
	 */
	constructor(array) {
		this.data = array // Byte array; values are assumed to be under 256
		this.bit = 0
	}
	read(bits, negative = false) {
		let openBits = 32 - bits
		let { data, bit } = this
		this.bit += bits // Move pointer
		if (bit > data.length * 8) {
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
			// console.log("Negative", ret, ret << openBits >> openBits)
			return ret << openBits >> openBits
		}
		return ret
	}
}

export { timeString, roundBits, compareArr, BitArrayBuilder, BitArrayReader }