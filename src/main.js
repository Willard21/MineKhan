import './index.css'

// GLSL Shader code
import vertexShaderSrc3D from './shaders/blockVert.glsl'
import fragmentShaderSrc3D from './shaders/blockFrag.glsl'
import foglessVertexShaderSrc3D from './shaders/blockVertFogless.glsl'
import foglessFragmentShaderSrc3D from './shaders/blockFragFogless.glsl'
import vertexShaderSrc2D from './shaders/2dVert.glsl'
import fragmentShaderSrc2D from './shaders/2dFrag.glsl'
import vertexShaderSrcEntity from './shaders/entityVert.glsl'
import fragmentShaderSrcEntity from './shaders/entityFrag.glsl'

// Import WebWorker code
import workerCode from './workers/Caves.js'

// imports
import { seedHash, randomSeed, noiseProfile } from "./js/random.js"
import { PVector, Matrix, Plane, cross } from "./js/3Dutils.js"
import { timeString, roundBits, BitArrayBuilder, BitArrayReader } from "./js/utils.js"
import { blockData, BLOCK_COUNT, blockIds, BlockData } from "./js/blockData.js"
import { loadFromDB, saveToDB, deleteFromDB } from "./js/indexDB.js"
import { shapes, CUBE, SLAB, STAIR, FLIP, SOUTH, EAST, WEST } from "./js/shapes.js"
import { InventoryItem, inventory } from './js/inventory.js'
import { createProgramObject } from "./js/glUtils.js"
import { initTextures, textureMap, textureCoords, animateTextures } from './js/texture.js'
import { getSkybox } from './js/sky'
import { Chunk } from "./js/chunk.js"
// import { Item } from './js/item.js'
import { Player } from "./js/player.js"


const win = window.parent
async function MineKhan() {
	// cache global objects locally.
	const { Math, performance, Date, document, console } = window
	const { cos, sin, round, floor, ceil, min, max, abs, sqrt } = Math
	const chatOutput = document.getElementById("chat")
	const chatInput = document.getElementById("chatbar")
	let now = Date.now()

	win.blockData = blockData
	win.savebox = document.getElementById("savebox")
	win.boxCenterTop = document.getElementById("boxcentertop")
	win.saveDirections = document.getElementById("savedirections")
	win.message = document.getElementById("message")
	win.worlds = document.getElementById("worlds") // I have too many "worlds" variables. This one uses "win" as its namespace.
	win.quota = document.getElementById("quota")
	win.hoverbox = document.getElementById("onhover")
	win.controlMap = {}

	// Cache user-defined globals
	const { savebox, boxCenterTop, saveDirections, message, quota, hoverbox, loadString, controlMap } = win
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("overlay")
	canvas.width  = win.innerWidth
	canvas.height = win.innerHeight
	const ctx = canvas.getContext("2d")
	win.canvas = canvas

	// Shh don't tell anyone I'm overriding native objects
	String.prototype.hashCode = function() {
		var hash = 0, i, chr
		if (this.length === 0) return hash
		for (i = 0; i < this.length; i++) {
			chr   = this.charCodeAt(i)
			hash  = (hash << 5) - hash + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}
	Uint8Array.prototype.toString = function() {
		let str = ""
		for (let i = 0; i < this.length; i++) {
			str += String.fromCharCode(this[i])
		}
		return btoa(str)
	}

	let yieldThread
	{
		// await yieldThread() will pause the current task until the event loop is cleared
		const channel = new MessageChannel()
		let res
		channel.port1.onmessage = () => res()
		yieldThread = () => {
			return new Promise(resolve => {
				res = resolve
				channel.port2.postMessage("")
			})
		}
	}

	// Create Web Workers for generating caves. Stored in the window scope so Khan Academy won't generate a zillion workers.
	if (!win.workers) {
		const workerURL = URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" }))
		win.workers = []
		const jobQueue = []
		const workerCount = (navigator.hardwareConcurrency || 4) - 1 || 1
		for (let i = 0; i < workerCount; i++) { // Generate between 1 and (processors - 1) workers.
			let worker = new Worker(workerURL, { name: `Cave Worker ${i + 1}` })
			worker.onmessage = e => {
				if (worker.resolve) worker.resolve(e.data)
				worker.resolve = null
				if (jobQueue.length) {
					let [data, resolve] = jobQueue.shift()
					worker.resolve = resolve
					worker.postMessage(data)
				}
				else win.workers.push(worker)
			}
			win.workers.push(worker)
		}

		win.doWork = (data, resolve) => {
			if (win.workers.length) {
				let worker = win.workers.pop()
				worker.resolve = resolve
				worker.postMessage(data)
			}
			else jobQueue.push([data, resolve])
		}
	}

	let world, worldSeed

	function setSeed(seed) {
		worldSeed = seed
		seedHash(seed)
		noiseProfile.noiseSeed(seed)
		while(win.workers.length) {
			win.doWork({ seed })
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
	// function line(x1, y1, x2, y2) {
	// 	ctx.moveTo(x1, y1)
	// 	ctx.lineTo(x2, y2)
	// }
	function text(txt, x, y, h) {
		h = h || 0

		let lines = txt.split("\n")
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + h * i)
		}
	}
	function textSize(size) {
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
	randomSeed(Math.random() * 10000000 | 0)

	async function save() {
		let saveObj = {
			id: world.id,
			edited: now,
			name: world.name,
			version: version,
			code: world.getSaveString()
		}
		await saveToDB(world.id, saveObj).catch(e => console.error(e))
		world.edited = now
		if (location.href.startsWith("https://willard.fun/")) {
			console.log('Saving to server')
			await fetch(`https://willard.fun/minekhan/saves?id=${world.id}&edited=${saveObj.edited}&name=${encodeURIComponent(world.name)}&version=${encodeURIComponent(version)}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream"
				},
				body: saveObj.code.buffer
			})
		}
	}

	// Globals
	let version = "Alpha 0.8.1"
	let superflat = false
	let details = true
	let caves = true

	win.blockData = blockData
	win.blockIds = blockIds

	// Configurable and savable settings
	let settings = {
		renderDistance: 4,
		fov: 70, // Field of view in degrees
		mouseSense: 100, // Mouse sensitivity as a percentage of the default
		reach: 5,
		showDebug: 3,
		// inventorySort: "blockid"
	}
	let generatedChunks
	let mouseX, mouseY, mouseDown
	let width = win.innerWidth
	let height = win.innerHeight

	if (height === 400) alert("Canvas is too small. Click the \"Settings\" button to the left of the \"Vote Up\" button under the editor and change the height to 600.")

	let maxHeight = 255

	// const ROTATION = 0x1800 // Mask for the direction bits
	let background = "url(./background.webp)"
	if (location.origin === "https://www.kasandbox.org") background = "url(https://www.khanacademy.org/computer-programming/minekhan/5647155001376768/5308848032661504.png)"
	else if (!location.origin.includes("localhost") && location.origin !== "file://") background = "url(https://willard.fun/minekhan/background.webp)"
	canvas.style.backgroundImage = background

	let dirtBuffer
	let texCoordsBuffers
	let bigArray = win.bigArray || new Float32Array(1000000)
	win.bigArray = bigArray

	// Callback functions for all the screens; will define them further down the page
	let drawScreens = {
		"main menu": () => {},
		"options": () => {},
		"play": () => {},
		"pause": () => {},
		"creation menu": () => {},
		"inventory": () => {},
		"multiplayer menu": () => {},
		"comingsoon menu": () => {},
		"loadsave menu": () => {},
		"chat": () => {}
	}
	let html = {
		play: {
			enter: [document.getElementById("hotbar")],
			exit: [document.getElementById("hotbar")]
		},
		pause: {
			enter: [win.message],
			exit: [win.savebox, win.saveDirections, win.message]
		},
		"main menu": {
			onenter: () => {
				canvas.style.backgroundImage = background
			},
			onexit: () => {
				canvas.style.backgroundImage = ""
				dirt()
			}
		},
		"loadsave menu": {
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
		"creation menu": {
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
		"multiplayer menu": {
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
		}
	}

	let screen = "main menu"
	let previousScreen = screen
	function changeScene(newScene) {
		document.getElementById('background-text').classList.add('hidden')
		if (screen === "options") {
			saveToDB("settings", settings).catch(e => console.error(e))
		}

		if (html[screen] && html[screen].exit) {
			for (let element of html[screen].exit) {
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
		if (html[screen] && html[screen].onexit) {
			html[screen].onexit()
		}

		previousScreen = screen
		screen = newScene
		mouseDown = false
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}
	let hitBox = {}
	let holding = 0
	let Key = {}
	let modelView = win.modelView || new Float32Array(16)
	win.modelView = modelView
	let glCache
	let worlds, selectedWorld = 0
	let freezeFrame = 0
	let p
	let vec1 = new PVector(), vec2 = new PVector(), vec3 = new PVector()
	let move = {
		x: 0,
		y: 0,
		z: 0,
		ang: Math.sqrt(0.5),
	}
	let p2 = {
		x: 0,
		y: 0,
		z: 0,
	}

	function setControl(name, key, shift = false, ctrl = false, alt = false) {
		controlMap[name] = {
			key,
			shift,
			ctrl,
			alt,
			get pressed() {
				return Boolean(Key[this.key]
					&& (!this.shift || Key.ShiftLeft || Key.ShiftRight)
					&& (!this.ctrl || Key.ControlLeft || Key.ControlRight)
					&& (!this.alt || Key.AltLeft || Key.AltRight))
			},
			// Check to see if all of an event's data matches this key map
			event(e) {
				return Boolean(e.code === this.key
					&& (!this.shift || e.shiftKey)
					&& (!this.ctrl || e.ctrlKey)
					&& (!this.alt || e.altKey))
			}
		}
	}
	setControl("jump", "Space")
	setControl("walkForwards", "KeyW")
	setControl("strafeLeft", "KeyA")
	setControl("walkBackwards", "KeyS")
	setControl("strafeRight", "KeyD")
	setControl("sprint", "KeyQ")
	setControl("openInventory", "KeyE")
	setControl("openChat", "KeyT")
	setControl("pause", "KeyP")
	setControl("hyperBuilder", "KeyH")
	setControl("superBreaker", "KeyB")
	setControl("toggleSpectator", "KeyL")
	setControl("zoom", "KeyZ")
	setControl("sneak", "ShiftLeft")
	setControl("dropItem", "Backspace")
	setControl("breakBlock", "leftMouse")
	setControl("placeBlock", "rightMouse")
	setControl("pickBlock", "middleMouse")
	//}

	function play() {
		canvas.onblur()
		p.lastBreak = now
		holding = inventory.hotbar.hand.id
		use3d()
		getPointer()
		fill(255, 255, 255)
		textSize(20)
		canvas.focus()
		changeScene("play")
		ctx.clearRect(0, 0, width, height)
		crosshair()
		hud(true)
		inventory.hotbar.render()
		hotbar()
	}

	/**
	 * @type {WebGLRenderingContext}*/
	let gl
	/**
	 * @type {{vertex_array_object: OES_vertex_array_object}}*/
	let glExtensions

	/**
	 * @type {(time: Number, view: Matrix) => {}}
	 */
	let skybox

	function getPointer() {
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock()
		}
	}
	function releasePointer() {
		if (document.exitPointerLock) {
			document.exitPointerLock()
		}
	}

	let program3D, program2D, programEntity, program3DFogless

	win.shapes = shapes

	function initShapes() {

		// Create buffers for the hitbox outline shapes
		for (let shape in shapes) {
			let obj = shapes[shape]
			obj.buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.verts.flat(2)), gl.STATIC_DRAW)
			for (let i in obj.variants) {
				let v = obj.variants[i]
				v.buffer = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v.verts.flat(2)), gl.STATIC_DRAW)
			}
		}

		// Create blockData for each of the block variants
		for (let id = 1; id < BLOCK_COUNT; id++) {
			let baseBlock = blockData[id]
			if (baseBlock.shape === shapes.door) baseBlock.rotate = true

			if (!baseBlock.uniqueShape) {
				const slabBlock = new BlockData(baseBlock, id | SLAB, true)
				slabBlock.transparent = true
				slabBlock.name += " Slab"
				slabBlock.shape = shapes.slab
				slabBlock.flip = true
				blockData[id | SLAB] = slabBlock
				let v = slabBlock.shape.variants
				for (let j = 1; j < v.length; j++) {
					if (v[j]) {
						let block = new BlockData(slabBlock, id | SLAB | j << 10, false)
						block.shape = v[j]
						blockData[id | SLAB | j << 10] = block
					}
				}

				const stairBlock = new BlockData(baseBlock, id | STAIR, true)
				stairBlock.transparent = true
				stairBlock.name += " Stairs"
				stairBlock.shape = shapes.stair
				stairBlock.rotate = true
				stairBlock.flip = true
				blockData[id | STAIR] = stairBlock
				v = stairBlock.shape.variants
				for (let j = 1; j < v.length; j++) {
					if (v[j]) {
						let block = new BlockData(stairBlock, id | STAIR | j << 10, false)
						block.shape = v[j]
						blockData[id | STAIR | j << 10] = block
					}
				}
			}

			// Cubes; blocks like pumpkins and furnaces.
			if (baseBlock.rotate) {
				const [ny, py, pz, nz, px, nx] = baseBlock.textures
				const orders = [
					[ny, py, nz, pz, nx, px], // Opposite
					[ny, py, nx, px, pz, nz],
					[ny, py, px, nx, nz, pz],
				]
				const v = baseBlock.shape.variants
				for (let j = 2; j < v.length; j += 2) {
					if (v[j]) {
						let block = new BlockData(baseBlock, id | j << 10, false)
						block.shape = v[j]
						block.textures = orders[j / 2 - 1]
						blockData[id | j << 10] = block
					}
				}
			}
		}
	}
	let indexOrder = new Uint32Array(bigArray.length / 6 | 0)
	for (let i = 0, j = 0; i < indexOrder.length; i += 6, j += 4) {
		indexOrder[i + 0] = 0 + j
		indexOrder[i + 1] = 1 + j
		indexOrder[i + 2] = 2 + j
		indexOrder[i + 3] = 0 + j
		indexOrder[i + 4] = 2 + j
		indexOrder[i + 5] = 3 + j
	}

	function genIcons() {
		let start = Date.now()

		let shadows = [1, 1, 0.4, 0.4, 0.7, 0.7]

		use2d()
		gl.uniform1i(glCache.uSampler2, 0)

		const limitX = gl.canvas.width >> 6
		const limitY = gl.canvas.height >> 6
		const limit = limitX * limitY
		const total = (BLOCK_COUNT - 1) * 3
		const pages = Math.ceil(total / limit)

		let masks = [CUBE, SLAB, STAIR]
		let drawn = 1 // 0 = air

		const mat = new Matrix()
		mat.identity()
		mat.scale(70 / width, 70 / height, 1)
		mat.rotX(Math.PI / 4)
		mat.rotY(Math.PI / 4)

		mat.transpose()
		gl.uniformMatrix4fv(gl.getUniformLocation(program2D, "uView"), false, mat.elements)

		// Draw as many icons as possible on a canvas the size of the screen, then clear it and continue
		for (let i = 0; i < pages; i++) {

			// Draw icons to the WebGL canvas
			let blocksPerPage = (limit / 3 | 0) * 3
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			let pageStart = drawn
			for (let j = 0; j < blocksPerPage; j += 3) {
				for (let k = 0; k < 3; k++) {
					const id = drawn | masks[k]
					if (blockData[id]?.iconImg) {
						const x = ((j + k) % limitX * 128 + 64) / width - 1
						const y = 1 - (((j + k) / limitX | 0) * 128 + 64) / height

						gl.uniform2f(glCache.uOffset, x, y)

						const shape = blockData[id].shape === shapes.fence ? shapes.fence.variants[3] : blockData[id].shape
						// if (blockData[id].shape === shapes.fence) {
						// Coordinates
						gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer)
						gl.vertexAttribPointer(glCache.aVertex2, 3, gl.FLOAT, false, 12, 0)

						// Textures
						const texture = []
						const shade = []
						new Float32Array(shape.texVerts.flat(3))
						for (let i = 0; i < shape.texVerts.length; i++) { // Direction index
							for (let j = 0; j < shape.texVerts[i].length; j++) { // Face index for the direction
								for (let k = 0; k < 8; k++) { // x,y pairs of the 4 corners
									texture.push(shape.texVerts[i][j][k] + blockData[id].textures[i][k & 1])
								}
								shade.push(shadows[i], shadows[i], shadows[i], shadows[i])
							}
						}
						const texBuffer = gl.createBuffer()
						gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
						gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW)
						gl.vertexAttribPointer(glCache.aTexture2, 2, gl.FLOAT, false, 8, 0)

						// Shading
						const shadeBuffer = gl.createBuffer()
						gl.bindBuffer(gl.ARRAY_BUFFER, shadeBuffer)
						gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shade), gl.STATIC_DRAW)
						gl.vertexAttribPointer(glCache.aShadow2, 1, gl.FLOAT, false, 4, 0)

						if (shape === shapes.lantern || shape === shapes.flower) {
							mat.transpose()
							mat.scale(2)
							mat.transpose()
							gl.uniformMatrix4fv(gl.getUniformLocation(program2D, "uView"), false, mat.elements)
						}

						// Index buffer and draw
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
						gl.drawElements(gl.TRIANGLES, 6 * shade.length / 4, gl.UNSIGNED_INT, 0)

						// Free GPU memory
						gl.deleteBuffer(shadeBuffer)
						gl.deleteBuffer(texBuffer)

						if (shape === shapes.lantern || shape === shapes.flower) {
							mat.transpose()
							mat.scale(1/2)
							mat.transpose()
							gl.uniformMatrix4fv(gl.getUniformLocation(program2D, "uView"), false, mat.elements)
						}
					}
				}
				drawn++
				if (drawn === BLOCK_COUNT) {
					blocksPerPage = j + 3
					break
				}
			}

			// WebGL canvas is full, now copy it onto the 2D canvas
			ctx.clearRect(0, 0, width, height)
			ctx.drawImage(gl.canvas, 0, 0)

			// Now copy all the icons from the big 2D canvas to the little icon canvases
			for (let j = 0; j < blocksPerPage; j += 3) {
				for (let k = 0; k < 3; k++) {
					let id = pageStart + j/3 | masks[k]

					if (blockData[id]?.iconImg) {
						const x = (j + k) % limitX
						const y = (j + k) / limitX | 0
						const c = blockData[id].iconImg.getContext("2d")
						c.drawImage(ctx.canvas, x * 64, y * 64, 64, 64, 0, 0, 64, 64)
					}
				}
			}
		}
		console.log("Block icons drawn and extracted in:", Date.now() - start, "ms")
	}

	//Generate buffers for every block face and store them
	let sideEdgeBuffers
	let indexBuffer

	let matrix = new Float32Array(16) // A temperary matrix that may store random data.

	let defaultTransformation = new Matrix([-10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1])
	class Camera {
		constructor() {
			this.x = 0
			this.y = 0
			this.z = 0
			this.px = 0
			this.py = 0
			this.pz = 0

			this.rx = 0 // Pitch
			this.ry = 0 // Yaw
			this.prx = 0 // Pitch
			this.pry = 0 // Yaw

			this.currentFov = 0
			this.defaultFov = settings.fov
			this.targetFov = settings.fov
			this.step = 0
			this.lastStep = 0
			this.projection = new Float32Array(5)
			this.transformation = new Matrix()
			this.direction = { x: 1, y: 0, z: 0 } // Normalized direction vector
			this.frustum = [] // The 5 planes of the viewing frustum (there's no far plane)
			for (let i = 0; i < 5; i++) {
				this.frustum.push(new Plane(1, 0, 0))
			}
		}
		FOV(fov, time) {
			if (fov === this.currentFov) return

			if (!fov) {
				fov = this.currentFov + this.step * (now - this.lastStep)
				this.lastStep = now
				if (Math.sign(this.targetFov - this.currentFov) !== Math.sign(this.targetFov - fov)) {
					fov = this.targetFov
				}
			}
			else if (time) {
				this.targetFov = fov
				this.step = (fov - this.currentFov) / time
				this.lastStep = now
				return
			}
			else {
				this.targetFov = fov
			}

			const tang = Math.tan(fov * Math.PI / 360)
			const scale = 1 / tang
			const near = 1
			const far = 1000000
			this.currentFov = fov // Store the state of the projection matrix
			this.nearH = near * tang // This is needed for frustum culling

			this.projection[0] = scale / width * height
			this.projection[1] = scale
			this.projection[2] = -far / (far - near)
			this.projection[3] = -1
			this.projection[4] = -far * near / (far - near)
		}
		transform() {
			let diff = (performance.now() - this.lastUpdate) / 50
			if (diff > 1 || isNaN(diff)) diff = 1
			let x = (this.x - this.px) * diff + this.px
			let y = (this.y - this.py) * diff + this.py
			let z = (this.z - this.pz) * diff + this.pz
			this.transformation.copyMatrix(defaultTransformation)
			if (this.rx) this.transformation.rotX(this.rx)
			if (this.ry) this.transformation.rotY(this.ry)
			this.transformation.translate(-x, -y, -z)
		}
		getMatrix() {
			let proj = this.projection
			let view = this.transformation.elements
			matrix[0]  = proj[0] * view[0]
			matrix[1]  = proj[1] * view[4]
			matrix[2]  = proj[2] * view[8] + proj[3] * view[12]
			matrix[3]  = proj[4] * view[8]
			matrix[4]  = proj[0] * view[1]
			matrix[5]  = proj[1] * view[5]
			matrix[6]  = proj[2] * view[9] + proj[3] * view[13]
			matrix[7]  = proj[4] * view[9]
			matrix[8]  = proj[0] * view[2]
			matrix[9]  = proj[1] * view[6]
			matrix[10] = proj[2] * view[10] + proj[3] * view[14]
			matrix[11] = proj[4] * view[10]
			matrix[12] = proj[0] * view[3]
			matrix[13] = proj[1] * view[7]
			matrix[14] = proj[2] * view[11] + proj[3] * view[15]
			matrix[15] = proj[4] * view[11]
			return matrix
		}
		setDirection() {
			if (this.targetFov !== this.currentFov) {
				this.FOV()
			}
			this.direction.x = -sin(this.ry) * cos(this.rx)
			this.direction.y = sin(this.rx)
			this.direction.z = cos(this.ry) * cos(this.rx)
			this.computeFrustum()
		}
		computeFrustum() {
			let X = vec1
			let dir = this.direction
			X.x = dir.z
			X.y = 0
			X.z = -dir.x
			X.normalize()

			let Y = vec2
			Y.set(dir)
			Y.mult(-1)
			cross(Y, X, Y)

			// Near plane
			this.frustum[0].set(dir.x, dir.y, dir.z)

			let aux = vec3
			aux.set(Y)
			aux.mult(this.nearH)
			aux.add(dir)
			aux.normalize()
			cross(aux, X, aux)
			this.frustum[1].set(aux.x, aux.y, aux.z)

			aux.set(Y)
			aux.mult(-this.nearH)
			aux.add(dir)
			aux.normalize()
			cross(X, aux, aux)
			this.frustum[2].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(-this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			cross(aux, Y, aux)
			this.frustum[3].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			cross(Y, aux, aux)
			this.frustum[4].set(aux.x, aux.y, aux.z)
		}
		canSee(x, y, z, maxY) {
			// If it's inside the viewing frustum
			x -= 0.5
			y -= 0.5
			z -= 0.5
			maxY += 0.5

			// Player's position is only updated once per tick (20 TPS), but the camera is interpolated between ticks.
			// Add the velocity here to make sure the chunks don't become invisible in those interpolated areas.
			let cx = p.x - p.velocity.x, cy = p.y - p.velocity.y, cz = p.z - p.velocity.z
			for (let i = 0; i < 5; i++) {
				let plane = this.frustum[i]
				let px = x + plane.dx
				let py = plane.dy ? maxY : y
				let pz = z + plane.dz
				if ((px - cx) * plane.nx + (py - cy) * plane.ny + (pz - cz) * plane.nz < 0) {
					return false
				}
			}

			return true

			// If it's within the range of the fog
			// const dx = x - this.x
			// const dy = this.y < maxY ? 0 : maxY - this.y
			// const dz = z - this.z
			// const d = settings.renderDistance * 16 + 24
			// return dx * dx + dy * dy + dz * dz < d * d
		}
	}



	// function FOV(fov) {
	// 	let tang = Math.tan(fov * 0.5 * Math.PI / 180)
	// 	let scale = 1 / tang
	// 	let near = 1
	// 	let far = 1000000

	// 	projection[0] = scale / width * height
	// 	projection[5] = scale
	// 	projection[10] = -far / (far - near)
	// 	projection[11] = -1
	// 	projection[14] = -far * near / (far - near)
	// }

	function initModelView(camera) {
		if (camera) {
			// Inside the game
			camera.transform()
			camera.getMatrix()

			gl.useProgram(program3DFogless)
			gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)

			gl.useProgram(program3D)
			gl.uniformMatrix4fv(glCache.uView, false, matrix)
		}
	}

	function rayTrace(x, y, z, shape) {
		let cf, cd = 1e9 // Closest face and distance
		let m // Absolute distance to intersection point
		let ix, iy, iz // Intersection coords
		let minX, minY, minZ, maxX, maxY, maxZ, min, max //Bounds of face coordinates
		let east = p.direction.x < 0
		let top = p.direction.y < 0
		let north = p.direction.z < 0
		let verts = shape.verts
		let faces = verts[0]

		// Top and bottom faces

		if (top) {
			faces = verts[1]
		}
		if (p.direction.y) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				m = (y + face[1] - p.y) / p.direction.y
				ix = m * p.direction.x + p.x
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iz >= z + minZ && iz <= z + maxZ) {
					cd = m // Ray crosses bottom face
					cf = top ? "top" : "bottom"
				}
			}
		}

		// West and East faces
		if (east) {
			faces = verts[4]
		}
		else {
			faces = verts[5]
		}
		if (p.direction.x) {
			for (let face of faces) {
				min = face.min
				minY = min[1]
				minZ = min[2]
				max = face.max
				maxY = max[1]
				maxZ = max[2]
				m = (x + face[0] - p.x) / p.direction.x
				iy = m * p.direction.y + p.y
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && iy >= y + minY && iy <= y + maxY && iz >= z + minZ && iz <= z + maxZ) {
					cd = m
					cf = east ? "east" : "west"
				}
			}
		}

		// South and North faces
		if (north) {
			faces = verts[2]
		}
		else {
			faces = verts[3]
		}
		if (p.direction.z) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				m = (z + face[2] - p.z) / p.direction.z
				ix = m * p.direction.x + p.x
				iy = m * p.direction.y + p.y
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iy >= y + minY && iy <= y + maxY) {
					cd = m
					cf = north ? "north" : "south"
				}
			}
		}
		return [cd, cf]
	}
	function runRayTrace(x, y, z) {
		let block = world.getBlock(x, y, z)
		if (block) {
			let rt = rayTrace(x, y, z, blockData[block].shape)

			if (rt[1] && rt[0] < hitBox.closest) {
				hitBox.closest = rt[0]
				hitBox.face = rt[1]
				hitBox.pos = [x, y, z]
				hitBox.shape = blockData[block].shape
			}
		}
	}
	function lookingAt() {
		// Checks blocks in front of the player to see which one they're looking at
		hitBox.pos = null
		hitBox.closest = 1e9

		if (p.spectator) {
			return
		}
		let blockState = world.getBlock(p2.x, p2.y, p2.z)
		if (blockState) {
			hitBox.pos = [p2.x, p2.y, p2.z]
			hitBox.closest = 0
			hitBox.shape = blockData[blockState].shape
			return
		}

		let pd = p.direction

		let minX = p2.x
		let maxX = 0
		let minY = p2.y
		let maxY = 0
		let minZ = p2.z
		let maxZ = 0

		for (let i = 0; i < settings.reach + 1; i++) {
			if (i > settings.reach) {
				i = settings.reach
			}
			maxX = round(p.x + pd.x * i)
			maxY = round(p.y + pd.y * i)
			maxZ = round(p.z + pd.z * i)
			if (maxX === minX && maxY === minY && maxZ === minZ) {
				continue
			}
			if (minX !== maxX) {
				if (minY !== maxY) {
					if (minZ !== maxZ) {
						runRayTrace(maxX, maxY, maxZ)
					}
					runRayTrace(maxX, maxY, minZ)
				}
				if (minZ !== maxZ) {
					runRayTrace(maxX, minY, maxZ)
				}
				runRayTrace(maxX, minY, minZ)
			}
			if (minY !== maxY) {
				if (minZ !== maxZ) {
					runRayTrace(minX, maxY, maxZ)
				}
				runRayTrace(minX, maxY, minZ)
			}
			if (minZ !== maxZ) {
				runRayTrace(minX, minY, maxZ)
			}
			if (hitBox.pos) {
				return // The ray has collided; it can't possibly find a closer collision now
			}
			minZ = maxZ
			minY = maxY
			minX = maxX
		}
	}
	let inBox = function(x, y, z, w, h, d) {
		let iy = roundBits(y - h/2 - p.topH)
		let ih = roundBits(h + p.bottomH + p.topH)
		let ix = x - w/2 - p.w
		let iw = w + p.w*2
		let iz = z - d/2 - p.w
		let id = d + p.w*2
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y < roundBits(iy + ih) && p.z < iz + id
	}
	let onBox = function(x, y, z, w, h, d) {
		let iy = roundBits(y - h/2 - p.topH)
		let ih = roundBits(h + p.bottomH + p.topH)
		let ix = roundBits(x - w/2 - p.w)
		let iw = roundBits(w + p.w*2)
		let iz = roundBits(z - d/2 - p.w)
		let id = roundBits(d + p.w*2)
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y <= iy + ih && p.z < iz + id
	}
	function collided(x, y, z, vx, vy, vz, block) {
		if(p.spectator && block !== blockIds.bedrock) {
			return false
		}
		let verts = blockData[block].shape.verts
		let px = roundBits(p.x - p.w - x)
		let py = roundBits(p.y - p.bottomH - y)
		let pz = roundBits(p.z - p.w - z)
		let pxx = roundBits(p.x + p.w - x)
		let pyy = roundBits(p.y + p.topH - y)
		let pzz = roundBits(p.z + p.w - z)
		let minX, minY, minZ, maxX, maxY, maxZ, min, max

		// Top and bottom faces
		let faces = verts[0]
		if (vy <= 0) {
			faces = verts[1]
		}
		if (!vx && !vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				if (face[1] > py && face[1] < pyy && minX < pxx && maxX > px && minZ < pzz && maxZ > pz) {
					col = true
					if (vy <= 0) {
						p.onGround = true
						p.y = round((face[1] + y + p.bottomH) * 10000) / 10000
						p.velocity.y = 0
					}
					else {
						p.y = face[1] + y - p.topH - 0.01
					}
				}
			}
			return col
		}

		// West and East faces
		if (vx < 0) {
			faces = verts[4]
		}
		else if (vx > 0) {
			faces = verts[5]
		}
		if (vx) {
			let col = false
			for (let face of faces) {
				min = face.min
				minZ = min[2]
				minY = min[1]
				max = face.max
				maxZ = max[2]
				maxY = max[1]
				if (face[0] > px && face[0] < pxx && minY < pyy && maxY > py && minZ < pzz && maxZ > pz) {
					if (maxY - py > 0.5 || !p.onGround) {
						p.canStepX = false
						p.x = x + face[0] + (vx < 0 ? p.w : -p.w) * 1.001
					}
					col = true
				}
			}
			return col
		}

		// South and North faces
		if (vz < 0) {
			faces = verts[2]
		}
		else if (vz > 0) {
			faces = verts[3]
		}
		if (vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				if (face[2] > pz && face[2] < pzz && minY < pyy && maxY > py && minX < pxx && maxX > px) {
					if (maxY - py > 0.5 || !p.onGround) {
						p.canStepZ = false
						p.z = z + face[2] + (vz < 0 ? p.w : -p.w) * 1.001
					}
					col = true
				}
			}
			return col
		}
		throw "Test"
	}
	let contacts = {
		array: [],
		size: 0,
		add: function(x, y, z, block) {
			if (this.size === this.array.length) {
				this.array.push([x, y, z, block])
			}
			else {
				this.array[this.size][0] = x
				this.array[this.size][1] = y
				this.array[this.size][2] = z
				this.array[this.size][3] = block
			}
			this.size++
		},
		clear: function() {
			this.size = 0
		},
	}
	let resolveContactsAndUpdatePosition = function() {
		if (p.y < 0) p.y = 70
		let mag = p.velocity.mag()
		let steps = Math.ceil(mag / p.w)
		const VX = p.velocity.x / steps
		const VY = p.velocity.y / steps
		const VZ = p.velocity.z / steps

		let pminX = floor(0.5 + p.x - p.w + (p.velocity.x < 0 ? p.velocity.x : 0))
		let pmaxX = ceil(-0.5 + p.x + p.w + (p.velocity.x > 0 ? p.velocity.x : 0))
		let pminY = max(floor(0.5 + p.y - p.bottomH + (p.velocity.y < 0 ? p.velocity.y : 0)), 0)
		let pmaxY = min(ceil(-0.5 + p.y + p.topH + (p.velocity.y > 0 ? p.velocity.y : 0)), maxHeight)
		let pminZ = floor(0.5 + p.z - p.w + (p.velocity.z < 0 ? p.velocity.z : 0))
		let pmaxZ = ceil(-0.5 + p.z + p.w + (p.velocity.z > 0 ? p.velocity.z : 0))

		for (let y = pmaxY; y >= pminY; y--) {
			for (let x = pminX; x <= pmaxX; x++) {
				for (let z = pminZ; z <= pmaxZ; z++) {
					let block = world.getBlock(x, y, z)
					if (blockData[block].solid) {
						contacts.add(x, y, z, block)
					}
				}
			}
		}

		// let hasCollided = false
		p.px = p.x
		p.py = p.y
		p.pz = p.z
		for (let j = 1; j <= steps; j++) {
			let px = p.x
			let pz = p.z

			// Check collisions in the Y direction
			p.onGround = false
			p.canStepX = false
			p.canStepZ = false
			p.y += VY
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, 0, VY, 0, block)) {
					p.velocity.y = 0
					// hasCollided = true
					// It doesn't matter that it checked the top blocks first.
					// Slabs are technically level with cubes, but they're shorter.
					// So if it checks a slab before checking a cube, exiting early
					// could prevent the player from colliding with the cube.
					// break <-- In other words, don't do this.
				}
			}

			// Stepping works by letting you walk inside short hitboxes that you collide with in the x or z directions.
			// Since collisions in the Y direction are checked first, you won't step until the next frame.
			if (p.onGround) {
				p.canStepX = true
				p.canStepZ = true
			}

			var sneakLock = false, sneakSafe = false
			if (p.sneaking) {
				for (let i = 0; i < contacts.size; i++) {
					let [x, y, z] = contacts.array[i]
					if (onBox(x, y, z, 1, 1, 1)) {
						sneakLock = true
						break
					}
				}
			}

			// Check collisions in the X direction
			p.x += VX
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, VX, 0, 0, block)) {
					if (p.canStepX && !world.getBlock(x, y + 1, z) && !world.getBlock(x, y + 2, z)) {
						continue
					}
					if (p.canStepX) p.x -= VX // Wasn't handled in `collided` since it thought it could step.
					p.velocity.x = 0
					// hasCollided = true
					break
				}
				if (sneakLock && onBox(x, y, z, 1, 1, 1)) {
					sneakSafe = true
				}
			}

			if (sneakLock && !sneakSafe) {
				p.x = px
				p.velocity.x = 0
				// hasCollided = true
			}
			sneakSafe = false

			// Check collisions in the Z direction
			p.z += VZ
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, 0, 0, VZ, block)) {
					if (p.canStepZ && !world.getBlock(x, y + 1, z) && !world.getBlock(x, y + 2, z)) {
						continue
					}
					// p.z = p.pz
					if (p.canStepZ) p.z -= VZ // Wasn't handled in `collided` since it thought it could step.
					p.velocity.z = 0
					// hasCollided = true
					break
				}
				if (sneakLock && onBox(x, y, z, 1, 1, 1)) {
					sneakSafe = true
				}
			}

			if (sneakLock && !sneakSafe) {
				p.z = pz
				p.velocity.z = 0
				// hasCollided = true
			}
		}


		if (!p.flying) {
			let drag = p.onGround ? 0.5 : 0.85
			p.velocity.z += p.velocity.z * drag - p.velocity.z
			p.velocity.x += p.velocity.x * drag - p.velocity.x
		}
		else {
			let drag = 0.9
			if (!controlMap.walkForwards.pressed && !controlMap.walkBackwards.pressed && !controlMap.strafeLeft.pressed && !controlMap.strafeRight.pressed) drag = 0.7
			p.velocity.z += p.velocity.z * drag - p.velocity.z
			p.velocity.x += p.velocity.x * drag - p.velocity.x
			p.velocity.y += p.velocity.y * 0.7 - p.velocity.y
			if (p.onGround && !p.spectator) {
				p.flying = false
			}
		}

		p.lastUpdate = performance.now()
		contacts.clear()
		lookingAt()
	}
	let runGravity = function() {
		if (p.flying) {
			return
		}

		p.velocity.y += p.gravityStrength
		if(p.velocity.y < -p.maxYVelocity) {
			p.velocity.y = -p.maxYVelocity
		}
		if(p.onGround) {
			if(controlMap.jump.pressed) {
				p.velocity.y = p.jumpSpeed
				p.onGround = false
			}
		}
	}

	function drawHitbox(camera) {
		// Get the transformation matrix in position
		const [x, y, z] = hitBox.pos
		camera.transformation.translate(x, y, z)
		camera.getMatrix()
		gl.useProgram(program3DFogless)
		gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)
		camera.transformation.translate(-x, -y, -z)

		// Bind texture buffer with black texture
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffers[textureMap.hitbox])
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 0, 0)

		// Bind vertex buffer with the shape of the targeted block
		gl.bindBuffer(gl.ARRAY_BUFFER, hitBox.shape.buffer)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 0, 0)

		// Draw them 1 face at a time to avoid drawing triangles
		for (let i = 0; i < hitBox.shape.size; i++) {
			gl.drawArrays(gl.LINE_LOOP, i * 4, 4)
		}
	}

	function changeWorldBlock(t) {
		let pos = hitBox.pos
		if(pos && pos[1] > 0 && pos[1] < maxHeight) {
			const data = blockData[t]
			let shape = t && data.shape
			if (t && data.rotate) {
				let pi = Math.PI / 4
				if (p.ry <= pi || p.ry >= 7 * pi) {
					t |= WEST
				}
				else if (p.ry < 3 * pi) {
					t |= SOUTH
				}
				else if (p.ry < 5 * pi) {
					t |= EAST
				}
				else if (p.ry < 7 * pi) {
					// t |= SOUTH
				}
			}

			if (t && shape.flip && hitBox.face !== "top" && (hitBox.face === "bottom" || (p.direction.y * hitBox.closest + p.y) % 1 < 0.5)) {
				t |= FLIP
			}

			world.setBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], t, 0)
			if (t) {
				p.lastPlace = now
			}
			else {
				p.lastBreak = now
			}
		}
	}
	function newWorldBlock() {
		if(!hitBox.pos || !holding) return
		let pos = hitBox.pos, [x, y, z] = pos
		switch(hitBox.face) {
			case "top":
				y += 1
				break
			case "bottom":
				y -= 1
				break
			case "south":
				z -= 1
				break
			case "north":
				z += 1
				break
			case "west":
				x -= 1
				break
			case "east":
				x += 1
				break
		}
		let oldBlock = world.getBlock(x, y, z)
		if (y < maxHeight && y >= 0 && !inBox(x, y, z, 1, 1, 1) && (!oldBlock || blockData[oldBlock].shape === shapes.flower) && oldBlock !== holding) {
			pos[0] = x
			pos[1] = y
			pos[2] = z
			changeWorldBlock(holding)
		}
	}

	let renderedChunks = 0

	let analytics = {
		totalTickTime: 0,
		worstFrameTime: 0,
		totalRenderTime: 0,
		totalFrameTime: 0,
		lastUpdate: 0,
		frames: 1,
		displayedTickTime: "0",
		displayedRenderTime: "0",
		displayedFrameTime: "0",
		displayedwFrameTime: "0",
		displayedwFps: 0,
		fps: 0,
		worstFps: 60,
	}
	function chunkDist(c) {
		let dx = p.x - c.x
		let dz = p.z - c.z
		if (dx > 16) {
			dx -= 16
		}
		else if (dx > 0) {
			dx = 0
		}
		if (dz > 16) {
			dz -= 16
		}
		else if (dz > 0) {
			dz = 0
		}
		return Math.sqrt(dx * dx + dz * dz)
	}
	function sortChunks(c1, c2) { // Sort the list of chunks based on distance from the player
		let dx1 = p.x - c1.x - 8
		let dy1 = p.z - c1.z - 8
		let dx2 = p.x - c2.x - 8
		let dy2 = p.z - c2.z - 8
		return dx1 * dx1 + dy1 * dy1 - (dx2 * dx2 + dy2 * dy2)
	}
	function fillReqs(x, z) {
		// Chunks must all be loaded first.
		let done = true
		for (let i = x - 4; i <= x + 4; i++) {
			for (let j = z - 4; j <= z + 4; j++) {
				let chunk = world.loaded[(i + world.offsetX) * world.lwidth + j + world.offsetZ]
				if (!chunk.generated) {
					world.generateQueue.push(chunk)
					done = false
				}

				if (!chunk.populated && i >= x - 3 && i <= x + 3 && j >= z - 3 && j <= z + 3) {
					world.populateQueue.push(chunk)
					done = false
				}

				if (!chunk.loaded && i >= x - 2 && i <= x + 2 && j >= z - 2 && j <= z + 2) {
					if (world.loadFrom[`${chunk.x >> 4},${chunk.z >> 4}`]) {
						world.loadQueue.push(chunk)
						done = false
					}
					else chunk.load()
				}

				if (!chunk.lit && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					world.lightingQueue.push(chunk)
					done = false
				}
			}
		}

		return done
	}
	function renderFilter(chunk) {
		const d = settings.renderDistance + Math.SQRT1_2
		return chunk.distSq <= d * d
	}

	function debug(message) {
		let ellapsed = performance.now() - debug.start
		if (ellapsed > 30) {
			console.log(message, ellapsed.toFixed(2), "milliseconds")
		}
	}

	let alerts = []
	function chatAlert(msg) {
		if (screen !== "play") return
		alerts.push({
			msg: msg.substr(0, 50),
			created: now,
			rendered: false
		})
		if (alerts.length > 5) alerts.shift()
		renderChatAlerts()
	}
	let charWidth = 6
	{
		// Determine the width of the user's system monospace font.
		let span = document.createElement('span')
		span.style.fontFamily = "monospace"
		span.style.fontSize = "20px"
		span.textContent = "a"
		document.body.append(span)
		charWidth = span.offsetWidth
		span.remove()
	}
	function renderChatAlerts() {
		if (!alerts.length || screen !== "play") return
		let y = height - 150
		if (now - alerts[0].created > 10000 || !alerts.at(-1).rendered) {
			// Clear old alerts
			let x = 50
			let y2 = y - 50 * (alerts.length - 1) - 20
			let w = charWidth * alerts.reduce((mx, al) => max(mx, al.msg.length), 0)
			let h = 50 * (alerts.length - 1) + 24
			ctx.clearRect(x, y2, w, h)
		}
		else return
		while(alerts.length && now - alerts[0].created > 10000) {
			alerts.shift()
		}
		textSize(20)
		for (let i = alerts.length - 1; i >= 0; i--) {
			let alert = alerts[i]
			text(alert.msg, 50, y)
			y -= 50
		}
	}

	function chat(msg, color, author) {
		let lockScroll = false
		if (chatOutput.scrollTop + chatOutput.clientHeight + 50 > chatOutput.scrollHeight) {
			lockScroll = true
		}
		let div = document.createElement("div")
		div.className = "message"

		let content = document.createElement('span')
		if (color) content.style.color = color
		content.textContent = msg

		if (author) {
			let name = document.createElement('span')
			name.textContent = author + ": "
			if (author === "Willard") {
				name.style.color = "cyan"
			}
			div.append(name)
			msg = `${author}: ${msg}` // For the chatAlert
		}

		div.append(content)

		chatOutput.append(div)
		chatAlert(msg)
		if (lockScroll) {
			chatOutput.scroll(0, 10000000)
		}
	}

	function sendChat(msg) {
		if (multiplayer) {
			multiplayer.send(JSON.stringify({
				type: "chat",
				data: msg
			}))
		}
		chat(`${currentUser.username}: ${msg}`, "lightgray")
	}

	let currentUser = { username: "Player" }
	let blockLog = { Player: [] }
	let commands = new Map()
	let autocompleteList = []
	let commandList = []
	var multiplayer = null
	let playerPositions = {}
	let playerEntities = {}
	let playerDistances = []
	function setAutocomplete(list) {
		if (list === autocompleteList) return
		if (list.length === autocompleteList.length) {
			let i = 0
			for (; i < list.length; i++) {
				if (list[i] !== autocompleteList[i]) break
			}
			if (i === list.length) return
		}

		let element = document.getElementById("commands")
		while (element.childElementCount) element.removeChild(element.lastChild)

		for (let string of list) {
			let option = document.createElement("option")
			option.value = string
			element.append(option)
		}
		autocompleteList = list
	}
	function addCommand(name, callback, usage, description, autocomplete) {
		if (!autocomplete) autocomplete = () => {}
		commands.set(name, {
			name,
			callback,
			usage,
			description,
			autocomplete
		})
		commandList.push("/" + name)
	}
	addCommand("help", args => {
		let commandName = args[0]
		if (commands.has(commandName)) {
			const command = commands.get(commandName)
			chat(`Usage: ${command.usage}\nDescription: ${command.description}`, "lime")
		}
		else chat(`/help shows command usage with /help <command name>. Syntax is like "/commandName <required> [optional=default]". So for example "/undo [username=yourself] <count>" means you can do "/undo 12" to undo your own last 12 block edits, or "/undo 1337 griefer 5000" to undo 1337 griefer's last 5000 block edits.\n\nCommands: ${commandList.map(command => `${command.slice(1)}`).join(", ")}`)
	}, "/help <command name>", "Shows how to use a command", () => {
		setAutocomplete(commandList.map(command => `/help ${command.slice(1)}`))
	})
	addCommand("ban", args => {
		let username = args.join(" ")
		if (!username) {
			chat("Please provide a username. Like /ban Willard", "tomato")
			return
		}
		if (!win.ban) {
			chat("This is a singleplayer world. There's nobody to ban.", "tomato")
			return
		}
		win.ban(username)
	}, "/ban <username>", "IP ban a player from your world until you close it.", () => {
		setAutocomplete(Object.keys(playerPositions).map(player => `/ban ${player}`))
	})
	addCommand("online", () => {
		if (win.online && multiplayer) {
			win.online()
		}
		else {
			chat("You're all alone. Sorry.", "tomato")
		}
	}, "/online", "Lists online players")
	addCommand("history", args => {
		let dist = +args[0] || 20
		dist *= dist
		let lines = []
		for (let name in blockLog) {
			let list = blockLog[name]
			let oldest = 0
			let newest = 0
			let broken = 0
			let placed = 0
			for (let i = 0; i < list.length; i++) {
				let block = list[i]
				let dx = block[0] - p.x
				let dy = block[1] - p.y
				let dz = block[2] - p.z
				if (dx * dx + dy * dy + dz * dz <= dist) {
					if (block[3]) placed++
					else broken++
					newest = block[5]
					if (!oldest) oldest = block[5]
				}
			}
			if (oldest) {
				lines.push(`${name}: ${broken} blocks broken and ${placed} blocks placed between ${timeString(now-oldest)} and ${timeString(now-newest)}.`)
			}
		}
		if (lines.length) {
			let ul = document.createElement("ul")
			for (let line of lines) {
				let li = document.createElement("li")
				li.textContent = line
				ul.append(li)
			}
			chatOutput.append(ul)
			// chat(`Within ${Math.sqrt(dist)} blocks of your position:\n` + lines.join("\n"), "lime")
		}
		else chat(`No blocks edited within ${Math.sqrt(dist)} blocks within this world session.`, "tomato")
	}, "/history [dist=20]", "Shows a list of block edits within a specified range from your current world session.")
	addCommand("undo", async args => {
		if (multiplayer && !multiplayer.host) {
			chat("Only the world's host may use this command.", "tomato")
			return
		}
		let count = +args.pop()
		if (isNaN(count)) {
			chat("Please provide a count of the number of blocks to undo. Like /undo Willard 4000", "tomato")
			return
		}
		let name = currentUser.username
		if (args.length) name = args.join(" ")
		let list = blockLog[name]
		if (!list) {
			chat("You provided a name that didn't match any users with a block history. Names are case-sensitive.", "tomato")
			return
		}

		if (count > list.length) count = list.length
		chat(`Undoing the last ${count} block edits from ${name}`, "lime")
		for (let i = 0; i < count; i++) {
			let [x, y, z, , oldBlock] = list.pop()
			if (multiplayer) await sleep(50)
			world.setBlock(x, y, z, oldBlock, false, false, true)
		}
		chat(`${count} block edits undone.`, "lime")
	}, "/undo [username=Player] <blockCount>", "Undoes the last <blockCount> block edits made by [username]", () => {
		setAutocomplete(Object.keys(blockLog).map(name => `/undo ${name} ${blockLog[name].length}`))
	})
	addCommand("fill", args => {
		if (multiplayer) {
			chat("This command only works on offline worlds.", "tomato")
			return
		}
		if (blockLog[currentUser.username].length < 2) {
			chat("You must place (or break) 2 blocks to indicate the fill zone before using this command.", "tomato")
			return
		}

		let solid = true
		if (args[1]?.toLowerCase()[0] === "h") solid = false
		let shape = "cube"
		if (args[0]?.toLowerCase() === "sphere") shape = "sphere"
		if (args[0]?.toLowerCase().startsWith("cyl")) shape = "cylinder"

		const block = inventory.hotbar.hand.id
		const name = inventory.hotbar.hand.name

		let [start, end] = blockLog[currentUser.username].slice(-2)
		let [x1, y1, z1] = start
		let [x2, y2, z2] = end

		const range = settings.renderDistance * 16 - 16
		const sort = (a, b) => a - b

		if (shape === "cube") {
			// Make x1 y1 z1 be the lowest corner so I can loop up

			[x1, x2] = [x1, x2].sort(sort);
			[y1, y2] = [y1, y2].sort(sort);
			[z1, z2] = [z1, z2].sort(sort)

			if (x2 - p.x > range || p.x - x1 > range || z2 - p.z > range || p.z - z1 > range) {
				chat("You're trying to use this command outside your loaded chunks. That'll crash the game, so move closer or re-select your corners.", "tomato")
				return
			}

			let count = (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1)
			if (!solid) count -= (x2 - x1 - 1) * (y2 - y1 - 1) * (z2 - z1 - 1)

			if (count > 1000000) {
				chat(`You're trying to edit ${count.toLocaleString()} blocks at once. Stop and reevaluate your life choices.`, "tomato")
				return
			}

			if (!confirm(`Width: ${x2 - x1 + 1}\nHeight: ${y2 - y1 + 1}\nDepth: ${z2 - z1 + 1}\nYou're about to set ${count.toLocaleString()} blocks of ${name}  with a ${solid ? "solid" : "hollow"} cuboid. Are you sure you want to proceed?`)) return

			new Promise(async resolve => {
				await sleep(0) // Let the player watch the blocks change
				let edited = 0
				for (let x = x1; x <= x2; x++) {
					for (let y = y1; y <= y2; y++) {
						for (let z = z1; z <= z2; z++) {
							if ((solid || x === x1 || x === x2 || y === y1 || y === y2 || z === z1 || z === z2) && world.getBlock(x, y, z) !== block) {
								world.setBlock(x, y, z, block)
								edited++
								if ((edited & 1023) === 0) await sleep(4)
							}
						}
					}
				}
				chat(`${edited.toLocaleString()} ${name} blocks successfully filled!`, "lime")
				resolve()
			})
		}
		else if (shape === "sphere") {
			const radius = Math.hypot(x1 - x2, y1 - y2, z1 - z2) + 0.5

			if (Math.hypot(x1 - p.x, z1 - p.z) + radius > range) {
				chat("You're trying to use this command outside your loaded chunks. That'll crash the game, so move closer or re-select your center and edge.", "tomato")
				return
			}

			let count = 4 / 3 * Math.PI * radius**3 | 0
			if (!solid) count -= 4 / 3 * Math.PI * (radius - 1)**3 | 0

			if (count > 1000000) {
				chat(`You're trying to edit ${count.toLocaleString()} blocks at once. Stop and reevaluate your life choices.`, "tomato")
				return
			}

			if (!confirm(`Center: (${x1}, ${y1}, ${z1})\nRadius: ${radius | 0}\nYou're about to set approximately ${count.toLocaleString()} blocks of ${name} with a ${solid ? "solid" : "hollow"} sphere. Are you sure you want to proceed?`)) return

			const offset = Math.ceil(radius)
			new Promise(async resolve => {
				await sleep(0) // Let the player watch the blocks change
				let edited = 0
				for (let x = x1 - offset; x <= x1 + offset; x++) {
					for (let y = Math.max(y1 - offset, 1); y <= Math.min(y1 + offset, maxHeight); y++) {
						for (let z = z1 - offset; z <= z1 + offset; z++) {
							let d = Math.hypot(x1 - x, y1 - y, z1 - z)
							if (d <= radius && (solid || radius - d < 1.0) && world.getBlock(x, y, z) !== block) {
								world.setBlock(x, y, z, block)
								edited++
								if ((edited & 1023) === 0) await sleep(4)
							}
						}
					}
				}
				chat(`${edited.toLocaleString()} ${name} blocks successfully filled!`, "lime")
				resolve()
			})
		}
		else if (shape === "cylinder") {
			const radius = Math.hypot(x1 - x2, z1 - z2) + 0.5;
			[y1, y2] = [y1, y2].sort(sort)

			if (Math.hypot(x1 - p.x, z1 - p.z) + radius > range) {
				chat("You're trying to use this command outside your loaded chunks. That'll crash the game, so move closer or re-select your center and edge.", "tomato")
				return
			}

			let count = (y2 - y1 + 1) * Math.PI * radius**2 | 0
			if (!solid) count -= (y2 - y1 - 1) * Math.PI * (radius - 1)**2 | 0

			if (count > 1000000) {
				chat(`You're trying to edit ${count.toLocaleString()} blocks at once. Stop and reevaluate your life choices.`, "tomato")
				return
			}

			if (!confirm(`Center: (${x1}, ${y1}, ${z1})\nRadius: ${radius | 0}\nHeight: ${y2 - y1 + 1}\nYou're about to set approximately ${count.toLocaleString()} blocks of ${name} with a ${solid ? "solid" : "hollow"} cylinder. Are you sure you want to proceed?`)) return

			const offset = Math.ceil(radius)
			new Promise(async resolve => {
				await sleep(0) // Let the player watch the blocks change
				let edited = 0
				for (let x = x1 - offset; x <= x1 + offset; x++) {
					for (let y = y1; y <= y2; y++) {
						for (let z = z1 - offset; z <= z1 + offset; z++) {
							let d = Math.hypot(x1 - x, z1 - z)
							if (d <= radius && (solid || radius - d < 1.0 || y === y1 || y === y2) && world.getBlock(x, y, z) !== block) {
								world.setBlock(x, y, z, block)
								edited++
								if ((edited & 1023) === 0) await sleep(4)
							}
						}
					}
				}
				chat(`${edited.toLocaleString()} ${name} blocks successfully filled!`, "lime")
				resolve()
			})
		}

		play()
	}, "/fill [cuboid|sphere|cylinder] [solid|hollow]", "Uses the player's last 2 edited blocks to designate an area to fill, then fills it with the block in the player's hand.\nWith a cuboid, the 2 blocks are the corners.\nWith a sphere, the first block you edit is the center, and the 2nd block determines the radius.\nWith a cylinder, the first block determines the center, and the 2nd block determines the radius and height.", () => {
		setAutocomplete(["/fill cuboid hollow", "/fill sphere hollow", "/fill cylinder hollow", "/fill cuboid solid", "/fill sphere solid", "/fill cylinder solid"])
	})

	function sendCommand(msg) {
		msg = msg.substr(1)
		let parts = msg.split(" ")
		let cmd = parts.shift()
		if (commands.has(cmd)) commands.get(cmd).callback(parts)
		setAutocomplete(commandList)
	}

	async function loggedIn() {
		let exists = await fetch("https://willard.fun/profile").then(res => res.text()).catch(() => "401")
		if (!exists || exists === "401") {
			if (location.href.startsWith("https://willard.fun")) {
				alert("You're not logged in. Head over to https://willard.fun/login to login or register before connecting to the server.")
			}
			else {
				alert("Multiplayer is currently only available on https://willard.fun/login => https://willard.fun/minekhan")
			}
			return false
		}
		currentUser = JSON.parse(exists)
		if (blockLog.Player) {
			blockLog[currentUser.username] = blockLog.Player
			delete blockLog.Player
		}
		return true
	}

	async function initMultiplayer(target) {
		if (multiplayer) return
		let logged = await loggedIn()
		if (!logged) return

		let host = false
		if (!target) {
			target = world.id
			host = true
		}
		multiplayer = new WebSocket("wss://willard.fun/ws?target=" + target)
		multiplayer.host = host
		multiplayer.binaryType = "arraybuffer"
		multiplayer.onopen = () => {
			let password = ""
			if (!host && !worlds[target].public) password = prompt(`What's the password for ${worlds[target].name}?`) || ""
			multiplayer.send(JSON.stringify({
				type: "connect",
				password
			}))
			if (host) {
				let password = prompt("Enter a password to make this a private world, or leave it blank for a public world.") || ""
				multiplayer.send(JSON.stringify({
					type: "init",
					name: world.name,
					version,
					password
				}))
			}
			multiplayer.pos = setInterval(() => multiplayer.send(JSON.stringify({
				type: "pos",
				data: { x: p.x, y: p.y, z: p.z, vx: p.velocity.x, vy: p.velocity.y, vz: p.velocity.z }
			})), 500)
		}
		let multiplayerError = ""
		multiplayer.onmessage = msg => {
			if (msg.data === "ping") {
				multiplayer.send("pong")
				return
			}
			if (typeof msg.data !== "string" && screen === "multiplayer menu") {
				world = new World(true) // Non-hosts can't use console commands since this isn't global.
				world.loadSave(new Uint8Array(msg.data))
				changeScene("loading")
				return
			}
			let packet = JSON.parse(msg.data)
			if (packet.type === "setBlock") {
				let a = packet.data

				if (!a[4]) {
					// If it's not an "Undo" packet, log it.
					let old = world.getBlock(a[0], a[1], a[2])
					a.push(old, now)
					if (!blockLog[packet.author]) blockLog[packet.author] = []
					blockLog[packet.author].push(a)
				}

				world.setBlock(a[0], a[1], a[2], a[3], false, true)
			}
			else if (packet.type === "genChunk") {
				// TO-DO: generate chunks
			}
			else if (packet.type === "connect") {
				if (host) {
					multiplayer.send(world.getSaveString())
				}
				chat(`${packet.author} has joined.`, "#6F6FFB")
			}
			else if (packet.type === "users") {
				chat(packet.data.join(", "), "lightgreen")
			}
			else if (packet.type === "ban") {
				chat(packet.data, "lightgreen")
			}
			else if (packet.type === "pos") {
				let pos = packet.data
				let name = packet.author
				playerPositions[name] = pos
				if (!playerEntities[name]) playerEntities[name] = new Player(pos.x, pos.y, pos.z, pos.vx, pos.vy, pos.vz, abs(name.hashCode()) % 80 + 1, glExtensions, gl, glCache, indexBuffer, world, p)
				let ent = playerEntities[name]
				ent.x = pos.x
				ent.y = pos.y
				ent.z = pos.z
				ent.velx = pos.vx || 0
				ent.vely = pos.vy || 0
				ent.velz = pos.vz || 0
				packet.data.time = now
			}
			else if (packet.type === "error") {
				multiplayerError = packet.data
			}
			else if (packet.type === "debug") {
				chat(packet.data, "pink", "Server")
			}
			else if (packet.type === "dc") {
				chat(`${packet.author} has disconnected.`, "tomato")
				delete playerPositions[packet.author]
				delete playerEntities[packet.author]
			}
			else if (packet.type === "eval") { // Blocked server-side; Can only be sent directly from the server for announcements and live patches
				try {
					eval(packet.data)
				}
				catch(e) {
					// Do nothing
				}
			}
			else if (packet.type === "chat") {
				chat(packet.data, "white", packet.author)
			}
		}

		multiplayer.onclose = () => {
			if (!host) {
				if (screen !== "main menu") alert(`Connection lost! ${multiplayerError}`)
				changeScene("main menu")
			}
			else if (screen !== "main menu") {
				alert(`Connection lost! ${multiplayerError || "You can re-open your world from the pause menu."}`)
			}
			clearInterval(multiplayer.pos)
			multiplayer = null
			playerEntities = {}
			playerPositions = {}
			playerDistances.length = 0
		}
		multiplayer.onerror = multiplayer.onclose

		win.online = function() {
			multiplayer.send("fetchUsers")
		}

		win.ban = function(username) {
			if (!multiplayer) {
				chat("Not in a multiplayer world.", "tomato")
				return
			}
			if (!host) {
				chat("You don't have permission to do that.", "tomato")
				return
			}
			if (username.trim().toLowerCase() === "willard") {
				chat("You cannot ban Willard. He created this game and is paying for this server.", "tomato")
				return
			}
			multiplayer.send(JSON.stringify({
				type: "ban",
				data: username || ""
			}))
		}

		win.dists = () => {
			console.log(playerPositions)
			console.log(playerDistances)
			return playerEntities
		}
	}

	async function getWorlds() {
		let logged = await loggedIn()
		if (!logged) return []

		return await fetch("https://willard.fun/minekhan/worlds").then(res => res.json())
	}

	let fogDist = 16

	// const wasm = await WebAssembly.instantiateStreaming("/world.wasm", {})
	// const { memory } = wasm.instance.exports

	class World {
		constructor(empty) {
			if (!empty) {
				setSeed(Math.random() * 2000000000 | 0)
			}

			generatedChunks = 0
			fogDist = 16

			// Initialize the world's arrays
			this.chunks = []
			this.loaded = []
			this.sortedChunks = []
			this.doubleRenderChunks = []
			this.offsetX = 0
			this.offsetZ = 0
			this.lwidth = 0
			this.chunkGenQueue = []
			this.populateQueue = []
			this.generateQueue = []
			this.lightingQueue = []
			this.loadQueue = []
			this.meshQueue = []
			this.loadFrom = {}
			this.loading = false
			this.entities = []
			this.lastChunk = ","
			this.caves = caves
			this.initTime = Date.now()
			this.tickCount = 0
			this.settings = settings
			this.lastTick = performance.now()
			this.rivers = true
			// this.memory = memory
			// this.freeMemory = []
		}
		// initMemory() {
		// 	// Reserve first 256 bytes for settings or whatever
		// 	this.pointers = new Uint32Array(this.memory.buffer, 256, 71*71)
		// }
		updateBlock(x, y, z) {
			const chunk = this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ]
			if (chunk.buffer) {
				chunk.updateBlock(x & 15, y, z & 15, this)
			}
		}
		getChunk(x, z) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			return this.loaded[X * this.lwidth + Z]
		}
		getBlock(x, y, z) {
			if (y > maxHeight) {
				// debugger
				return 0
			}
			return this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].getBlock(x & 15, y, z & 15)
		}
		getSurfaceHeight(x, z) {
			return this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].tops[(x & 15) * 16 + (z & 15)]
		}
		spawnBlock(x, y, z, blockID) {
			// Sets a block if it was previously air. Only to be used in world gen.
			// Currently only used in chunk.populate()

			let chunk = this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ]

			x &= 15
			z &= 15
			if (!chunk.getBlock(x, y, z)) {
				chunk.setBlock(x, y, z, blockID)
				// let i = x * 16 + z
				// if (y > chunk.tops[i]) chunk.tops[i] = y
				if (y > chunk.maxY) chunk.maxY = y
			}
		}
		setWorldBlock(x, y, z, blockID) {
			// Sets a block during world gen.
			this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].setBlock(x & 15, y, z & 15, blockID, false)
		}
		setBlock(x, y, z, blockID, lazy, remote, doNotLog) {

			// Load get the chunk if it's loaded, otherwise just set the block in the load data.
			const chunkX = (x >> 4) + this.offsetX
			const chunkZ = (z >> 4) + this.offsetZ
			let chunk = null
			if (chunkX >= 0 && chunkX < this.lwidth && chunkZ >= 0 && chunkZ < this.lwidth) chunk = this.loaded[chunkX * this.lwidth + chunkZ]
			if (!chunk?.loaded) {
				const str = `${x >> 4},${z >> 4}`
				if (!world.loadFrom[str]) world.loadFrom[str] = { edits: [] }
				if (!world.loadFrom[str].edits) world.loadFrom[str].edits = []
				world.loadFrom[str].edits[y * 256 + (x&15) * 16 + (z&15)] = blockID
				return
			}

			let xm = x & 15
			let zm = z & 15

			if (!remote && !doNotLog) {
				// Log your own blocks
				let oldBlock = chunk.getBlock(xm, y, zm)
				blockLog[currentUser.username].push([x, y, z, blockID, oldBlock, now])
			}
			if (blockID) {
				chunk.setBlock(xm, y, zm, blockID, !lazy)
				let data = blockData[blockID]
				if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
					this.updateLight(x, y, z, true, data.lightLevel)
				}
			}
			else {
				let data = blockData[chunk.getBlock(xm, y, zm)]
				chunk.deleteBlock(xm, y, zm, !lazy)
				if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
					this.updateLight(x, y, z, false, data.lightLevel)
				}
			}

			if (lazy) {
				return
			}

			if (multiplayer && !remote) {
				let data = [x, y, z, blockID]
				if (doNotLog) data.push(1)
				multiplayer.send(JSON.stringify({
					type: "setBlock",
					data: data
				}))
			}

			// Update the 6 adjacent blocks and 1 changed block
			if (xm && xm !== 15 && zm && zm !== 15) {
				chunk.updateBlock(xm - 1, y, zm, this)
				chunk.updateBlock(xm, y - 1, zm, this)
				chunk.updateBlock(xm + 1, y, zm, this)
				chunk.updateBlock(xm, y + 1, zm, this)
				chunk.updateBlock(xm, y, zm - 1, this)
				chunk.updateBlock(xm, y, zm + 1, this)
			}
			else {
				this.updateBlock(x - 1, y, z)
				this.updateBlock(x + 1, y, z)
				this.updateBlock(x, y - 1, z)
				this.updateBlock(x, y + 1, z)
				this.updateBlock(x, y, z - 1)
				this.updateBlock(x, y, z + 1)
			}

			chunk.updateBlock(xm, y, zm, this)

			// Update the corner chunks so shadows in adjacent chunks update correctly
			if (xm | zm === 0) {
				this.updateBlock(x - 1, y, z - 1)
			}
			if (xm === 15 && zm === 0) {
				this.updateBlock(x + 1, y, z - 1)
			}
			if (xm === 0 && zm === 15) {
				this.updateBlock(x - 1, y, z + 1)
			}
			if (xm & zm === 15) {
				this.updateBlock(x + 1, y, z + 1)
			}
		}
		getLight(x, y, z, blockLight) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			if (blockLight === 1) return this.loaded[X * this.lwidth + Z].getBlockLight(x & 15, y, z & 15)
			else if (blockLight === 0) return this.loaded[X * this.lwidth + Z].getSkyLight(x & 15, y, z & 15)
			else return this.loaded[X * this.lwidth + Z].getLight(x & 15, y, z & 15)
		}
		setLight(x, y, z, level, blockLight) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ

			if (this.loaded[X * this.lwidth + Z]) {
				if (blockLight === 1) this.loaded[X * this.lwidth + Z].setBlockLight(x & 15, y, z & 15, level)
				else if (blockLight === 0) this.loaded[X * this.lwidth + Z].setSkyLight(x & 15, y, z & 15, level)
				else this.loaded[X * this.lwidth + Z].setLight(x & 15, y, z & 15, level)
			}
		}
		updateLight(x, y, z, place, blockLight = 0) {
			let chunk = this.getChunk(x, z)
			if (!chunk) return
			let cx = x & 15
			let cz = z & 15
			let center = chunk.getSkyLight(cx, y, cz)
			let blight = chunk.getBlockLight(cx, y, cz)
			let up = this.getLight(x, y+1, z, 0)
			let down = this.getLight(x, y-1, z, 0)
			let north = this.getLight(x, y, z+1, 0)
			let south = this.getLight(x, y, z-1, 0)
			let east = this.getLight(x+1, y, z, 0)
			let west = this.getLight(x-1, y, z, 0)

			let spread = []
			if (!place) { // Block was removed; increase light levels
				if (up === 15) { // Removed block was under direct sunlight; fill light downward
					for (let i = y; i > 0; i--) {
						if (blockData[chunk.getBlock(cx, i, cz)].transparent) {
							chunk.setSkyLight(cx, i, cz, 15)
							spread.push(x, i, z)
						}
						else {
							break
						}
					}
					chunk.spreadLight(spread, 14, true, 0)
				}
				else { // Block wasn't in direct skylight; subtract 1 from the brightest neighboring tile and use that as the new light level
					center = max(up, down, north, south, east, west)
					if (center > 0) center -= 1
					this.setLight(x, y, z, center, 0)
					if (center > 1) {
						spread.push(x, y, z)
						chunk.spreadLight(spread, center - 1, true, 0)
					}
				}

				// Block light levels
				if (!blockLight || blockLight < blight) {
					spread.length = 0
					up = this.getLight(x, y+1, z, 1)
					down = this.getLight(x, y-1, z, 1)
					north = this.getLight(x, y, z+1, 1)
					south = this.getLight(x, y, z-1, 1)
					east = this.getLight(x+1, y, z, 1)
					west = this.getLight(x-1, y, z, 1)
					blight = max(up, down, north, south, east, west)
					if (blight > 0) blight -= 1
					this.setLight(x, y, z, blight, 1)
					if (blight > 1) {
						spread.push(x, y, z)
						chunk.spreadLight(spread, blight - 1, true, 1)
					}
				}
			}
			else if (place && (center !== 0 || blight !== 0)) { // Block was placed; decrease light levels
				let respread = []
				for (let i = 0; i <= 15; i++) respread[i] = []
				chunk.setLight(cx, y, cz, 0) // Set both skylight and blocklight to 0
				spread.push(x, y, z)

				// Sky light
				if (center === 15) {
					for (let i = y-1; i > 0; i--) {
						if (blockData[chunk.getBlock(cx, i, cz)].transparent) {
							chunk.setSkyLight(cx, i, cz, 0)
							spread.push(x, i, z)
						}
						else {
							break
						}
					}
				}
				chunk.unSpreadLight(spread, center - 1, respread, 0)
				chunk.reSpreadLight(respread, 0)

				// Block light
				if (blight) {
					respread.length = 0
					// for (let i = 0; i <= blight + 1; i++) respread[i] = []
					for (let i = 0; i <= 15; i++) respread[i] = []
					spread.length = 0
					spread.push(x, y, z)
					chunk.unSpreadLight(spread, blight - 1, respread, 1)
					chunk.reSpreadLight(respread, 1)
				}
			}
			if (place && blockLight) { // Light block was placed
				chunk.setBlockLight(cx, y, cz, blockLight)
				spread.length = 0
				spread.push(x, y, z)
				chunk.spreadLight(spread, blockLight - 1, true, 1)
			}
			else if (!place && blockLight) { // Light block was removed
				chunk.setBlockLight(cx, y, cz, 0)
				spread.push(x, y, z)
				let respread = []
				for (let i = 0; i <= blockLight + 1; i++) respread[i] = []
				chunk.unSpreadLight(spread, blockLight - 1, respread, 1)
				chunk.reSpreadLight(respread, 1)
			}
		}
		async tick() {
			this.lastTick = performance.now()
			this.tickCount++
			if (this.tickCount & 1) {
				hud() // Update the HUD at 10 TPS
				renderChatAlerts()
			}

			let maxChunkX = (p.x >> 4) + settings.renderDistance
			let maxChunkZ = (p.z >> 4) + settings.renderDistance
			let chunk = maxChunkX + "," + maxChunkZ
			if (chunk !== this.lastChunk) {
				this.lastChunk = chunk
				this.loadChunks()
				this.chunkGenQueue.sort(sortChunks)
			}

			if (controlMap.breakBlock.pressed && (p.lastBreak < now - 250 || p.autoBreak) && screen === "play") {
				changeWorldBlock(0)
			}

			for (let i = 0; i < this.sortedChunks.length; i++) {
				this.sortedChunks[i].tick()
			}

			for (let i = this.entities.length - 1; i >= 0; i--) {
				const entity = this.entities[i]
				entity.update()
				if (entity.canDespawn) {
					this.entities.splice(i, 1)
				}
			}

			// Make sure there's only 1 "world gen" loop running at a time
			if (this.ticking) return
			this.ticking = true

			let doneWork = true
			while (doneWork && (screen === "play" || screen === "loading")) {
				doneWork = false
				debug.start = performance.now()
				if (this.meshQueue.length) {
					// Update all chunk meshes.
					do {
						this.meshQueue.pop().genMesh(indexBuffer, bigArray)
					} while(this.meshQueue.length)
					doneWork = true
					debug("Meshes")
				}

				if (this.generateQueue.length && !doneWork) {
					let chunk = this.generateQueue.pop()
					chunk.generate()
					doneWork = true
				}

				// Carve caves, then place details
				if (this.populateQueue.length && !doneWork) {
					let chunk = this.populateQueue[this.populateQueue.length - 1]
					if (!chunk.caves) await chunk.carveCaves()
					else {
						chunk.populate(details)
						this.populateQueue.pop()
					}
					doneWork = true
				}

				// Load chunk
				if (!doneWork && this.loadQueue.length) {
					this.loadQueue.pop().load()
					doneWork = true
				}

				// Spread light
				if (!doneWork && this.lightingQueue.length) {
					let chunk = this.lightingQueue.pop()
					chunk.fillLight()
					doneWork = true
				}

				if (!doneWork && this.chunkGenQueue.length && !this.lightingQueue.length) {
					let chunk = this.chunkGenQueue[0]
					if (!fillReqs(chunk.x >> 4, chunk.z >> 4)) {
						// The requirements haven't been filled yet; don't do anything else.
					}
					else if (!chunk.optimized) {
						chunk.optimize(screen)
						debug("Optimize")
					}
					else if (!chunk.buffer) {
						chunk.genMesh(indexBuffer, bigArray)
						debug("Initial mesh")
					}
					else {
						this.chunkGenQueue.shift()
						generatedChunks++
						if (generatedChunks === 3000) {
							let ms = Date.now() - this.initTime
							console.log("3000 chunk seconds:", ms/1000, "\nms per chunk:", ms / 3000, "\nChunks per second:", 3000000 / ms)
						}
					}
					doneWork = true
				}

				// Yield the main thread to render passes
				if (doneWork) await yieldThread()
			}
			this.ticking = false
		}
		render() {
			// Was in tick(); moved here just for joseph lol
			if (controlMap.placeBlock.pressed && (p.lastPlace < now - 250 || p.autoBuild)) {
				lookingAt()
				newWorldBlock()
			}
			animateTextures(gl)

			initModelView(p)
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			let time = 0
			if (multiplayer) time = Date.now()
			else time = this.tickCount * 50 + (performance.now() - this.lastTick) % 50

			p2.x = round(p.x)
			p2.y = round(p.y)
			p2.z = round(p.z)

			renderedChunks = 0

			let dist = Math.max(settings.renderDistance * 16 - 8, 16)
			if (this.chunkGenQueue.length) {
				let chunk = this.chunkGenQueue[0]
				dist = min(dist, chunkDist(chunk))
			}
			if (dist !== fogDist) {
				if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 30
				else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
				else fogDist = dist
			}

			gl.uniform3f(glCache.uPos, p.x, p.y, p.z)
			gl.uniform1f(glCache.uDist, fogDist)

			gl.useProgram(program3DFogless)
			gl.uniform3f(glCache.uPosFogless, p.x, p.y, p.z)

			let c = this.sortedChunks
			let glob = { renderedChunks }
			let fog = false
			for (let i = 0; i < c.length; i++) {
				if (!fog && fogDist < chunkDist(c[i]) + 24) {
					gl.useProgram(program3D)
					fog = true
				}
				c[i].render(p, glob)
			}

			skybox(time / 1000 + 150, matrix)
			use3d()
			gl.useProgram(program3DFogless)
			fog = false
			if (this.doubleRenderChunks.length) {
				gl.depthMask(false)
				gl.uniform1i(glCache.uTransFogless, 1)
				for (let chunk of this.doubleRenderChunks) {
					if (!fog && fogDist < chunkDist(chunk) + 24) {
						gl.uniform1i(glCache.uTransFogless, 0)
						gl.useProgram(program3D)
						gl.uniform1i(glCache.uTrans, 1)
						fog = true
					}
					chunk.render(p, glob)
				}
				if (!fog) gl.uniform1i(glCache.uTransFogless, 0)
				else gl.uniform1i(glCache.uTrans, 0)
				gl.depthMask(true)
			}

			renderedChunks = glob.renderedChunks

			gl.disableVertexAttribArray(glCache.aSkylight)
			gl.disableVertexAttribArray(glCache.aBlocklight)
			gl.disableVertexAttribArray(glCache.aShadow)
			// gl.uniform3f(glCache.uPos, 0, 0, 0)
			if (hitBox.pos) {
				drawHitbox(p)
			}

			// Render entities
			gl.useProgram(programEntity)
			for (let i = this.entities.length - 1; i >= 0; i--) {
				const entity = this.entities[i]
				entity.render()
			}

			// Render players
			if (multiplayer) {
				for (let name in playerEntities) {
					const entity = playerEntities[name]
					// entity.update()
					entity.render()
				}
			}

			// gl.useProgram(program3D)
		}
		loadChunks(cx, cz, sort = true, renderDistance = settings.renderDistance + 4) {
			cx ??= p.x >> 4
			cz ??= p.z >> 4
			p.cx = cx
			p.cz = cz
			let minChunkX = cx - renderDistance
			let maxChunkX = cx + renderDistance
			let minChunkZ = cz - renderDistance
			let maxChunkZ = cz + renderDistance

			this.offsetX = -minChunkX
			this.offsetZ = -minChunkZ
			this.lwidth = renderDistance * 2 + 1
			this.chunkGenQueue.length = 0
			this.lightingQueue.length = 0
			this.populateQueue.length = 0
			this.generateQueue.length = 0

			let chunks = new Map()
			for (let i = this.loaded.length - 1; i >= 0; i--) {
				const chunk = this.loaded[i]
				const chunkX = chunk.x >> 4
				const chunkZ = chunk.z >> 4
				if (chunkX < minChunkX || chunkX > maxChunkX || chunkZ < minChunkZ || chunkZ > maxChunkZ) {
					chunk.unload()
					delete chunk.blocks
					this.loaded.splice(i, 1)
				}
				else chunks.set(`${chunkX},${chunkZ}`, chunk)
			}

			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let z = minChunkZ; z <= maxChunkZ; z++) {
					let chunk = chunks.get(`${x},${z}`)
					if (!chunk) {
						chunk = new Chunk(x * 16, z * 16, this, glExtensions, gl, glCache, superflat, caves, details)
						this.loaded.push(chunk)
					}

					const cdx = (chunk.x >> 4) - cx
					const cdz = (chunk.z >> 4) - cz
					chunk.distSq = cdx * cdx + cdz * cdz
					if (!chunk.buffer && renderFilter(chunk)) {
						this.chunkGenQueue.push(chunk)
					}
				}
			}
			this.loaded.sort((a, b) => a.x - b.x || a.z - b.z)

			if (sort) {
				this.sortedChunks = this.loaded.filter(renderFilter)
				this.sortedChunks.sort(sortChunks)
				this.doubleRenderChunks = this.sortedChunks.filter(chunk => chunk.doubleRender)
			}
		}

		getSaveString() {

			let bab = new BitArrayBuilder()
			bab.add(this.name.length, 8)
			for (let c of this.name) bab.add(c.charCodeAt(0), 8)
			version.split(" ")[1].split(".").map(n => bab.add(+n, 8))

			bab.add(worldSeed, 32)
			bab.add(this.tickCount, 32)
			bab.add(round(p.x), 20).add(Math.min(round(p.y), 511), 9).add(round(p.z), 20)
			bab.add(p.rx * 100, 11).add(p.ry * 100, 11)
			bab.add(p.flying, 1).add(p.spectator, 1)
			bab.add(superflat, 1).add(caves, 1).add(details, 1).add(this.rivers, 1)

			for (let i = 0; i < inventory.playerStorage.size; i++) {
				const item = inventory.playerStorage.items[i]
				bab.add(item?.id || 0, 16).add(item?.stackSize - 1 || 0, 6)
			}
			bab.add(inventory.hotbar.index - inventory.hotbar.start, 4)

			for (let chunk of this.loaded) {
				let chunkData = chunk.getSave()
				if (chunkData) bab.append(chunkData)
			}

			// Chunks that aren't in the loaded area
			for (let coords in this.loadFrom) {
				const [x, z] = coords.split(",").map(n => n << 4)
				const chunk = new Chunk(x * 16, z * 16, this, glExtensions, gl, glCache, superflat, caves)

				if (this.version < "Alpha 0.8.1" || this.loadFrom[coords].edits) {
					// Load the chunk and re-save it in the new version format
					chunk.blocks.fill(-1)
					chunk.originalBlocks = chunk.blocks.slice()
					chunk.load()
				}
				else {
					chunk.originalBlocks = { length: 1 } // Just get it to run the function
					chunk.saveData = this.loadFrom[coords]
				}
				bab.append(chunk.getSave())
			}
			return bab.array
		}
		loadSave(data) {
			if (typeof data === "string") {
				if (data.includes("Alpha")) {
					try {
						return this.loadOldSave(data)
					}
					catch(e) {
						alert("Unable to load save string.")
					}
				}
				try {
					let bytes = atob(data)
					let arr = new Uint8Array(bytes.length)
					for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
					data = arr
				}
				catch(e) {
					alert("Malformatted save string. Unable to load")
					throw e
				}
			}

			const reader = new BitArrayReader(data)

			const nameLen = reader.read(8)
			this.name = ""
			for (let i = 0; i < nameLen; i++) this.name += String.fromCharCode(reader.read(8))

			// Check for old version; hopefully there's never a false-positive.
			reader.bit += 287
			let version = reader.read(24)
			reader.bit -= 311

			let paletteLen = 0
			let palette = []
			let paletteBits = 0

			if (version === 0x800) {
				// Alpha 0.8.0
				this.rivers = false
				setSeed(reader.read(32))
				this.tickCount = reader.read(32)

				p.x = reader.read(20, true)
				p.y = reader.read(8)
				p.z = reader.read(20, true)
				p.rx = reader.read(11, true) / 100
				p.ry = reader.read(11, true) / 100
				for (let i = 0; i < 9; i++) inventory.playerStorage.setItem(reader.read(16), i + inventory.hotbar.start)
				inventory.hotbar.index = reader.read(4) + inventory.hotbar.start
				p.flying = reader.read(1)
				p.spectator = reader.read(1)

				superflat = reader.read(1)
				caves = reader.read(1)
				details = reader.read(1)

				reader.bit += 24 // Version; we already have that.

				paletteLen = reader.read(16)
				paletteBits = BitArrayBuilder.bits(paletteLen)
				for (let i = 0; i < paletteLen; i++) palette.push(reader.read(16))

				reader.bit += 32 // Section count; no longer used since I realized I can just read to the end.
			}
			else {
				// Current saves
				version = reader.read(24)
				setSeed(reader.read(32))
				this.tickCount = reader.read(32)

				p.x = reader.read(20, true)
				p.y = reader.read(9)
				p.z = reader.read(20, true)
				p.rx = reader.read(11, true) / 100
				p.ry = reader.read(11, true) / 100
				p.flying = reader.read(1)
				p.spectator = reader.read(1)
				superflat = reader.read(1)
				caves = reader.read(1)
				details = reader.read(1)
				this.rivers = reader.read(1)

				for (let i = 0; i < 36; i++) {
					let id = reader.read(16)
					let stack = reader.read(6) + 1
					inventory.playerStorage.setItem(id ? new InventoryItem(id, blockData[id].name, stack, blockData[id].iconImg) : null, i)
				}
				inventory.hotbar.index = reader.read(4) + inventory.hotbar.start
			}

			this.version = "Alpha " + [version >> 16, version >> 8 & 0xff, version & 0xff].join(".")

			const getIndex = [
				(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 0 & 7),
				(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 3 & 7),
				(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 0 & 7),
				(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 3 & 7),
				(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 6 & 7),
				(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 6 & 7)
			]

			if (reader.bit >= reader.data.length * 8 - 37) return // Empty save. We're done.

			let chunks = {}
			let previousChunk = null
			while (reader.bit < reader.data.length * 8 - 37) {
				let startPos = reader.bit
				let x = reader.read(16, true) * 8
				let y = reader.read(5, false) * 8
				let z = reader.read(16, true) * 8

				if (version > 0x800) {
					paletteLen = reader.read(9)
					paletteBits = BitArrayBuilder.bits(paletteLen)
					palette = []
					for (let i = 0; i < paletteLen; i++) palette.push(reader.read(16))
				}

				let orientation = reader.read(3)

				let cx = x >> 4
				let cz = z >> 4

				// Make them into local chunk coords
				x = x !== cx * 16 ? 8 : 0
				z = z !== cz * 16 ? 8 : 0

				let ckey = `${cx},${cz}`
				let chunk = chunks[ckey]
				if (!chunk) {
					if (previousChunk) previousChunk.endPos = startPos
					if (version >= 0x801) {
						chunks[ckey] = chunk = {
							reader,
							startPos,
							blocks: [],
							endPos: 0
						}
					}
					else chunks[ckey] = chunk = { blocks: [] }
					previousChunk = chunk
				}

				let runs = reader.read(8)
				let singles = reader.read(9)
				for (let j = 0; j < runs; j++) {
					let index = reader.read(9)
					let types = reader.read(9)
					let lenSize = reader.read(4)
					for (let k = 0; k < types; k++) {
						let chain = reader.read(lenSize) + 1
						let block = reader.read(paletteBits)
						for (let l = 0; l < chain; l++) {
							chunk.blocks[getIndex[orientation](index, x, y, z)] = palette[block]
							index++
						}
					}
				}
				for (let j = 0; j < singles; j++) {
					let index = reader.read(9)
					let block = reader.read(paletteBits)
					chunk.blocks[getIndex[orientation](index, x, y, z)] = palette[block]
				}
			}
			previousChunk.endPos = reader.bit

			this.loadFrom = chunks
		}
		loadOldSave(str) {
			this.rivers = false
			let data = str.split(";")

			this.name = data.shift()
			setSeed(parseInt(data.shift(), 36))

			let playerData = data.shift().split(",")
			p.x = parseInt(playerData[0], 36)
			p.y = parseInt(playerData[1], 36)
			p.z = parseInt(playerData[2], 36)
			p.rx = parseInt(playerData[3], 36) / 100
			p.ry = parseInt(playerData[4], 36) / 100
			let options = parseInt(playerData[5], 36)
			p.flying = options & 1
			p.spectator = options >> 2 & 1
			superflat = options >> 1 & 1
			caves = options >> 3 & 1
			details = options >> 4 & 1

			let version = data.shift()
			this.version = version

			let palette = data.shift().split(",").map(n => parseInt(n, 36))
			let chunks = {}

			for (let i = 0; data.length; i++) {
				let blocks = data.shift().split(",")
				let cx = parseInt(blocks.shift(), 36)
				let cy = parseInt(blocks.shift(), 36)
				let cz = parseInt(blocks.shift(), 36)
				let str = `${cx},${cz}`
				if (!chunks[str]) chunks[str] = { blocks: [] }
				let chunk = chunks[str].blocks
				for (let j = 0; j < blocks.length; j++) {
					let block = parseInt(blocks[j], 36)
					// Old index was 0xXYZ, new index is 0xYYXZ
					let x = block >> 8 & 15
					let y = block >> 4 & 15
					let z = block & 15
					let index = (cy * 16 + y) * 256 + x * 16 + z
					let pid = block >> 12

					chunk[index] = palette[pid]
				}
			}

			this.loadFrom = chunks
			// this.loadKeys = Object.keys(chunks)
		}
	}

	let controls = function() {
		move.x = 0
		move.z = 0

		if(controlMap.walkForwards.pressed) move.z += p.speed
		if(controlMap.walkBackwards.pressed) move.z -= p.speed
		if(controlMap.strafeLeft.pressed) move.x += p.speed
		if(controlMap.strafeRight.pressed) move.x -= p.speed
		if (p.flying) {
			if(controlMap.jump.pressed) p.velocity.y += 0.1
			if(controlMap.sneak.pressed) p.velocity.y -= 0.1
		}
		if(Key.ArrowLeft) p.ry -= 0.15
		if(Key.ArrowRight) p.ry += 0.15
		if(Key.ArrowUp) p.rx += 0.15
		if(Key.ArrowDown) p.rx -= 0.15

		if (!p.sprinting && controlMap.sprint.pressed && !p.sneaking && controlMap.walkForwards.pressed) {
			p.FOV(settings.fov + 10, 250)
			p.sprinting = true
		}

		if(p.sprinting) {
			move.x *= p.sprintSpeed
			move.z *= p.sprintSpeed
		}
		if(p.flying) {
			move.x *= p.flySpeed
			move.z *= p.flySpeed
		}
		if (!move.x && !move.z) {
			if (p.sprinting) {
				p.FOV(settings.fov, 100)
			}
			p.sprinting = false
		}
		else if(abs(move.x) > 0 && abs(move.z) > 0) {
			move.x *= move.ang
			move.z *= move.ang
		}

		// Update the velocity
		let co = cos(p.ry)
		let si = sin(p.ry)
		let friction = p.onGround ? 1 : 0.3
		p.velocity.x += (co * move.x - si * move.z) * friction
		p.velocity.z += (si * move.x + co * move.z) * friction

		const TAU = Math.PI * 2
		const PI1_2 = Math.PI / 2
		while(p.ry > TAU) p.ry -= TAU
		while(p.ry < 0)   p.ry += TAU
		if(p.rx > PI1_2)  p.rx = PI1_2
		if(p.rx < -PI1_2) p.rx = -PI1_2
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
		draw() {
			if (!this.scenes.includes(screen)) {
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
		click() {
			if (!mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
				let current = (mouseX - this.x + this.w / 2) / this.w
				if (current < 0) current = 0
				if (current > 1) current = 1
				this.sliding = true
				settings[this.name] = current * (this.max - this.min) + this.min
				this.callback(current * (this.max - this.min) + this.min)
				this.draw()
			}
		}
		drag() {
			if (!this.sliding || !this.scenes.includes(screen)) {
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

		mouseIsOver() {
			return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2
		}
		draw() {
			if (!this.scenes.includes(screen)) {
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
			if (this.disabled() || !mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (this.mouseIsOver()) {
				this.index = (this.index + 1) % this.labels.length
				this.callback(this.labels[this.index])
				return true
			}
		}

		static draw() {
			if (screen !== "inventory" && screen !== "play") hoverbox.classList.add("hidden")
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

	function initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true
		let survival = false

		// Main menu buttons
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "main menu", () => {
			initWorldsMenu()
			changeScene("loadsave menu")
		})
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "main menu", () => {
			changeScene("multiplayer menu")
			initMultiplayerMenu()
		}, () => !location.href.startsWith("https://willard.fun"), "Please visit https://willard.fun/login to enjoy multiplayer.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "main menu", () => changeScene("options"))
		if (height <= 600) {
			Button.add(width / 2, height / 2 + 145, 400, 40, "Full Screen", "main menu", () => {
				const w = window.open(null)
				w.document.write(document.children[0].outerHTML)
			})
		}

		// Creation menu buttons
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creation menu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Terrain Details: On", "Terrain Details: Off"], "creation menu", r => details = r === "Terrain Details: On", function() {
			if (superflat) {
				this.index = 1
				details = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creation menu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		Button.add(width / 2, 285, 300, 40, ["Game Mode: Creative", "Game Mode: Survival"], "creation menu", r => survival = r === "Game Mode: Survival")
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creation menu", nothing, always, "Ender dragon blocks? Maybe? Hmmmmmmmmmm...")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creation menu", () => {
			if (survival) {
				alert("Lol no.")
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
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creation menu", () => changeScene(previousScreen))

		// Loadsave menu buttons
		const selected = () => !selectedWorld || !worlds[selectedWorld]
		let w4 = min(width / 4 - 10, 220)
		let x4 = w4 / 2 + 5
		let w2 = min(width / 2 - 10, 450)
		let x2 = w2 / 2 + 5
		let mid = width / 2
		Button.add(mid - 3 * x4, height - 30, w4, 40, "Edit", "loadsave menu", () => changeScene("editworld"), () => selected() || !worlds[selectedWorld].edited)
		Button.add(mid - x4, height - 30, w4, 40, "Delete", "loadsave menu", () => {
			if (worlds[selectedWorld] && confirm(`Are you sure you want to delete ${worlds[selectedWorld].name}? This will also delete it from the cloud.`)) {
				deleteFromDB(selectedWorld)
				win.worlds.removeChild(document.getElementById(selectedWorld))
				delete worlds[selectedWorld]
				if (location.href.startsWith("https://willard.fun/")) fetch(`https://willard.fun/minekhan/saves/${selectedWorld}`, { method: "DELETE" })
				selectedWorld = 0
			}
		}, () => selected() || !worlds[selectedWorld].edited, "Delete the world forever.")
		Button.add(mid + x4, height - 30, w4, 40, "Export", "loadsave menu", () => {
			boxCenterTop.value = worlds[selectedWorld].code
		}, selected, "Export the save code into the text box above for copy/paste.")
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "loadsave menu", () => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "loadsave menu", async () => {
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
		Button.add(mid + x2, height - 75, w2, 40, "Create New World", "loadsave menu", () => changeScene("creation menu"))

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
				w.name = boxCenterTop.value.slice(0, 256)
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
				changeScene("loadsave menu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", () => changeScene(previousScreen))

		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", () => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, () => !!multiplayer && !multiplayer.host, () => `Save the world to your browser + account. Doesn't work in incognito.\n\nLast saved ${timeString(now - world.edited)}.`)
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
			changeScene("main menu")
			world = null
		})

		// Comingsoon menu buttons
		Button.add(width / 2, 395, width / 3, 40, "Back", "comingsoon menu", () => changeScene(previousScreen))

		// Multiplayer buttons
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "multiplayer menu", () => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "multiplayer menu", () => {
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
		Button.add(width / 2, optionsBottom, width / 3, 40, "Back", "options", () => changeScene(previousScreen))
	}

	function hotbar() {
		if (screen !== "play") return
		// The selected block has changed. Update lantern brightness
		{
			let heldLight = blockData[holding].lightLevel / 15 || 0
			gl.useProgram(program3D)
			gl.uniform1f(glCache.uLantern, heldLight)
			gl.useProgram(program3DFogless)
			gl.uniform1f(glCache.uLanternFogless, heldLight)
		}
	}

	function crosshair() {
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

	let debugLines = []
	let newDebugLines = []
	function hud(clear) {
		if (p.spectator || screen !== "play") return
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

		// "Block light (head): " + world.getLight(p2.x, p2.y, p2.z, 1) + "\n"
		// + "Sky light (head): " + world.getLight(p2.x, p2.y, p2.z, 0) + "\n"

		// let str = "Average Frame Time: " + analytics.displayedFrameTime + "ms\n"
		// + "Worst Frame Time: " + analytics.displayedwFrameTime + "ms\n"
		// + "Render Time: " + analytics.displayedRenderTime + "ms\n"
		// + "Tick Time: " + analytics.displayedTickTime + "ms\n"
		// + "Rendered Chunks: " + renderedChunks.toLocaleString() + " / " + world.sortedChunks.length + "\n"
		// + "Generated Chunks: " + generatedChunks.toLocaleString() + "\n"
		// + "FPS: " + analytics.fps

		// if (p.autoBreak) {
		// 	text("Super breaker enabled", 5, height - 89, 12)
		// }
		// if (p.autoBuild) {
		// 	text("Hyper builder enabled", 5, height - 101, 12)
		// }

		// ctx.textAlign = 'right'
		// text(p2.x + ", " + p2.y + ", " + p2.z, width - 10, 15, 0)
		// ctx.textAlign = 'left'
		// text(str, 5, height - 77, 12)
	}
	let sortedBlocks = Object.entries(blockIds)
	sortedBlocks.shift() // Get rid of the air block in the array of sorted blocks
	sortedBlocks.sort()

	function clickInv() {
		inventory.heldItem = null
		document.getElementById("heldItem")?.classList.add("hidden")
	}

	let unpauseDelay = 0
	function mmoved(e) {
		let mouseS = settings.mouseSense / 30000
		p.rx -= e.movementY * mouseS
		p.ry += e.movementX * mouseS

		while(p.ry > Math.PI*2) {
			p.ry -= Math.PI*2
		}
		while(p.ry < 0) {
			p.ry += Math.PI*2
		}
		if(p.rx > Math.PI / 2) {
			p.rx = Math.PI / 2
		}
		if(p.rx < -Math.PI / 2) {
			p.rx = -Math.PI / 2
		}
	}
	function trackMouse(e) {
		if (screen !== "play") {
			cursor("")
			mouseX = e.x
			mouseY = e.y
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
			Slider.drag()
		}
		if (screen === "inventory") {
			const heldItemCanvas = document.getElementById("heldItem")
			heldItemCanvas.style.left = (event.x - inventory.iconSize / 2 | 0) + "px"
			heldItemCanvas.style.top = (event.y - inventory.iconSize / 2 | 0) + "px"
		}
	}

	// For user controls that react immediately in the event handlers.
	function controlEvent(name, event) {
		if(screen === "play") {
			if (document.pointerLockElement !== canvas) {
				getPointer()
				p.lastBreak = now
			}
			else {
				if (name === controlMap.breakBlock.key) {
					changeWorldBlock(0)
				}

				if(name === controlMap.placeBlock.key && holding) {
					newWorldBlock()
				}

				if (name === controlMap.pickBlock.key && hitBox.pos) {
					let block = world.getBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2]) & 0x3ff
					inventory.hotbar.pickBlock(block)
					holding = inventory.hotbar.hand.id
					hotbar()
				}

				if(name === controlMap.pause.key) {
					releasePointer()
					changeScene("pause")
				}

				if (name === controlMap.openChat.key) {
					event.preventDefault()
					changeScene("chat")
				}
				if (name === "Slash") {
					changeScene("chat")
					chatInput.value = "/"
				}

				if(name === controlMap.superBreaker.key) {
					p.autoBreak = !p.autoBreak
					hud()
				}

				if(name === controlMap.hyperBuilder.key) {
					p.autoBuild = !p.autoBuild
					hud()
				}

				if (name === controlMap.jump.key && !p.spectator) {
					if (now < p.lastJump + 400) {
						p.flying = !p.flying
					}
					else {
						p.lastJump = now
					}
				}

				if (name === controlMap.zoom.key) {
					p.FOV(10, 300)
				}

				if (name === controlMap.sneak.key && !p.flying) {
					p.sneaking = true
					if (p.sprinting) {
						p.FOV(settings.fov, 100)
					}
					p.sprinting = false
					p.speed = 0.05
					p.bottomH = 1.32
				}

				if (name === controlMap.toggleSpectator.key) {
					p.spectator = !p.spectator
					p.flying = true
					p.onGround = false
					if (!p.spectator) {
						hotbar()
						crosshair()
						hud(true)
					}
					else {
						ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
					}
				}

				if (name === controlMap.openInventory.key) {
					changeScene("inventory")
					releasePointer()
				}

				if (name === "Semicolon") {
					releasePointer()
					freezeFrame = now + 500
				}

				if (name === "F3") {
					settings.showDebug = (settings.showDebug + 1) % 3
					hud()
				}

				// Drop held item; this just crashes since I broke Item entities.
				// if (name === controlMap.dropItem.key) {
				// 	let d = p.direction
				// 	world.entities.push(new Item(p.x, p.y, p.z, d.x/4, d.y/4, d.z/4, holding || inventory.hotbar[inventory.hotbarSlot], glExtensions, gl, glCache, indexBuffer, world, p))
				// }
			}
		}
		else if (screen === "pause" && name === controlMap.pause.key) {
			play()
		}
		else if (screen === "inventory") {
			if (name === "leftMouse") {
				clickInv()
			}
			if (name === controlMap.openInventory.key) {
				play()
			}
		}
	}
	document.onmousemove = trackMouse
	document.onpointerlockchange = function() {
		if (document.pointerLockElement === canvas) {
			document.onmousemove = mmoved
		}
		else {
			document.onmousemove = trackMouse
			if (screen === "play" && now > freezeFrame) {
				changeScene("pause")
				unpauseDelay = now + 500
			}
		}
		for (let key in Key) {
			Key[key] = false
		}
	}
	canvas.onmousedown = function(e) {
		mouseX = e.x
		mouseY = e.y
		mouseDown = true
		let name
		switch(e.button) {
			case 0:
				if (Key.ControlRight || Key.ControlLeft) name = "rightMouse"
				else name = "leftMouse"
				break
			case 1:
				name = "middleMouse"
				break
			case 2:
				name = "rightMouse"
				break
		}
		Key[name] = true
		controlEvent(name)

		Button.click()
		Slider.click()
	}
	canvas.onmouseup = function(e) {
		let name
		switch(e.button) {
			case 0:
				if (Key.ControlRight || Key.ControlLeft) name = "rightMouse"
				else name = "leftMouse"
				break
			case 1:
				name = "middleMouse"
				break
			case 2:
				name = "rightMouse"
				break
		}
		Key[name] = false
		mouseDown = false
		Slider.release()
	}
	canvas.onkeydown = function(e) {
		let code = e.code
		// code === "Space" || code === "ArrowDown" || code === "ArrowUp" || code === "F3") {
		if (!Key.ControlLeft && !Key.ControlRight && code !== "F12" && code !== "F11") {
			e.preventDefault()
		}
		if (e.repeat || Key[code]) {
			return
		}
		Key[code] = true

		controlEvent(code, e)

		if (screen === "play" && Number(e.key)) {
			inventory.hotbar.setPosition(e.key - 1)
			holding = inventory.hotbar.hand.id
			hotbar()
		}
	}
	canvas.onkeyup = function(e) {
		Key[e.code] = false
		if(e.code === "Escape" && (screen === "chat" || screen === "pause" || screen === "inventory" || screen === "options" && previousScreen === "pause") && now > unpauseDelay) {
			play()
		}
		if (screen === "play") {
			if (e.code === controlMap.zoom.key) {
				p.FOV(settings.fov, 300)
			}

			if (e.code === controlMap.sneak.key && p.sneaking) {
				p.sneaking = false
				p.speed = 0.11
				p.bottomH = 1.62
			}
		}
	}
	canvas.onblur = function() {
		for (let key in Key) {
			Key[key] = false
		}
		mouseDown = false
		Slider.release()
	}
	canvas.oncontextmenu = function(e) {
		e.preventDefault()
	}
	win.onbeforeunload = e => {
		if (screen === "play" && Key.control) {
			releasePointer()
			e.preventDefault()
			e.returnValue = "Q is the sprint button; Ctrl + W closes the page."
			return true
		}
	}
	canvas.onwheel = e => {
		e.preventDefault()
		e.stopPropagation()
		if (screen === "play") {
			inventory.hotbar.shiftPosition(e.deltaY)
			holding = inventory.hotbar.hand.id
			hotbar()
		}
	}
	document.onwheel = () => {} // Shouldn't do anything, but it helps with a Khan Academy bug somewhat
	win.onresize = () => {
		width = win.innerWidth
		height = win.innerHeight
		canvas.height = height
		canvas.width = width
		if (!gl) return
		gl.canvas.height = height
		gl.canvas.width = width
		gl.viewport(0, 0, width, height)
		initButtons()
		initDirt()
		inventory.size = min(width, height) / 15 | 0
		use3d()
		p.FOV(p.currentFov + 0.0001)

		if (screen === "play") {
			play()
		}
		else {
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
		}
	}
	chatInput.oninput = () => {
		if (chatInput.value.length > 512) chatInput.value = chatInput.value.slice(0, 512)
	}
	chatInput.onkeydown = e => e.key === "Tab" ? e.preventDefault() : 0
	chatInput.onkeyup = e => {
		if (e.key === "Enter") {
			let msg = chatInput.value.trim()
			if (msg) {
				e.preventDefault()
				e.stopPropagation()
				if (msg.startsWith("/")) {
					sendCommand(msg)
				}
				else {
					sendChat(msg)
				}
				chatInput.value = ""
			}
			else {
				play()
			}
		}
		else {
			let msg = chatInput.value
			if (msg.startsWith("/")) {
				let words = msg.split(" ")
				if (words.length > 1) {
					let cmd = words[0].slice(1)
					if (commands.has(cmd)) commands.get(cmd).autocomplete(msg)
				}
				else {
					let possible = commandList.filter(name => name.startsWith(msg))
					if (possible.length === 1) commands.get(possible[0].slice(1)).autocomplete(msg)
					else setAutocomplete(commandList)
				}
			}
		}
	}

	document.onkeyup = e => {
		if (e.key === "Escape" && screen === "chat") {
			e.preventDefault()
			e.stopPropagation()
			chatInput.value = ""
			play()
		}
		else if (screen === "chat" && !chatInput.hasFocus) chatInput.focus()
	}

	let pTouch = { x: 0, y: 0 }
	canvas.addEventListener("touchstart", function(e) {
		pTouch.x = e.changedTouches[0].pageX
		pTouch.y = e.changedTouches[0].pageY
	}, false)
	canvas.addEventListener("touchmove", function(e) {
		e.movementY = e.changedTouches[0].pageY - pTouch.y
		e.movementX = e.changedTouches[0].pageX - pTouch.x
		pTouch.x = e.changedTouches[0].pageX
		pTouch.y = e.changedTouches[0].pageY
		mmoved(e)
		e.preventDefault()
	}, false)

	function use2d() {
		gl.disableVertexAttribArray(glCache.aSkylight)
		gl.disableVertexAttribArray(glCache.aBlocklight)
		gl.enableVertexAttribArray(glCache.aVertex2)
		gl.enableVertexAttribArray(glCache.aTexture2)
		gl.enableVertexAttribArray(glCache.aShadow2)
		gl.useProgram(program2D)
		gl.uniform2f(glCache.uOffset, 0, 0) // Remove offset from rendering icons
		gl.depthFunc(gl.ALWAYS)
	}
	function use3d() {
		gl.useProgram(program3D)
		gl.enableVertexAttribArray(glCache.aVertex)
		gl.enableVertexAttribArray(glCache.aTexture)
		gl.enableVertexAttribArray(glCache.aShadow)
		gl.enableVertexAttribArray(glCache.aSkylight)
		gl.enableVertexAttribArray(glCache.aBlocklight)
		gl.activeTexture(gl.TEXTURE0)
		// gl.depthFunc(gl.LESS)
	}

	const dirt = () => {
		ctx.clearRect(0, 0, width, height) // Don't draw over the beautful dirt

		use2d()
		gl.bindBuffer(gl.ARRAY_BUFFER, dirtBuffer)
		gl.uniform1i(glCache.uSampler2, 1) // Dirt texture
		gl.vertexAttribPointer(glCache.aVertex2, 2, gl.FLOAT, false, 20, 0)
		gl.vertexAttribPointer(glCache.aTexture2, 2, gl.FLOAT, false, 20, 8)
		gl.vertexAttribPointer(glCache.aShadow2, 1, gl.FLOAT, false, 20, 16)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	}
	function initDirt() {
		// Dirt background
		let aspect = width / height
		let stack = height / 96
		let bright = 0.4
		if (!dirtBuffer) dirtBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, dirtBuffer)
		let bgCoords = new Float32Array([
			-1, -1, 0, stack, bright,
			1, -1, stack * aspect, stack, bright,
			1, 1, stack * aspect, 0, bright,
			-1, 1, 0, 0, bright
		])
		gl.bufferData(gl.ARRAY_BUFFER, bgCoords, gl.STATIC_DRAW)
		dirt()
	}

	function startLoad() {
		dirt()
		world.loadChunks()
	}
	function initWebgl() {
		if (!win.gl) {
			let canv = document.getElementById("webgl-canvas")
			canv.width = ctx.canvas.width
			canv.height = ctx.canvas.height
			win.gl = gl = canv.getContext("webgl", { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false })
			if (!gl) {
				alert("Error: WebGL not detected. Please enable WebGL and/or \"hardware acceleration\" in your browser settings.")
				throw "Error: Cannot play a WebGL game without WebGL."
			}
			win.glExtensions = glExtensions = {
				"vertex_array_object": gl.getExtension("OES_vertex_array_object"),
				"element_index_uint": gl.getExtension("OES_element_index_uint")
			}
			if (!glExtensions.element_index_uint || !glExtensions.vertex_array_object) {
				alert("Unable to load WebGL extension. Please use a supported browser, or update your current browser.")
			}
			gl.viewport(0, 0, canv.width, canv.height)
			gl.enable(gl.DEPTH_TEST)
			gl.enable(gl.BLEND)
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

			win.glCache = glCache = {}
			program3D = createProgramObject(gl, vertexShaderSrc3D, fragmentShaderSrc3D)
			program3DFogless = createProgramObject(gl, foglessVertexShaderSrc3D, foglessFragmentShaderSrc3D)
			program2D = createProgramObject(gl, vertexShaderSrc2D, fragmentShaderSrc2D)
			programEntity = createProgramObject(gl, vertexShaderSrcEntity, fragmentShaderSrcEntity)
			skybox = getSkybox(gl, glCache, program3D, program3DFogless)

			gl.useProgram(program2D)
			glCache.uOffset = gl.getUniformLocation(program2D, "uOffset")
			glCache.uSampler2 = gl.getUniformLocation(program2D, "uSampler")
			glCache.aTexture2 = gl.getAttribLocation(program2D, "aTexture")
			glCache.aVertex2 = gl.getAttribLocation(program2D, "aVertex")
			glCache.aShadow2 = gl.getAttribLocation(program2D, "aShadow")

			gl.useProgram(programEntity)
			glCache.uSamplerEntity = gl.getUniformLocation(programEntity, "uSampler")
			glCache.uLightLevelEntity = gl.getUniformLocation(programEntity, "uLightLevel")
			glCache.uViewEntity = gl.getUniformLocation(programEntity, "uView")
			glCache.aTextureEntity = gl.getAttribLocation(programEntity, "aTexture")
			glCache.aVertexEntity = gl.getAttribLocation(programEntity, "aVertex")

			gl.useProgram(program3DFogless)
			glCache.uViewFogless = gl.getUniformLocation(program3DFogless, "uView")
			glCache.uSamplerFogless = gl.getUniformLocation(program3DFogless, "uSampler")
			glCache.uPosFogless = gl.getUniformLocation(program3DFogless, "uPos")
			glCache.uTimeFogless = gl.getUniformLocation(program3DFogless, "uTime")
			glCache.uTransFogless = gl.getUniformLocation(program3DFogless, "uTrans")
			glCache.uLanternFogless = gl.getUniformLocation(program3DFogless, "uLantern")

			gl.useProgram(program3D)
			glCache.uView = gl.getUniformLocation(program3D, "uView")
			glCache.uSampler = gl.getUniformLocation(program3D, "uSampler")
			glCache.uPos = gl.getUniformLocation(program3D, "uPos")
			glCache.uDist = gl.getUniformLocation(program3D, "uDist")
			glCache.uTime = gl.getUniformLocation(program3D, "uTime")
			glCache.uSky = gl.getUniformLocation(program3D, "uSky")
			glCache.uSun = gl.getUniformLocation(program3D, "uSun")
			glCache.uTrans = gl.getUniformLocation(program3D, "uTrans")
			glCache.uLantern = gl.getUniformLocation(program3D, "uLantern")
			glCache.aShadow = gl.getAttribLocation(program3D, "aShadow")
			glCache.aSkylight = gl.getAttribLocation(program3D, "aSkylight")
			glCache.aBlocklight = gl.getAttribLocation(program3D, "aBlocklight")
			glCache.aTexture = gl.getAttribLocation(program3D, "aTexture")
			glCache.aVertex = gl.getAttribLocation(program3D, "aVertex")

			win.glPrograms = { program2D, program3D, program3DFogless, programEntity, skybox }
		}
		else {
			({ gl, glCache, glExtensions } = win.gl);
			({ program2D, program3D, program3DFogless, programEntity, skybox } = win.glPrograms)
			document.getElementById("webgl-canvas").remove() // There can be 1
			document.body.prepend(gl.canvas)
		}

		modelView = new Float32Array(16)

		gl.uniform1f(glCache.uDist, 1000)
		gl.uniform1i(glCache.uTrans, 0)

		// Send the block textures to the GPU
		initTextures(gl, glCache)
		initShapes()

		// These buffers are only used for drawing the main menu blocks
		sideEdgeBuffers = {}
		for (let side in shapes.cube.verts) {
			let edgeBuffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapes.cube.verts[side][0]), gl.STATIC_DRAW)
			sideEdgeBuffers[side] = edgeBuffer
		}
		texCoordsBuffers = []
		for (let t in textureCoords) {
			let buff = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buff)
			gl.bufferData(gl.ARRAY_BUFFER, textureCoords[t], gl.STATIC_DRAW)
			texCoordsBuffers.push(buff)
		}

		// Bind the Vertex Array Object (VAO) that will be used to draw everything
		indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexOrder, gl.STATIC_DRAW)

		// Tell it not to render the insides of blocks
		gl.enable(gl.CULL_FACE)
		gl.cullFace(gl.BACK)

		gl.lineWidth(2)
		gl.enable(gl.POLYGON_OFFSET_FILL)
		gl.polygonOffset(1, 1)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
	}

	function initPlayer() {
		p = new Camera()
		p.speed = 0.11
		p.velocity = new PVector(0, 0, 0)
		// p.pos = new Float32Array(3)
		p.sprintSpeed = 1.5
		p.flySpeed = 3.75
		p.x = 8
		p.y = 0
		p.z = 8
		p.w = 3 / 8
		p.bottomH = 1.62
		p.topH = 0.18
		p.onGround = false
		p.jumpSpeed = 0.45
		p.sprinting = false
		p.maxYVelocity = 4.5
		p.gravityStrength = -0.091
		p.lastUpdate = performance.now()
		p.lastBreak = now
		p.lastPlace = now
		p.lastJump = now
		p.autoBreak = false
		p.autoBuild = false
		p.flying = false
		p.sneaking = false
		p.spectator = false

		win.player = p
		win.p2 = p2
	}

	function sanitize(text) {
		const el = document.createElement('div')
		el.textContent = text
		return el.innerHTML
	}

	function initWorldsMenu() {
		while (win.worlds.firstChild) {
			win.worlds.removeChild(win.worlds.firstChild)
		}
		selectedWorld = 0
		win.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		function addWorld(name, version, size, id, edited, cloud) {
			let div = document.createElement("div")
			div.className = "world"
			div.onclick = () => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + sanitize(name) + "</strong>" + br

			if (edited){
				let str = new Date(edited).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit"
				})
				div.innerHTML += str + br
			}
			div.innerHTML += version + br
			if (cloud) div.innerHTML += `Cloud Save (${size.toLocaleString()} bytes)`
			else div.innerHTML += `${size.toLocaleString()} bytes used`

			win.worlds.appendChild(div)
		}

		worlds = {}
		if (loadString) {
			try {
				let tempWorld = new World(true)
				tempWorld.loadSave(loadString)
				addWorld(`${tempWorld.name} (Pre-loaded)`, tempWorld.version, loadString.length, now)
				worlds[now] = {
					code: loadString,
					id: now
				}
			}
			catch(e) {
				console.log("Unable to load hardcoded save.")
				console.error(e)
			}
		}
		loadFromDB().then(async res => {
			if(res && res.length) {
				let index = res.findIndex(obj => obj.id === "settings")
				if (index >= 0) {
					Object.assign(settings, res[index].data) // Stored data overrides any hardcoded settings
					p.FOV(settings.fov)
					res.splice(index, 1)
				}
			}

			if (res && res.length) {
				res = res.map(d => d.data).filter(d => d && d.code).sort((a, b) => b.edited - a.edited)
				for (let data of res) {
					addWorld(data.name, data.version, data.code.length + 60, data.id, data.edited, false)
					data.cloud = false
					worlds[data.id] = data
				}
			}

			if (location.href.startsWith("https://willard.fun/")) {
				let cloudSaves = await fetch('https://willard.fun/minekhan/saves').then(res => res.json())
				if (Array.isArray(cloudSaves) && cloudSaves.length) {
					for (let data of cloudSaves) {
						if (worlds[data.id] && worlds[data.id].edited >= data.edited) continue

						addWorld(data.name, data.version, data.size + 60, data.id, data.edited, true)
						data.cloud = true
						worlds[data.id] = data
					}
				}
			}

			win.worlds.onclick = Button.draw
			win.boxCenterTop.onkeyup = Button.draw
		}).catch(e => console.error(e))

		superflat = false
		details = true
		caves = true
	}

	async function initMultiplayerMenu() {
		while (win.worlds.firstChild) {
			win.worlds.removeChild(win.worlds.firstChild)
		}
		selectedWorld = 0
		win.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		let servers = await getWorlds()

		function addWorld(name, host, online, id, version, password) {
			let div = document.createElement("div")
			div.className = "world"
			div.onclick = () => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + sanitize(name) + "</strong>" + br

			div.innerHTML += "Hosted by " + sanitize(host) + br
			const span = document.createElement("span")
			span.className = "online"
			span.textContent = online.toString()
			div.appendChild(span)
			div.innerHTML += " players online" + br
			div.innerHTML += version + br
			if (password) div.innerHTML += "Password-protected" + br

			win.worlds.appendChild(div)
		}

		worlds = {}

		for (let data of servers) {
			addWorld(data.name, data.host, data.online, data.target, data.version, !data.public)
			worlds[data.target] = data
		}
		win.worlds.onclick = Button.draw
		win.boxCenterTop.onkeyup = Button.draw

		let refresh = setInterval(async () => {
			if (screen !== "multiplayer menu") return clearInterval(refresh)
			let servers = await getWorlds()
			clear: for (let target in worlds) {
				for (let data of servers) if (data.target === target) continue clear
				document.getElementById(target).remove()
				delete worlds[target]
			}
			for (let data of servers) {
				if (!document.getElementById(data.target)) {
					addWorld(data.name, data.host, data.online, data.target, data.version, !data.public)
				}
				worlds[data.target] = data

				const element = document.getElementById(data.target)
				element.getElementsByClassName("online")[0].textContent = data.online.toString()
			}
		}, 5000)
	}

	function initEverything() {
		generatedChunks = 0

		initPlayer()
		initWebgl()

		if (win.location.origin === "https://www.kasandbox.org" && (loadString || document.children[0].innerHTML.length !== 314419)) {
			// This is only for KA, since forks that make it onto the hotlist get a lot of hate for "not giving credit".
			// If you're making significant changes and want to remove this, then you can.
			// If publishing this on another website, I'd encourage giving credit somewhere to avoid being accused of plagiarism.
			message.innerHTML = '.oot lanigiro eht tuo kcehc ot>rb<erus eb ,siht ekil uoy fI>rb<.dralliW yb >a/<nahKeniM>"wen_"=tegrat "8676731005517465/cm/sc/gro.ymedacanahk.www//:sptth"=ferh a< fo>rb<ffo-nips a si margorp sihT'.split("").reverse().join("")
		}

		genIcons() // Generate all the block icons
		initDirt()

		drawScreens[screen]()
		Button.draw()
		Slider.draw()

		p.FOV(settings.fov)
		initWorldsMenu()
		initButtons()

		inventory.size = min(width, height) / 15 | 0
		inventory.init(true)

		// See if a user followed a link here.
		var urlParams = new URLSearchParams(win.location.search)
		if (urlParams.has("target")) {
			changeScene("multiplayer menu")
			initMultiplayer(urlParams.get("target"))
		}

		if (win.tickid) win.clearTimeout(win.tickid)
		tickLoop()
	}

	// Define all the scene draw functions
	(function() {
		function title() {
			let title = "MINEKHAN"
			let subtext = "JAVASCRIPT EDITION"
			let font = "monospace"
			strokeWeight(1)
			ctx.textAlign = 'center'

			const scale = Math.min(width / 600, 1.5)
			for (let i = 0; i < 15; i++) {
				if (i < 12) {
					fill(i * 10)
				}
				else if (i > 11) {
					fill(125)
				}

				ctx.font = `bold ${80 * scale + i}px ${font}`
				text(title, width / 2, 158 - i)

				ctx.font = `bold ${32 * scale + i/4}px ${font}`
				text(subtext, width / 2, 140 + 60 * scale - i / 2)
			}
		}
		const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height)

		drawScreens["main menu"] = () => {
			ctx.clearRect(0, 0, width, height)
			title()
			fill(220)
			ctx.font = "20px monospace"
			ctx.textAlign = 'left'
			text("MineKhan " + version, width - (width - 2), height - 2)
		}

		drawScreens.play = () => {
			let renderStart = performance.now()
			p.setDirection()
			world.render()
			analytics.totalRenderTime += performance.now() - renderStart
		}

		drawScreens.loading = () => {
			// This is really stupid, but it basically works by teleporting the player around to each chunk I'd like to load.
			// If chunks loaded from a save aren't generated, they're deleted from the save, so this loads them all.

			let standing = true

			let cx = p.x >> 4
			let cz = p.z >> 4

			for (let x = cx - 1; x <= cx + 1; x++) {
				for (let z = cz - 1; z <= cz + 1; z++) {
					if (!world.getChunk(x * 16, z * 16).buffer) {
						standing = false
					}
				}
			}
			if (!standing) {
				world.tick()
			}
			else {
				play()
				if (p.y === 0 && !p.flying && !p.spectator) {
					p.y = world.getChunk(p.x|0, p.z|0).tops[(p.x & 15) * 16 + (p.z & 15)] + 2
				}
				return
			}

			let progress = round(100 * generatedChunks / 9)
			document.getElementById("loading-text").textContent = `Loading... ${progress}% complete (${generatedChunks} / 9)`
		}

		drawScreens.pause = () => {
			strokeWeight(1)
			clear()
		}

		drawScreens.options = () => {
			clear()
		}
		drawScreens["creation menu"] = () => {
			clear()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Create New World", width / 2, 20)
		}
		drawScreens["loadsave menu"] = () => {
			clear()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select World", width / 2, 20)
		}
		drawScreens.editworld = dirt
		drawScreens["multiplayer menu"] = () => {
			clear()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select Server", width / 2, 20)
		}
	})()

	// Give the font time to load and redraw the homescreen
	setTimeout(() => {
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}, 100)

	function tickLoop() {
		win.tickid = win.setTimeout(tickLoop, 50) // 20 TPS

		if (world && screen === "play") {
			let tickStart = performance.now()
			world.tick()
			analytics.ticks++
			analytics.totalTickTime += performance.now() - tickStart

			controls()
			runGravity()
			resolveContactsAndUpdatePosition()
		}
	}

	let prevTime = 0
	function renderLoop(time) {
		let frameFPS = Math.round(10000/(time - prevTime)) / 10
		prevTime = time

		if (!gl && window.innerWidth && window.innerHeight) initEverything()

		now = Date.now()
		let frameStart = performance.now()

		if (screen === "play" || screen === "loading") {
			try {
				drawScreens[screen]()
			}
			catch(e) {
				console.error(e)
			}
		}

		if (screen === "play" && now - analytics.lastUpdate > 500 && analytics.frames) {
			analytics.displayedTickTime = (analytics.totalTickTime / analytics.ticks).toFixed(1)
			analytics.displayedRenderTime = (analytics.totalRenderTime / analytics.frames).toFixed(1)
			analytics.displayedFrameTime = (analytics.totalFrameTime / analytics.frames).toFixed(1)
			analytics.fps = round(analytics.frames * 1000 / (now - analytics.lastUpdate))
			analytics.displayedwFrameTime = analytics.worstFrameTime.toFixed(1)
			analytics.displayedwFps = analytics.worstFps
			analytics.worstFps = 1000000
			analytics.frames = 0
			analytics.totalRenderTime = 0
			analytics.totalTickTime = 0
			analytics.ticks = 0
			analytics.totalFrameTime = 0
			analytics.worstFrameTime = 0
			analytics.lastUpdate = now
			hud()
		}

		analytics.frames++
		analytics.totalFrameTime += performance.now() - frameStart
		analytics.worstFrameTime = max(performance.now() - frameStart, analytics.worstFrameTime)
		analytics.worstFps = min(frameFPS, analytics.worstFps)
		win.raf = requestAnimationFrame(renderLoop)
	}
	return renderLoop
}

(async function() {
	if (win.raf) {
		win.cancelAnimationFrame(win.raf)
		console.log("Canceled", win.raf)
	}
	var init = await MineKhan()
	init()
})()
