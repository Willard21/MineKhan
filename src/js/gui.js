import { saveToDB } from './indexDB.js'
import { changelog } from './js/changelog.js'

let scene = "mainMenu"
let scenePath = [scene]
const win = window.parent

const quota = document.getElementById("quota")
const hoverbox = document.getElementById("onhover")
const chatOutput = document.getElementById("chat")
const chatInput = document.getElementById("chatbar")

const { round, min } = window.Math
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("overlay")
let width = canvas.width = win.innerWidth
let height = canvas.height = win.innerHeight

let background = "url(./background.webp)"
if (location.origin === "https://www.kasandbox.org") background = "url(https://www.khanacademy.org/computer-programming/minekhan/5647155001376768/latest.png)"
else if (!location.origin.includes("localhost") && location.origin !== "file://") background = "url(https://willard.fun/minekhan/background.webp)"
canvas.style.backgroundImage = background

const ctx = canvas.getContext("2d")

const html = {
	play: {
		enter: [document.getElementById("hotbar")],
		exit: [document.getElementById("hotbar")]
	},
	pause: {
		enter: [win.message],
		exit: [win.savebox, win.saveDirections, win.message]
	},
	mainMenu: {
		onenter: () => {
			canvas.style.backgroundImage = background
		},
		onexit: () => {
			canvas.style.backgroundImage = ""
			dirt()
		}
	},
	loadsaveMenu: {
		enter: [win.worlds, win.boxCenterTop, quota],
		exit: [win.worlds, win.boxCenterTop, quota],
		onenter: () => {
			win.boxCenterTop.placeholder = "Enter Save String (Optional)"
			if (navigator && navigator.storage && navigator.storage.estimate) {
				navigator.storage.estimate().then(data => {
					quota.innerText = `${data.usage.toLocaleString()} / ${data.quota.toLocaleString()} bytes (${(100 * data.usage / data.quota).toLocaleString(undefined, { maximumSignificantDigits: 2 })}%) of your quota used`
				}).catch(console.error)
			}
			win.boxCenterTop.onmousedown = () => {
				let elem = document.getElementsByClassName("selected")
				if (elem && elem[0]) {
					elem[0].classList.remove("selected")
				}
				selectedWorld = 0
				Button.draw()
			}
		},
		onexit: () => {
			win.boxCenterTop.onmousedown = null
		}
	},
	creationMenu: {
		enter: [win.boxCenterTop],
		exit: [win.boxCenterTop],
		onenter: () => {
			win.boxCenterTop.placeholder = "Enter World Name"
			win.boxCenterTop.value = ""
		}
	},
	loading: {
		enter: [document.getElementById("loading-text")],
		exit: [document.getElementById("loading-text")],
		onenter: startLoad
	},
	editworld: {
		enter: [win.boxCenterTop],
		exit: [win.boxCenterTop],
		onenter: () => {
			win.boxCenterTop.placeholder = "Enter World Name"
			win.boxCenterTop.value = ""
		}
	},
	multiplayerMenu: {
		enter: [win.worlds],
		exit: [win.worlds]
	},
	chat: {
		enter: [chatInput, chatOutput],
		exit: [chatInput, chatOutput],
		onenter: () => {
			chatInput.focus()
			releasePointer()
			chatOutput.scroll(0, 10000000)
		}
	},
	inventory: {
		enter: [document.getElementById('inv-container')],
		exit: [document.getElementById('inv-container'), hoverbox, document.getElementById('heldItem')],
		onenter: () => {
			ctx.clearRect(0, 0, width, height) // Hide the GUI and text and stuff
			inventory.playerStorage.render()
		}
	},
	controls: {
		enter: [document.getElementById("controls-container")],
		exit: [document.getElementById("controls-container")],
	},
	changelog: {
		enter: [changelog],
		exit: [changelog]
	}
}

let fill = function(r, g, b) {
	if (g === undefined) {
		g = r
		b = r
	}
	ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
}
let stroke = function(r, g, b) {
	if (g === undefined) {
		g = r
		b = r
	}
	ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
}
// const line = (x1, y1, x2, y2) => {
// 	ctx.moveTo(x1, y1)
// 	ctx.lineTo(x2, y2)
// }
const text = (txt, x, y, h) => {
	h = h || 0

	let lines = txt.split("\n")
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y + h * i)
	}
}
const textSize = (size) => {
	ctx.font = size + 'px Monospace' // VT323
}
let strokeWeight = function(num) {
	ctx.lineWidth = num
}
// const ARROW = "arrow"
const HAND = "pointer"
// const CROSS = "crosshair"
let cursor = function(type) {
	canvas.style.cursor = type
}

class Slider {
	constructor(x, y, w, h, scenes, label, min, max, settingName, callback) {
		this.x = x
		this.y = y
		this.h = h
		this.w = Math.max(w, 350)
		this.name = settingName
		this.scenes = Array.isArray(scenes) ? scenes : [scenes]
		this.label = label
		this.min = min
		this.max = max
		this.sliding = false
		this.callback = callback
	}
	draw(settings) {
		if (!this.scenes.includes(scene)) {
			return
		}
		let current = (settings[this.name] - this.min) / (this.max - this.min)

		// Outline
		ctx.beginPath()
		strokeWeight(2)
		stroke(0)
		fill(85)
		ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
		ctx.stroke()
		ctx.fill()

		// Slider bar
		let value = round(settings[this.name])
		ctx.beginPath()
		fill(130)
		let x = this.x - (this.w - 10) / 2 + (this.w - 10) * current - 5
		ctx.fillRect(x, this.y - this.h / 2, 10, this.h)

		// Label
		fill(255, 255, 255)
		textSize(16)
		ctx.textAlign = 'center'
		text(`${this.label}: ${value}`, this.x, this.y + this.h / 8)
	}
	click(settings, mouseX, mouseY) {
		if (!mouseDown || !this.scenes.includes(scene)) {
			return false
		}

		if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
			let current = (mouseX - this.x + this.w / 2) / this.w
			if (current < 0) current = 0
			if (current > 1) current = 1
			this.sliding = true
			settings[this.name] = current * (this.max - this.min) + this.min
			this.callback(current * (this.max - this.min) + this.min)
			this.draw(settings)
		}
	}
	drag(settings, mouseX, mouseY) {
		if (!this.sliding || !this.scenes.includes(scene)) {
			return false
		}

		let current = (mouseX - this.x + this.w / 2) / this.w
		if (current < 0) current = 0
		if (current > 1) current = 1
		settings[this.name] = current * (this.max - this.min) + this.min
		this.callback(current * (this.max - this.min) + this.min)
	}
	release() {
		this.sliding = false
	}

	static draw() {
		for (let slider of Slider.all) {
			slider.draw()
		}
	}
	static click() {
		for (let slider of Slider.all) {
			slider.click()
		}
	}
	static release() {
		for (let slider of Slider.all) {
			slider.release()
		}
	}
	static drag() {
		if (mouseDown) {
			for (let slider of Slider.all) {
				slider.drag()
			}
		}
	}
	static add(x, y, w, h, scenes, label, min, max, defaut, callback) {
		Slider.all.push(new Slider(x, y, w, h, scenes, label, min, max, defaut, callback))
	}
}
Slider.all = []
class Button {
	constructor(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
		this.x = x
		this.y = y
		this.h = h
		this.w = w
		this.index = 0
		this.disabled = disabled || (() => false)
		this.hoverText = !hoverText || typeof hoverText === "string" ? () => hoverText : hoverText
		this.scenes = Array.isArray(scenes) ? scenes : [scenes]
		this.labels = Array.isArray(labels) ? labels : [labels]
		this.callback = callback
	}

	mouseIsOver(mouseX, mouseY) {
		return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2
	}
	draw(scene, ctx) {
		if (!this.scenes.includes(scene)) {
			return
		}
		let hovering = this.mouseIsOver()
		let disabled = this.disabled()
		let hoverText = this.hoverText()

		// Outline
		ctx.beginPath()
		if (hovering && !disabled) {
			strokeWeight(7)
			stroke(255)
			cursor(HAND)
		}
		else {
			strokeWeight(3)
			stroke(0)
		}
		if (disabled) {
			fill(60)
		}
		else {
			fill(120)
		}
		ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
		ctx.stroke()
		ctx.fill()

		// Label
		fill(255)
		textSize(16)
		ctx.textAlign = 'center'
		const label = this.labels[this.index]
		text(label.call ? label() : label, this.x, this.y + this.h / 8)

		if (hovering && hoverText) {
			hoverbox.innerText = hoverText
			if (hoverbox.className.includes("hidden")) hoverbox.classList.remove("hidden")
			if (mouseY < height / 2) {
				hoverbox.style.bottom = ""
				hoverbox.style.top = mouseY + 10 + "px"
			}
			else {
				hoverbox.style.top = ""
				hoverbox.style.bottom = height - mouseY + 10 + "px"
			}
			if (mouseX < width / 2) {
				hoverbox.style.right = ""
				hoverbox.style.left = mouseX + 10 + "px"
			}
			else {
				hoverbox.style.left = ""
				hoverbox.style.right = width - mouseX + 10 + "px"
			}
		}
	}
	click() {
		if (this.disabled() || !mouseDown || !this.scenes.includes(scene)) {
			return false
		}

		if (this.mouseIsOver()) {
			this.index = (this.index + 1) % this.labels.length
			this.callback(this.labels[this.index])
			return true
		}
	}

	static draw() {
		if (scene !== "inventory" && scene !== "play") hoverbox.classList.add("hidden")
		for (let button of Button.all) {
			button.draw()
		}
	}
	static click() {
		for (let button of Button.all) {
			if (button.click()) {
				Button.draw()
				break
			}
		}
	}
	static add(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
		Button.all.push(new Button(x, y, w, h, labels, scenes, callback, disabled, hoverText))
	}
}
Button.all = []

let debugLines = []
let newDebugLines = []


class GUI {
	scene = "home"

	/** @param {import('./game.js').game} game  */
	constructor(game) {
		this.width = width
		this.height = height
		this.game = game

		canvas.width  = this.width
		canvas.height = this.height
		this.ctx = ctx
	}
	draw() {
		this[this.scene]()
		this.hud()
		this.renderChatAlerts()
	}
	crosshair() {
		if (p.spectator) return
		let x = width / 2 + 0.5
		let y = height / 2 + 0.5
		ctx.lineWidth = 1
		ctx.strokeStyle = "white"
		ctx.beginPath()
		ctx.moveTo(x - 10, y)
		ctx.lineTo(x + 10, y)
		ctx.moveTo(x, y - 10)
		ctx.lineTo(x, y + 10)
		ctx.stroke()
	}
	hud(clear) {
		if (p.spectator || scene !== "play") return
		if (clear) debugLines.length = 0

		let x = 5
		let lineHeight = 24
		let y = lineHeight + 3
		let heightOffset = floor(lineHeight / 5)

		let lines = 0
		if (settings.showDebug === 3) {
			newDebugLines[0] = "Press F3 to cycle debug info."
			lines = 1
		}
		else {
			if (settings.showDebug >= 1) {
				newDebugLines[lines++] = analytics.fps + "/" + analytics.displayedwFps + "fps, C: " + renderedChunks.toLocaleString()
				newDebugLines[lines++] = "XYZ: " + p2.x + ", " + p2.y + ", " + p2.z
			}
			if (settings.showDebug >= 2) {
				newDebugLines[lines++] = "Average Frame Time: " + analytics.displayedFrameTime + "ms"
				newDebugLines[lines++] = "Worst Frame Time: " + analytics.displayedwFrameTime + "ms"
				newDebugLines[lines++] = "Render Time: " + analytics.displayedRenderTime + "ms"
				newDebugLines[lines++] = "Tick Time: " + analytics.displayedTickTime + "ms"
				newDebugLines[lines++] = "Generated Chunks: " + generatedChunks.toLocaleString()
			}
		}
		if (p.autoBreak) newDebugLines[lines++] = "Super breaker enabled"
		if (p.autoBuild) newDebugLines[lines++] = "Hyper builder enabled"
		if (multiplayer) {
			playerDistances.length = 0
			let closest = Infinity
			let cname = "Yourself"
			for (let name in playerPositions) {
				let pos = playerPositions[name]
				let distance = sqrt((pos.x - p2.x)*(pos.x - p2.x) + (pos.y - p2.y)*(pos.y - p2.y) + (pos.z - p2.z)*(pos.z - p2.z))
				playerDistances.push({
					name,
					distance
				})
				if (distance < closest) {
					closest = distance
					cname = name
				}
			}
			newDebugLines[lines++] = `Closest player: ${cname} (${round(closest)} blocks away)`
		}

		// Draw updated text
		ctx.textAlign = 'left'
		for (let i = 0; i < lines; i++) {
			if (debugLines[i] !== newDebugLines[i]) {
				let start = 0
				if (debugLines[i]) {
					for (let j = 0; j < debugLines[i].length; j++) {
						if (debugLines[i][j] !== newDebugLines[i][j]) {
							start = j
							break
						}
					}
					ctx.clearRect(x + start * charWidth, y + lineHeight * (i - 1) + heightOffset, (debugLines[i].length - start) * charWidth, lineHeight)
				}
				ctx.fillStyle = "rgba(50, 50, 50, 0.4)"
				ctx.fillRect(x + start * charWidth, y + lineHeight * (i-1) + heightOffset, (newDebugLines[i].length - start) * charWidth, lineHeight)
				ctx.fillStyle = "#fff"
				ctx.fillText(newDebugLines[i].slice(start), x + start*charWidth, y + lineHeight * i)
				debugLines[i] = newDebugLines[i]
			}
		}

		// Remove extra lines
		if (lines < debugLines.length) {
			let maxWidth = 0
			for (let i = lines; i < debugLines.length; i++) {
				maxWidth = Math.max(maxWidth, debugLines[i].length)
			}
			ctx.clearRect(x, y + (lines - 1) * lineHeight + heightOffset, maxWidth * charWidth, lineHeight * (debugLines.length - lines))
			debugLines.length = lines
		}
	}
	initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true
		let survival = false

		// MainMenu buttons
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "mainMenu", () => {
			initWorldsMenu()
			changeScene("loadsaveMenu")
		})
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "mainMenu", () => {
			changeScene("multiplayerMenu")
			initMultiplayerMenu()
		}, () => !location.href.startsWith("https://willard.fun"), "Please visit https://willard.fun/login to enjoy multiplayer.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "mainMenu", () => changeScene("options"))
		Button.add(width / 2, height / 2 + 145, 400, 40, "Change Log" + (settings.lastVersion !== version ? " (NEW UPDATE!)" : ""), "mainMenu", () => {
			changeScene("changelog")
			if (settings.lastVersion !== version) {
				settings.lastVersion = version
				saveToDB("settings", settings).catch(e => console.error(e))
			}
		})
		if (height <= 600) {
			Button.add(width / 2, height / 2 + 200, 400, 40, "Full Screen", "mainMenu", () => {
				const w = window.open()
				w.document.write(document.children[0].outerHTML)
			})
		}

		// CreationMenu buttons
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creationMenu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Terrain Details: On", "Terrain Details: Off"], "creationMenu", r => details = r === "Terrain Details: On", function() {
			if (superflat) {
				this.index = 1
				details = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creationMenu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		Button.add(width / 2, 285, 300, 40, ["Game Mode: Creative", "Game Mode: Survival"], "creationMenu", r => survival = r === "Game Mode: Survival")
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creationMenu", nothing, always, "Ender dragon blocks? Maybe? Hmmmmmmmmmm...")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creationMenu", () => {
			if (survival) {
				alert("Survival Soon™")
				// window.open("https://www.minecraft.net/en-us/store/minecraft-java-edition", "_blank")
				return
			}
			world = new World()
			world.id = "" + now + (Math.random() * 1000000 | 0)
			let name = boxCenterTop.value || "World"
			let number = ""
			let naming = true
			while(naming) {
				let match = false
				for (let id in worlds) {
					if (worlds[id].name === name + number) {
						match = true
						break
					}
				}
				if (match) {
					number = number ? number + 1 : 1
				}
				else {
					name = name + number
					naming = false
				}
			}
			world.name = name
			win.world = world
			world.loadChunks()
			world.chunkGenQueue.sort(sortChunks)
			changeScene("loading")
		})
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creationMenu", () => changeScene("back"))

		// LoadsaveMenu buttons
		const selected = () => !selectedWorld || !worlds[selectedWorld]
		let w4 = min(width / 4 - 10, 220)
		let x4 = w4 / 2 + 5
		let w2 = min(width / 2 - 10, 450)
		let x2 = w2 / 2 + 5
		let mid = width / 2
		Button.add(mid - 3 * x4, height - 30, w4, 40, "Edit", "loadsaveMenu", () => changeScene("editworld"), () => selected() || !worlds[selectedWorld].edited)
		Button.add(mid - x4, height - 30, w4, 40, "Delete", "loadsaveMenu", () => {
			const cloud = location.href.startsWith("https://willard.fun/") ? " This will also delete it from the cloud." : ""
			if (worlds[selectedWorld] && confirm(`Are you sure you want to delete ${worlds[selectedWorld].name}?${cloud}`)) {
				deleteFromDB(selectedWorld)
				win.worlds.removeChild(document.getElementById(selectedWorld))
				delete worlds[selectedWorld]
				if (cloud) fetch(`https://willard.fun/minekhan/saves/${selectedWorld}`, { method: "DELETE" })
				selectedWorld = 0
			}
		}, () => selected() || !worlds[selectedWorld].edited, "Delete the world forever.")
		Button.add(mid + x4, height - 30, w4, 40, "Export", "loadsaveMenu", () => {
			boxCenterTop.value = worlds[selectedWorld].code
		}, selected, "Export the save code into the text box above for copy/paste.")
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "loadsaveMenu", () => changeScene("mainMenu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "loadsaveMenu", async () => {
			world = new World(true)
			win.world = world

			let code
			if (!selectedWorld) {
				code = boxCenterTop.value
			}
			else {
				let data = worlds[selectedWorld]
				if (data) {
					world.id = data.id
					world.edited = data.edited
					if (data.code) code = data.code
					else {
						let cloudWorld = await fetch(`https://willard.fun/minekhan/saves/${selectedWorld}`).then(res => {
							if (res.headers.get("content-type") === "application/octet-stream") return res.arrayBuffer().then(a => new Uint8Array(a))
							else return res.text()
						})
						code = cloudWorld
					}
				}
			}

			if (code) {
				try {
					world.loadSave(code)
					world.id = world.id || "" + now + (Math.random() * 1000000 | 0)
				}
				catch(e) {
					alert("Unable to load save")
					return
				}
				changeScene("loading")
			}
		}, () => !(!selectedWorld && boxCenterTop.value) && !worlds[selectedWorld])
		Button.add(mid + x2, height - 75, w2, 40, "Create New World", "loadsaveMenu", () => changeScene("creationMenu"))

		Button.add(mid, height / 2, w2, 40, "Save", "editworld", () => {
			let w = worlds[selectedWorld]
			if (typeof w.code === "string") {
				// Legacy world saves
				w.name = boxCenterTop.value.replace(/;/g, "\u037e")
				let split = w.code.split(";")
				split[0] = w.name
				w.code = split.join(";")
			}
			else {
				let oldLength = w.name.length
				w.name = boxCenterTop.value.slice(0, 256) || w.name
				let newLength = w.name.length
				let newCode = new Uint8Array(w.code.length + newLength - oldLength)
				newCode[0] = newLength
				for (let i = 0; i < newLength; i++) newCode[i + 1] = w.name.charCodeAt(i) & 255
				let newIndex = newLength + 1
				let oldIndex = oldLength + 1
				while (newIndex < newCode.length) {
					newCode[newIndex++] = w.code[oldIndex++]
				}
				w.code = newCode
			}

			saveToDB(w.id, w).then(() => {
				initWorldsMenu()
				changeScene("loadsaveMenu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", () => changeScene("back"))

		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", () => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, () => !!multiplayer && !multiplayer.host, () => {
			const account = location.href.startsWith("https://willard.fun") ? " + account" : ""
			return `Save the world to your browser${account}. Doesn't work in incognito.\n\nLast saved ${timeString(now - world.edited)}.`
		})
		Button.add(width / 2, 375, 300, 40, "Get Save Code", "pause", () => {
			savebox.classList.remove("hidden")
			saveDirections.classList.remove("hidden")
			savebox.value = world.getSaveString()
		})
		Button.add(width / 2, 425, 300, 40, "Open World To Public", "pause", () => {
			initMultiplayer()
		}, () => !!multiplayer || !location.href.startsWith("https://willard.fun"))
		Button.add(width / 2, 475, 300, 40, "Exit Without Saving", "pause", () => {
			// savebox.value = world.getSaveString()
			if (multiplayer) {
				multiplayer.close()
			}
			initWorldsMenu()
			changeScene("mainMenu")
			world.unloadChunks()
			world = null
		})

		// Multiplayer buttons
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "multiplayerMenu", () => changeScene("mainMenu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "multiplayerMenu", () => {
			// world = new World()
			win.world = null

			if (selectedWorld) {
				initMultiplayer(selectedWorld)
			}
		}, () => !selectedWorld)

		// Options buttons
		const optionsBottom = height >= 550 ? 500 : height - 50
		// Button.add(width/2, 185, width / 3, 40, () => `Sort Inventory By: ${settings.inventorySort === "name" ? "Name" : "Block ID"}`, "options", () => {
		// 	if (settings.inventorySort === "name") {
		// 		settings.inventorySort = "blockid"
		// 	}
		// 	else if (settings.inventorySort === "blockid") {
		// 		settings.inventorySort = "name"
		// 	}
		// })

		// Settings Sliders
		Button.add(width / 2, optionsBottom - 60 * 5, width / 3, 40, "Controls", "options", () => changeScene("controls"))
		Slider.add(width/2, optionsBottom - 60 * 4, width / 3, 40, "options", "Render Distance", 1, 32, "renderDistance", val => settings.renderDistance = round(val))
		Slider.add(width/2, optionsBottom - 60 * 3, width / 3, 40, "options", "FOV", 30, 110, "fov", val => {
			p.FOV(val)
			if (world) {
				p.setDirection()
				world.render()
			}
		})
		Slider.add(width/2, optionsBottom - 60 * 2, width / 3, 40, "options", "Mouse Sensitivity", 30, 400, "mouseSense", val => settings.mouseSense = val)
		Slider.add(width/2, optionsBottom - 60, width / 3, 40, "options", "Reach", 5, 100, "reach", val => settings.reach = val)
		Button.add(width / 2, optionsBottom, width / 3, 40, "Back", "options", () => changeScene("back"))

		// Controls page
		Button.add(width / 2, 60, width / 3, 40, "Back", "controls", () => changeScene("back"))
		Button.add(width / 2, 60, width / 3, 40, "Back", "changelog", () => changeScene("back"))
	}

	clear() {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	home() {
		this.ctx.clearRect(0, 0, width, height)
		const title = "MINEKHAN"
		const subtext = "JAVASCRIPT EDITION"
		const font = "monospace"
		strokeWeight(1)
		this.ctx.textAlign = 'center'

		const scale = Math.min(width / 600, 1.5)
		for (let i = 0; i < 15; i++) {
			if (i < 12) {
				fill(i * 10)
			}
			else if (i > 11) {
				fill(125)
			}

			this.ctx.font = `bold ${80 * scale + i}px ${font}`
			text(title, width / 2, 158 - i)

			this.ctx.font = `bold ${32 * scale + i/4}px ${font}`
			text(subtext, width / 2, 140 + 60 * scale - i / 2)
		}
		fill(220)
		this.ctx.font = "20px monospace"
		this.ctx.textAlign = 'left'
		text("MineKhan " + version, width - (width - 2), height - 2)
	}

	play() {
		let renderStart = performance.now()
		p.setDirection()
		world.render()
		analytics.totalRenderTime += performance.now() - renderStart
	}

	loading() {
		const cx = p.x >> 4
		const cz = p.z >> 4

		let chunks = 0
		for (let x = cx - 1; x <= cx + 1; x++) {
			for (let z = cz - 1; z <= cz + 1; z++) {
				if (world.getChunk(x * 16, z * 16).buffer) chunks++
			}
		}
		if (chunks === 9) {
			play()
			if (p.y === 0 && !p.flying && !p.spectator) {
				p.y = world.getChunk(p.x|0, p.z|0).tops[(p.x & 15) * 16 + (p.z & 15)] + 2
			}
			return
		}
		else {
			world.tick()
		}

		const progress = round(100 * generatedChunks / 9)
		document.getElementById("loading-text").textContent = `Loading... ${progress}% complete (${generatedChunks} / 9)`
	}

	pause() {
		strokeWeight(1)
		this.clear()
	}

	options() {
		this.clear()
	}
	creationMenu() {
		clear()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Create New World", width / 2, 20)
	}
	loadsaveMenu() {
		clear()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Select World", width / 2, 20)
	}
	editworld() {
		this.game.renderer.dirt()
	}
	multiplayerMenu() {
		clear()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Select Server", width / 2, 20)
	}
	controls() {
		clear()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Controls", width / 2, 20)
	}
	changelog() {
		clear()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Change Log", width / 2, 20)
	}

	changeScene(newScene) {
		if (newScene === "play" || newScene === "mainMenu") scenePath = [newScene]
		else if (newScene === "back") {
			newScene = scenePath.pop()
		}
		else {
			scenePath.push(scene)
		}

		document.getElementById('background-text').classList.add('hidden')
		if (scene === "options") {
			saveToDB("settings", settings).catch(e => console.error(e))
		}

		if (html[scene] && html[scene].exit) {
			for (let element of html[scene].exit) {
				element.classList.add("hidden")
			}
		}

		if (html[newScene] && html[newScene].enter) {
			for (let element of html[newScene].enter) {
				element.classList.remove("hidden")
			}
		}

		if (html[newScene] && html[newScene].onenter) {
			html[newScene].onenter()
		}
		if (html[scene] && html[scene].onexit) {
			html[scene].onexit()
		}

		scene = newScene
		mouseDown = false
		drawScreens[scene]()
		Button.draw()
		Slider.draw()
	}
}

export { GUI }