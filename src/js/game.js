import { GUI } from "./gui"
import { saveToDB } from "./indexDB"
import { Player } from "./player"
import { Renderer } from "./renderer"
import { World } from "./world"

// setControl("dropItem", "Backspace")

const CONTROLS = {
	JUMP: 0,
	WALK_FORWARDS: 1,
	STRAFE_LEFT: 2,
	WALK_BACKWARDS: 3,
	STRAFE_RIGHT: 4,
	SPRINT: 5,
	OPEN_INVENTORY: 6,
	OPEN_CHAT: 7,
	PAUSE: 8,
	HYPER_BUILDER: 9,
	SUPER_BREAKER: 10,
	TOGGLE_SPECTATOR: 11,
	ZOOM: 12,
	SNEAK: 13,
	BREAK_BLOCK: 14,
	PLACE_BLOCK: 15,
	PICK_BLOCK: 16,
	CYCLE_DEBUG: 17
}

class Game {
	constructor() {
		this.edited = 0
		this.name = "World"
		this.id = "" + Date.now() + (Math.random() * 1000000 | 0).toString().padStart(5, '0')

		this.scene = "home"

		/** @type {World[]} */
		this.worlds = []

		/** @type {Player[]} */
		this.players = [] // For multiplayer
		this.renderer = new Renderer(this)
		this.player = new Player(this)
		this.gui = new GUI(this)

		this.settings = {}
		this.worldSettings = {
			superflat: false,
			trees: true,
			flowers: true,
			caves: true
		}
		this.keys = [] // Keys currently pressed... Maybe this belongs in GUI
		this.maxHeight = 255
		this.gravityStrength = -0.091

		this.controlMap = {}
		this.setControl("jump", "Space")
		this.setControl("walkForwards", "KeyW")
		this.setControl("strafeLeft", "KeyA")
		this.setControl("walkBackwards", "KeyS")
		this.setControl("strafeRight", "KeyD")
		this.setControl("sprint", "KeyQ")
		this.setControl("openInventory", "KeyE")
		this.setControl("openChat", "KeyT")
		this.setControl("pause", "KeyP")
		this.setControl("hyperBuilder", "KeyH")
		this.setControl("superBreaker", "KeyB")
		this.setControl("toggleSpectator", "KeyL")
		this.setControl("zoom", "KeyZ")
		this.setControl("sneak", "shift")
		this.setControl("breakBlock", "leftMouse")
		this.setControl("placeBlock", "rightMouse")
		this.setControl("pickBlock", "middleMouse")
		this.setControl("cycleDebug", "F3")
	}
	start(saveCode) {
		if (saveCode) this.load(saveCode)
		else {
			this.name = "World"
			this.id = "" + this.edited + (Math.random() * 1000000 | 0).toString().padStart(5, '0')
			this.worlds.push(new World(this))
		}
		this.generatedChunks = 0

		this.renderer.genIcons() // Generate all the block icons
		this.renderer.initDirt()

		this.gui.draw()

		this.player.FOV(this.settings.fov)
		inventory.size = Math.min(this.renderer.width, this.renderer.height) / 15 | 0
		inventory.init(true)
		initWorldsMenu().then(() => {
			initButtons()
			Button.draw()
			Slider.draw()
		})

		// See if a user followed a link here.
		var urlParams = new URLSearchParams(win.location.search)
		if (urlParams.has("target")) {
			changeScene("multiplayer menu")
			initMultiplayer(urlParams.get("target"))
		}

		if (win.tickid) win.clearInterval(win.tickid)
		win.tickid = setInterval(tickLoop, 50)
	}
	load(saveCode) {

	}
	async save() {
		this.edited = Date.now()
		let saveObj = {
			id: this.id,
			edited: this.edited,
			name: this.name,
			version: this.version,
			code: this.getSave()
		}
		await saveToDB(this.id, saveObj).catch(e => console.error(e))
		if (location.href.startsWith("https://willard.fun/")) {
			console.log('Saving to server')
			await fetch(`https://willard.fun/minekhan/saves?id=${world.id}&edited=${saveObj.edited}&name=${encodeURIComponent(this.name)}&version=${encodeURIComponent(version)}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream"
				},
				body: saveObj.code.buffer
			})
		}
	}

	setControl(name, key, shift = false, ctrl = false, alt = false) {
		const { controlMap, keys, settings } = this
		let override = Boolean(controlMap[name])
		if (override) {
			if (""+[name, key, shift, ctrl, alt] !== ""+settings.controls[name]) {
				settings.controls[name] = [name, key, shift, ctrl, alt]
				saveToDB("settings", settings).catch(e => console.error(e))
			}
			Object.assign(controlMap[name], { key, shift, ctrl, alt })
			controlMap[name].button.value = (ctrl ? "Ctrl + " : "") + (alt ? "Alt + " : "") + (shift ? "Shift + " : "") + key
		}
		else {
			let button = document.createElement("input")
			controlMap[name] = {
				key,
				shift,
				ctrl,
				alt,
				pressed: false,
				button,
				// Check to see if this control is newly triggered
				triggered() {
					let pressed = Boolean(keys[this.key]
						&& (!this.shift || keys.shift)
						&& (!this.ctrl || keys.ctrl)
						&& (!this.alt || keys.alt))
					if (pressed && !this.pressed) return this.pressed = true
					return false
				},
				released() {
					let pressed = Boolean(key[this.key]
						&& (!this.shift || key.shift)
						&& (!this.ctrl || key.ctrl)
						&& (!this.alt || key.alt))
					if (!pressed && this.pressed) {
						this.pressed = false
						return true
					}
					return false
				}
			}

			let tr = document.createElement("tr")
			let td = document.createElement("td")
			td.textContent = name
			tr.append(td)
			button.type = "button"
			button.value = (ctrl ? "Ctrl + " : "") + (alt ? "Alt + " : "") + (shift ? "Shift + " : "") + key
			button.onmousedown = event => {
				if (button.value === "          ") {
					event.stopPropagation()
					event.preventDefault()
					let buttonName = ["leftMouse", "middleMouse", "rightMouse"][event.button] || "mouse" + event.button
					console.log(event.button, event)
					this.setControl(name, buttonName, event.shiftKey, event.ctrlKey, event.altKey)
					button.value = (event.ctrlKey ? "Ctrl + " : "") + (event.altKey ? "Alt + " : "") + (event.shiftKey ? "Shift + " : "") + buttonName
				}
				else {
					button.value = "          "
				}
			}
			button.onkeydown = e => {
				e.preventDefault()
			}
			button.onkeyup = event => {
				if (button.value === "          ") {
					event.stopPropagation()
					event.preventDefault()
					if (event.code === "Escape") {
						button.value = (ctrl ? "Ctrl + " : "") + (alt ? "Alt + " : "") + (shift ? "Shift + " : "") + key
					}
					else {
						this.setControl(name, event.code, event.shiftKey, event.ctrlKey, event.altKey)
						button.value = (event.ctrlKey ? "Ctrl + " : "") + (event.altKey ? "Alt + " : "") + (event.shiftKey ? "Shift + " : "") + event.code
					}
				}
			}
			button.onblur = () => {
				if (settings.controls[name]) {
					[name, key, shift, ctrl, alt] = settings.controls[name]
				}
				if (button.value === "          ") {
					button.value = (ctrl ? "Ctrl + " : "") + (alt ? "Alt + " : "") + (shift ? "Shift + " : "") + key
				}
			}
			td = document.createElement("td")
			td.style.textAlign = "right"
			td.append(button)
			tr.append(td)
			tr.className = "control-row"
			document.getElementById('controls-page').append(tr)
		}
	}
}

const game = new Game()
export { Game, game, CONTROLS }