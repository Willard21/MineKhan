// This is for testing on localhost
const express = require("express")
const app = express()
app.listen(4000)
app.use('/', (req, res, next) => {
	// Make SharedArrayBuffer work
	res.header('Cross-Origin-Opener-Policy', 'same-origin')
	res.header('Cross-Origin-Embedder-Policy', 'require-corp')
	next()
})
app.use(express.static('dist'))