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

export { timeString, roundBits };