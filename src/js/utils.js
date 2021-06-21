const { floor } = Math;

function timeString(millis) {
	if (millis > 300000000000 || !millis) {
		return "never"
	}
	const SECOND = 1000
	const MINUTE = SECOND * 60
	const HOUR = MINUTE * 60
	const DAY = HOUR * 24
	const YEAR = DAY * 365

	if (millis < MINUTE) {
		return "just now"
	}

	let years = floor(millis / YEAR)
	millis -= years * YEAR

	let days = floor(millis / DAY)
	millis -= days * DAY

	let hours = floor(millis / HOUR)
	millis -= hours * HOUR

	let minutes = floor(millis / MINUTE)

	if (years) {
		return `${years} year${years > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} ago`
	}
	if (days) {
		return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
	}
	if (hours) {
		return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
	}
	return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
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

export { timeString, roundBits, compareArr };