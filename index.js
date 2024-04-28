

const fs = require('fs')
const Path = require("path")
const f = fs.promises
const os = require('os')

const cmd = process.argv[2]?.toLowerCase() || ""
const buildPath = cmd === "production" ? "../../public/minekhan/index.html" : cmd === "beta" ? "../../public/minekhan/beta/index.html" : "dist/index.html"

if (!cmd) {
	// This is for testing on localhost
	const express = require("express")
	const compression = require("compression")
	const app = express()
	app.use(compression({ threshold : 0 }))
	app.listen(4000)
	app.use('/', (req, res, next) => {
		// Make SharedArrayBuffer and performance.measureUserAgentSpecificMemory() work (for !!SCIENCE!!)
		res.header('Cross-Origin-Opener-Policy', 'same-origin')
		res.header('Cross-Origin-Embedder-Policy', 'require-corp')
		next()
	})
	app.use(express.static('dist'))
	console.log("Server started on http://localhost:4000")

	try {
		// Only works on Linux, but it'll open the page.
		require("child_process").exec("browse http://localhost:4000")
	}
	catch{}

	// Find the computer's network IP
	const nets = os.networkInterfaces()
	for (const name in nets) {
		for (const net of nets[name]) {
			if (net.address.includes(".") && !net.internal) console.log(`Other devices on your network can open the game on http://${net.address}:4000`)
		}
	}
}

function bundle() {
	let startTime = Date.now()
	let files = {}
	let cssFiles = []
	let loading = new Set()
	const loadFiles = path => {
		if (path in files) return
		if (loading.has(path)) throw new Error(`Dependency loop in ${path}!`)
		loading.add(path)
		let file = fs.readFileSync(path, "utf-8")
		const lines = file.split("\n")
		for (let i = 0; i < lines.length; i++) {
			const imp = lines[i].match(/^(\s*)import ((.+) from )?['"](.+)['"]/)
			if (imp) {
				let p = Path.join(path.split("/").slice(0, -1).join("/"), imp[4])
				if (p.endsWith(".css")) {
					lines[i] = "// " + lines[i]
					cssFiles.push(p)
					continue
				}
				if (!p.includes(".")) p += ".js"

				loadFiles(p)

				let value = `window.parent.exports["${p}"]`
				if (p.startsWith("src/shaders") || p.startsWith("src/workers")) {
					value = `document.getElementById("${p}").textContent`
				}

				lines[i] = `${imp[1]}const ${imp[3]} = ${value}`
			}

			const exp = lines[i].match(/^(\s*)export (.+)/)
			if (exp) {
				lines[i] = `${exp[1]}window.parent.exports["${path}"] = ${exp[2]}`
			}
		}
		files[path] = lines.join("\n")
		loading.delete(path)
	}

	loadFiles("src/main.js")
	const html = fs.readFileSync("src/index.html", "utf-8").split("\n")
	const css = cssFiles.map(path => fs.readFileSync(path, "utf-8"))
	for (let i = html.length - 1; i >= 0; i--) {

		// Insert <style>s in head
		const head = html[i].match(/(\s*)<\/head>/)
		if (head) {
			html.splice(i, 0, ...css.map(styles => `${head[1]}\t<style>\n${styles}\n${head[1]}\t</style>`))
			// i -= 1
			continue
		}

		// Insert <script>s in body
		const body = html[i].match(/(\s*)<\/body>/)
		if (body) {
			const fileList = Object.entries(files).map(([path, code]) => {
				const ret = { id: path, code, type: "application/javascript" }
				if (path.startsWith("src/shaders")) {
					if (path.includes("Frag")) ret.type = "x-shader/x-fragment"
					else ret.type = "x-shader/x-vertex"
				}
				else if (path.startsWith("src/workers")) {
					ret.type = "text/js"
				}
				else {
					ret.code = `{${ret.code}}`
				}
				return ret
			})
			html.splice(i, 0, ...fileList.map(({ id, type, code }) => `${body[1]}\t<script id="${id}" type="${type}">\n${code}\n${body[1]}\t</script>`))
		}
	}

	const code = html.join("\n")
	// .replace(/<!--[\s\S]+?-->/gm, "").replace(/\/\*.+?\*\//gm, "")
	// .split("\n").map(line => line.trim()).filter(line => line && !line.startsWith("//")).join("\n")
	console.log("\n" + new Date().toISOString(), "\nCode Length:", code.length.toLocaleString(), "\nCompile Time:", (Date.now() - startTime).toLocaleString(), "ms")
	f.writeFile(buildPath, code)
}

bundle()

let watching = {}
function watchFolder(path) {
	if (watching[path] || path.split("/").pop().includes(".")) return
	watching[path] = true
	let fsWait = false
	fs.watch(path, (eventType, filename) => {
		if (filename) {
			if (fsWait) clearTimeout(fsWait)
			fsWait = setTimeout(() => {
				fsWait = false
				watchAll(`${path}/${filename}`)
				bundle()
			}, 100)
		}
	})
	watchAll(path)
}

async function watchAll(path) {
	let subs = await f.readdir(path).catch(() => [])
	for (let sub of subs) {
		watchFolder(`${path}/${sub}`)
	}
}

watchFolder("src")