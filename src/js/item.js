import { blockData, Block, Sides } from "./blockData.js"
import { textureCoords, textureMap } from "./texture.js"
import { Entity } from "./entity.js"

class Item extends Entity {
	constructor(x, y, z, velx, vely, velz, blockID, glExtensions, gl, glCache, indexBuffer, world, p) {
		const block = blockData[blockID]
		const tex = block.textures
		const shape = block.shape
		const shapeVerts = shape.verts
		const shapeTexVerts = shape.texVerts
		const size = shape.size
		let blockSides = Object.keys(Block)
		let texNum = 0
		let texture = []
		let index = 0
		for (let n = 0; n < 6; n++) {
			let side = blockSides[n]
			let directionalFaces = shapeVerts[Sides[side]]
			for (let facei = 0; facei < directionalFaces.length; facei++) {
				let texVerts = textureCoords[textureMap[tex[texNum]]]
				let tx = texVerts[0]
				let ty = texVerts[1]
				let texShapeVerts = shapeTexVerts[n][facei]
				texture[index    ] = tx + texShapeVerts[0]
				texture[index + 1] = ty + texShapeVerts[1]
				texture[index + 2] = tx + texShapeVerts[2]
				texture[index + 3] = ty + texShapeVerts[3]
				texture[index + 4] = tx + texShapeVerts[4]
				texture[index + 5] = ty + texShapeVerts[5]
				texture[index + 6] = tx + texShapeVerts[6]
				texture[index + 7] = ty + texShapeVerts[7]
				index += 8
			}
			texNum++
		}
		super(x, y, z, Math.PI / 4, Math.PI / 4, velx, vely, velz, 0.25, 0.25, 0.25, new Float32Array(shapeVerts.flat(Infinity)), new Float32Array(texture), size, 1500000, glExtensions, gl, glCache, indexBuffer, world, p)
	}
	render() {
		const { gl, glCache, glExtensions, p } = this
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

export { Item }