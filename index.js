// This is for testing on localhost
const express = require("express")
const app = express()
app.listen(4000)
app.use('/', (req, res, next) => {
	// Make SharedArrayBuffer and performance.measureUserAgentSpecificMemory() work
	res.header('Cross-Origin-Opener-Policy', 'same-origin')
	res.header('Cross-Origin-Embedder-Policy', 'require-corp')
	next()
})
app.use(express.static('dist'))
console.log("Server started on http://localhost:4000")

// Find the computer's network IP
const nets = require('os').networkInterfaces()
for (const name in nets) {
	for (const net of nets[name]) {
		if (net.address.includes(".") && !net.internal) console.log(`Other devices on your network can open the game on http://${net.address}:4000`)
	}
}