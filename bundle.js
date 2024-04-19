const fs = require('fs')
const Path = require("path")
const f = fs.promises

async function main() {
	let files = {}
	let cssFiles = []
	let loading = new Set()
	const loadFiles = async path => {
		if (path in files) return
		if (loading.has(path)) throw new Error(`Dependency loop in ${path}!`)
		loading.add(path)
		let file = await f.readFile(path, "utf-8")
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

				await loadFiles(p)

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

	await loadFiles("src/main.js")
	const html = await f.readFile("src/index.html", "utf-8").then(n => n.split("\n"))
	const css = await Promise.all(cssFiles.map(path => f.readFile(path)))
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
	console.log("Code length:", code.length.toLocaleString())
	f.writeFile("dist/index.html", code)
}

main()