import { blockData } from "./blockData.js"
import { roundBits } from "./utils.js"
import { Matrix } from "./3Dutils.js"
import { textureAtlas } from "./texture.js"

const { round, floor, ceil, cos, min, max } = Math

class Contacts {
	constructor() {
		this.array = []
		this.size = 0
	}
	add(x, y, z, block) {
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
	}
	clear() {
		this.size = 0
	}
}

class Entity {
	constructor(x, y, z, pitch, yaw, velx, vely, velz, width, height, depth, vertices, texture, faces, despawns, glExtensions, gl, glCache, indexBuffer, world, p) {
		this.x = x
		this.y = y
		this.z = z
		this.previousX = x
		this.previousY = y
		this.previousZ = z
		this.canStepX = true
		this.canStepY = true
		this.pitch = pitch
		this.yaw = yaw
		this.velx = velx
		this.vely = vely
		this.velz = velz
		this.width = width
		this.height = height
		this.depth = depth
		this.contacts = new Contacts()
		this.lastUpdate = performance.now()
		this.onGround = false
		this.despawns = despawns
		this.spawn = this.lastUpdate
		this.canDespawn = false
		this.faces = faces
		this.vao = glExtensions.vertex_array_object.createVertexArrayOES()
		const verticesBuffer = gl.createBuffer()
		const textureBuffer = gl.createBuffer()
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
		gl.vertexAttribPointer(glCache.aVertexEntity, 3, gl.FLOAT, false, 0, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, texture, gl.STATIC_DRAW)
		gl.vertexAttribPointer(glCache.aTextureEntity, 2, gl.FLOAT, false, 0, 0)

		gl.enableVertexAttribArray(glCache.aVertexEntity)
		gl.enableVertexAttribArray(glCache.aTextureEntity)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
		this.glExtensions = glExtensions
		this.gl = gl
		this.glCache = glCache
		this.indexBuffer = indexBuffer
		this.world = world
		this.p = p
	}
	updateVelocity(now) {
		let dt = (now - this.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt
		// this.vely += -0.02 * dt
		if (this.vely < -1.5) {
			this.vely = -1.5
		}

		this.velz += (this.velz * 0.9 - this.velz) * dt
		this.velx += (this.velx * 0.9 - this.velx) * dt
		// this.vely += (this.vely * 0.9 - this.vely) * dt
	}
	collided(x, y, z, vx, vy, vz, block) {
		let verts = blockData[block].shape.verts
		let px = roundBits(this.x - this.width / 2 - x)
		let py = roundBits(this.y - this.height / 2 - y)
		let pz = roundBits(this.z - this.depth / 2 - z)
		let pxx = roundBits(this.x + this.width / 2 - x)
		let pyy = roundBits(this.y + this.height / 2 - y)
		let pzz = roundBits(this.z + this.depth / 2 - z)
		let minX, minY, minZ, maxX, maxY, maxZ, min, max

		//Top and bottom faces
		let faces = verts[0]
		if (vy <= 0) {
			faces = verts[1]
		}
		if (!vx && !vz) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				if (face[1] > py && face[1] < pyy && minX < pxx && maxX > px && minZ < pzz && maxZ > pz) {
					if (vy <= 0) {
						this.onGround = true
						this.y = round((face[1] + y + this.height / 2) * 10000) / 10000
						this.vely = 0
						return false
					}
					else {
						return true
					}
				}
			}
			return false
		}

		//West and East faces
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
					if (maxY - py > 0.5) {
						this.canStepX = false
					}
					col = true
				}
			}
			return col
		}

		//South and North faces
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
					if (maxY - py > 0.5) {
						this.canStepZ = false
					}
					col = true
				}
			}
			return col
		}
	}
	move(now) {
		const { world } = this
		let pminX = floor(this.x - this.width / 2)
		let pmaxX = ceil(this.x + this.width / 2)
		let pminY = floor(this.y - this.height / 2)
		let pmaxY = ceil(this.y + this.height / 2)
		let pminZ = floor(this.z - this.depth / 2)
		let pmaxZ = ceil(this.z + this.depth / 2)
		let block = null

		for (let x = pminX; x <= pmaxX; x++) {
			for (let y = pminY; y <= pmaxY; y++) {
				for (let z = pminZ; z <= pmaxZ; z++) {
					let block = world.getBlock(x, y, z)
					if (block) {
						this.contacts.add(x, y, z, block)
					}
				}
			}
		}
		let dt = (now - this.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt

		this.previousX = this.x
		this.previousY = this.y
		this.previousZ = this.z

		this.canStepX = false
		this.canStepY = false
		this.onGround = false
		//Check collisions in the Y direction
		this.y += this.vely * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], 0, this.vely, 0, block[3])) {
				this.y = this.previousY
				this.vely = 0
				break
			}
		}

		if (this.y === this.previousY) {
			this.canStepX = true
			this.canStepZ = true
		}

		//Check collisions in the X direction
		this.x += this.velx * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], this.velx, 0, 0, block[3])) {
				if (this.canStepX && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				this.x = this.previousX
				this.velx = 0
				break
			}
		}

		//Check collisions in the Z direction
		this.z += this.velz * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], 0, 0, this.velz, block[3])) {
				if (this.canStepZ && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				this.z = this.previousZ
				this.velz = 0
				break
			}
		}

		this.lastUpdate = now
		this.contacts.clear()
	}
	update() {
		let now = performance.now()
		this.updateVelocity(now)
		this.move(now)
		if (now - this.spawn > this.despawns) {
			this.canDespawn = true
		}
	}
	render() {
		const { gl, world, glCache, glExtensions, p } = this
		const offsetY = -0.1 * cos((performance.now() - this.spawn) * 0.0015) + 0.15
		const modelMatrix = new Matrix();
		modelMatrix.identity()
		modelMatrix.translate(this.x, this.y + offsetY, this.z)
		modelMatrix.rotX(this.pitch)
		modelMatrix.rotY(this.yaw)
		modelMatrix.scale(this.width, this.height, this.depth)
		const viewMatrix = p.transformation.elements
		const proj = p.projection
		const projectionMatrix = [proj[0], 0, 0, 0, 0, proj[1], 0, 0, 0, 0, proj[2], proj[3], 0, 0, proj[4], 0]
		const modelViewProjectionMatrix = new Matrix()
		modelViewProjectionMatrix.identity()
		modelViewProjectionMatrix.mult(projectionMatrix)
		modelViewProjectionMatrix.mult(viewMatrix)
		modelViewProjectionMatrix.mult(modelMatrix.elements)
		// row major to column major
		modelViewProjectionMatrix.transpose()
		// const x = round(this.x)
		// const y = round(this.y)
		// const z = round(this.z)
		// let blockLight = 15
		// let skyLight = 15
		// try {
		// 	blockLight = world.getLight(x, y, z, 1)
		// 	skyLight = world.getLight(x, y, z, 0)
		// }
		// catch(e) {
		// 	console.error(e)
		// }
		const lightLevel = 1 // min(max(skyLight, blockLight) * 0.9 + 0.1, 1.0)
		gl.bindTexture(gl.TEXTURE_2D, textureAtlas)
		gl.uniform1i(glCache.uSamplerEntity, 0)
		gl.uniform1f(glCache.uLightLevelEntity, lightLevel)
		gl.uniformMatrix4fv(glCache.uViewEntity, false, modelViewProjectionMatrix.elements)
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
	}
}

export { Entity }