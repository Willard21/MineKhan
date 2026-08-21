// 100% of WebGL code should be in this file. No buffers should be stored outside this context either.
// Ideally the design should make it easy to replace WebGL with WebGL2 or WebGPU by only changing this file.

import { cross, Matrix, Plane, PVector } from "./3Dutils"
import { game } from "./game"
import { skybox, gl, glExtensions, glLocations, program2D, program3D, program3DFogless, programEntity, bigArray, indexBuffer, hitboxBuffer } from "./3Dutils"

const { cos, sin } = Math

let vec1 = new PVector(), vec2 = new PVector(), vec3 = new PVector()

// Start by scaling up by 10
const defaultTransformation = new Matrix([-10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1])
class Camera {
	constructor(width, height) {
		this.width = width
		this.height = height
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
		this.defaultFov = game.settings.fov
		this.targetFov = game.settings.fov
		this.step = 0
		this.lastStep = 0
		this.projection = new Float32Array(4)
		this.tempMatrix = new Float32Array(16) // Returned from this.getMatrix()
		this.transformation = new Matrix()
		this.direction = { x: 1, y: 0, z: 0 } // Normalized direction vector
		this.frustum = [] // The 5 planes of the viewing frustum (there's no far plane)
		for (let i = 0; i < 5; i++) {
			this.frustum.push(new Plane(1, 0, 0))
		}
	}

	/** Set the Field of View (FOV) or set a FOV target to zoom to in `time` milliseconds */
	FOV(fov, time) {
		if (fov === this.currentFov) return

		const now = Date.now()
		if (!fov) {
			// We're animating the zoom; interpolate the fov
			fov = this.currentFov + this.step * (now - this.lastStep)
			this.lastStep = now

			// If we overshot our mark, set it to the target
			if (Math.sign(this.targetFov - this.currentFov) !== Math.sign(this.targetFov - fov)) {
				fov = this.targetFov
			}
		}
		else if (time) {
			// We're starting a zoom/unzoom animation
			this.targetFov = fov
			this.step = (fov - this.currentFov) / time
			this.lastStep = now
			return
		}
		else {
			// FOV changed in settings; just set it without animation
			this.targetFov = fov
		}

		const tang = Math.tan(fov * Math.PI / 360)
		const scale = 1 / tang
		const near = 1
		const far = 1000000
		this.currentFov = fov // Store the state of the projection matrix
		this.nearH = near * tang // This is needed for frustum culling

		this.projection[0] = scale / this.width * this.height
		this.projection[1] = scale
		this.projection[2] = -far / (far - near)
		this.projection[3] = -far * near / (far - near)
	}
	/** Interpolate the Camera position based on frame time, then set the transformation matrix */
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
	/** Multiply the projection and transformation matrices, transpose the results, and return it */
	getMatrix() {
		const proj = this.projection
		const view = this.transformation.elements
		const matrix = this.tempMatrix
		matrix[0]  = proj[0] * view[0]
		matrix[4]  = proj[0] * view[1]
		matrix[8]  = proj[0] * view[2]
		matrix[12] = proj[0] * view[3]
		matrix[1]  = proj[1] * view[4]
		matrix[5]  = proj[1] * view[5]
		matrix[9]  = proj[1] * view[6]
		matrix[13] = proj[1] * view[7]
		matrix[2]  = proj[2] * view[8] - view[12]
		matrix[6]  = proj[2] * view[9] - view[13]
		matrix[10] = proj[2] * view[10] - view[14]
		matrix[14] = proj[2] * view[11] - view[15]
		matrix[3]  = proj[3] * view[8]
		matrix[7]  = proj[3] * view[9]
		matrix[11] = proj[3] * view[10]
		matrix[15] = proj[3] * view[11]
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
		const cross = (v1, v2, result) => {
			result.x = v1.y * v2.z2 - v2.y2 * v1.z
			result.y = v1.z * v2.x2 - v2.z2 * v1.x
			result.z = v1.x * v2.y2 - v2.x2 * v1.y
		}

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
		aux.mult(-this.nearH * this.width / this.height)
		aux.add(dir)
		aux.normalize()
		cross(aux, Y, aux)
		this.frustum[3].set(aux.x, aux.y, aux.z)

		aux.set(X)
		aux.mult(this.nearH * this.width / this.height)
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
		// I commented this out during a refactor; probably need to fix later.
		const cx = this.x// - player.velx
		const cy = this.y// - player.vely
		const cz = this.z// - player.velz
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
	}
}
class Renderer {
	constructor() {
		this.width = window.parent.innerWidth
		this.height = window.parent.innerHeight
		this.camera = new Camera(this.width, this.height)

		this.dirtBuffer = null
	}
	use2d() {
		gl.disableVertexAttribArray(glLocations.aSkylight)
		gl.disableVertexAttribArray(glLocations.aBlocklight)
		gl.enableVertexAttribArray(glLocations.aVertex2)
		gl.enableVertexAttribArray(glLocations.aTexture2)
		gl.enableVertexAttribArray(glLocations.aShadow2)
		gl.useProgram(program2D)
		gl.uniform2f(glLocations.uOffset, 0, 0) // Remove offset from rendering icons
		gl.depthFunc(gl.ALWAYS)
	}
	use3d() {
		gl.useProgram(program3D)
		gl.enableVertexAttribArray(glLocations.aVertex)
		gl.enableVertexAttribArray(glLocations.aTexture)
		gl.enableVertexAttribArray(glLocations.aShadow)
		gl.enableVertexAttribArray(glLocations.aSkylight)
		gl.enableVertexAttribArray(glLocations.aBlocklight)
		gl.activeTexture(gl.TEXTURE0)
	}
	dirt(ctx) {
		// Draw dirt background
		ctx.clearRect(0, 0, this.width, this.height) // Don't draw over the beautful dirt

		this.use2d()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.dirtBuffer)
		gl.uniform1i(glLocations.uSampler2, 1) // Dirt texture
		gl.vertexAttribPointer(glLocations.aVertex2, 2, gl.FLOAT, false, 20, 0)
		gl.vertexAttribPointer(glLocations.aTexture2, 2, gl.FLOAT, false, 20, 8)
		gl.vertexAttribPointer(glLocations.aShadow2, 1, gl.FLOAT, false, 20, 16)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	}
	initDirt() {
		// Create dirt background; has to be re-initialized on resize
		const aspect = this.width / this.height
		const stack = this.height / 96
		const bright = 0.4
		if (!this.dirtBuffer) this.dirtBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.dirtBuffer)
		let bgCoords = new Float32Array([
			-1, -1, 0, stack, bright,
			1, -1, stack * aspect, stack, bright,
			1, 1, stack * aspect, 0, bright,
			-1, 1, 0, 0, bright
		])
		gl.bufferData(gl.ARRAY_BUFFER, bgCoords, gl.STATIC_DRAW)
		this.dirt()
	}
	initModelView() {
		const { camera } = this
		camera.transform()
		const matrix = camera.getMatrix()

		gl.useProgram(program3DFogless)
		gl.uniformMatrix4fv(glLocations.uViewFogless, false, matrix)

		gl.useProgram(program3D)
		gl.uniformMatrix4fv(glLocations.uView, false, matrix)
	}

	/**
	 * @param {{ buffer: WebGLBuffer }} hitbox player.target
	 */
	drawHitbox(hitbox) {
		const { camera } = this

		// Get the transformation matrix in position
		const [x, y, z] = hitbox.pos
		camera.transformation.translate(x, y, z)
		// camera.transformation.elements[15] -= 1
		gl.useProgram(program3DFogless)
		gl.uniformMatrix4fv(glLocations.uViewFogless, false, camera.getMatrix())
		camera.transformation.translate(-x, -y, -z)

		// Bind texture buffer with black texture
		gl.bindBuffer(gl.ARRAY_BUFFER, hitboxBuffer)
		gl.vertexAttribPointer(glLocations.aTexture, 2, gl.FLOAT, false, 0, 0)

		// Bind vertex buffer with the shape of the targeted block
		gl.bindBuffer(gl.ARRAY_BUFFER, hitbox.shape.buffer)
		gl.vertexAttribPointer(glLocations.aVertex, 3, gl.FLOAT, false, 0, 0)
		gl.disableVertexAttribArray(glLocations.aSkylight)
		gl.disableVertexAttribArray(glLocations.aBlocklight)
		gl.disableVertexAttribArray(glLocations.aShadow)

		// Avoid Z-fighting on the outline since it overlaps the block
		gl.uniform1f(glLocations.uZoffset, -0.0005)

		// Draw lines around 1 face at a time to avoid drawing triangles
		for (let i = 0; i < hitbox.shape.size; i++) {
			gl.drawArrays(gl.LINE_LOOP, i * 4, 4)
		}
		gl.uniform1f(glLocations.uZoffset, 0)
	}

	genIcons(blockData, shapes, ctx) {
		let start = Date.now()

		let shadows = [1, 1, 0.4, 0.4, 0.7, 0.7]

		this.use2d()
		gl.depthFunc(gl.LESS)
		gl.uniform1i(glLocations.uSampler2, 0)

		const blocks = blockData.filter(block => block.iconImg)
		const limitX = gl.canvas.width >> 6
		const limitY = gl.canvas.height >> 6
		const limit = limitX * limitY
		const total = blocks.length
		const pages = Math.ceil(total / limit)

		const mat = new Matrix()
		mat.identity()
		mat.scale(70 / this.width, 70 / this.height, -1)
		mat.rotX(Math.PI / 4)
		mat.rotY(Math.PI / 4)

		mat.transpose()
		gl.uniformMatrix4fv(glLocations.uView2, false, mat.elements)

		// Draw as many icons as possible on a canvas the size of the screen, then clear it and continue
		for (let i = 0; i < pages; i++) {

			// Draw icons to the WebGL canvas
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			for (let j = 0; j < limit && i * limit + j < total; j++) {
				const block = blocks[j + i * limit]
				const x = (j % limitX * 128 + 64) / this.width - 1
				const y = 1 - ((j / limitX | 0) * 128 + 64) / this.height

				gl.uniform2f(glLocations.uOffset, x, y)

				const shape = block.shape === shapes.fence ? shapes.fence.variants[3] : block.shape

				// Coordinates
				gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer)
				gl.vertexAttribPointer(glLocations.aVertex2, 3, gl.FLOAT, false, 12, 0)

				// Textures
				const texture = []
				const shade = []

				for (let i = 0; i < shape.texVerts.length; i++) { // Direction index
					for (let j = 0; j < shape.texVerts[i].length; j++) { // Face index for the direction
						for (let k = 0; k < 8; k++) { // x,y pairs of the 4 corners
							texture.push(shape.texVerts[i][j][k] + block.textures[i][k & 1])
						}
						shade.push(shadows[i], shadows[i], shadows[i], shadows[i])
					}
				}
				const texBuffer = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW)
				gl.vertexAttribPointer(glLocations.aTexture2, 2, gl.FLOAT, false, 8, 0)

				// Shading
				const shadeBuffer = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, shadeBuffer)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shade), gl.STATIC_DRAW)
				gl.vertexAttribPointer(glLocations.aShadow2, 1, gl.FLOAT, false, 4, 0)

				// These shapes are too small when scaled for full blocks
				if (shape === shapes.lantern || shape === shapes.flower) {
					mat.transpose()
					mat.scale(19/10)
					mat.transpose()
					gl.uniformMatrix4fv(glLocations.uView2, false, mat.elements)
				}

				// Index buffer and draw
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
				gl.drawElements(gl.TRIANGLES, 6 * shade.length / 4, gl.UNSIGNED_INT, 0)

				// Free GPU memory
				gl.deleteBuffer(shadeBuffer)
				gl.deleteBuffer(texBuffer)

				if (shape === shapes.lantern || shape === shapes.flower) {
					mat.transpose()
					mat.scale(10/19)
					mat.transpose()
					gl.uniformMatrix4fv(glLocations.uView2, false, mat.elements)
				}
			}

			// WebGL canvas is full, now copy it onto the 2D canvas
			ctx.clearRect(0, 0, this.width, this.height)
			ctx.drawImage(gl.canvas, 0, 0)

			// Now copy all the icons from the big 2D canvas to the little icon canvases
			for (let j = 0; j < limit && i * limit + j < total; j++) {
				const block = blocks[i * limit + j]
				const x = j % limitX
				const y = j / limitX | 0
				const c = block.iconImg.getContext("2d")
				c.drawImage(ctx.canvas, x * 64, y * 64, 64, 64, 0, 0, 64, 64)
			}
		}
		console.log("Block icons drawn and extracted in:", Date.now() - start, "ms")
	}

	/** @param {number} lightLevel */
	hotbarUpdated(lightLevel) {
		// The selected block has changed. Update lantern brightness
		const heldLight = lightLevel / 15
		gl.useProgram(program3D)
		gl.uniform1f(glLocations.uLantern, heldLight)
		gl.useProgram(program3DFogless)
		gl.uniform1f(glLocations.uLanternFogless, heldLight)
	}
}

export { Renderer }