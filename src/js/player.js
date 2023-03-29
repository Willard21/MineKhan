import { blockData } from "./blockData.js"
import { shapes } from "./shapes.js"
import { textureCoords, textureMap, textureAtlas } from "./texture.js"
import { Entity } from "./entity.js"
import { Matrix } from "./3Dutils.js"

class Player extends Entity {
	constructor(x, y, z, vx, vy, vz, blockID, glExtensions, gl, glCache, indexBuffer, world, p) {
		const block = blockData[blockID & 255]
		const tex = block.textures
		const shape = shapes.cube
		const shapeVerts = shape.verts
		const shapeTexVerts = shape.texVerts
		const size = shape.size
		let texNum = 0
		let texture = []
		let index = 0
		for (let n = 0; n < 6; n++) {
			let directionalFaces = shapeVerts[n]
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
		super(x, y, z, 0, 0, vx || 0, vy || 0, vz || 0, 0.6, 1.7, 0.6, new Float32Array(shapeVerts.flat(Infinity)), new Float32Array(texture), size, Infinity, glExtensions, gl, glCache, indexBuffer, world, p)
		if (p) this.camera = null
	}
	render() {
		const { gl, glCache, glExtensions, p } = this
		const modelMatrix = new Matrix()
		modelMatrix.identity()
		modelMatrix.translate(this.x, this.y, this.z)
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

		const lightLevel = 1 // min(max(skyLight, blockLight) * 0.9 + 0.1, 1.0)
		gl.uniform1i(glCache.uSamplerEntity, 0)
		// gl.bindTexture(gl.TEXTURE_2D, textureAtlas)
		gl.uniform1f(glCache.uLightLevelEntity, lightLevel)
		gl.uniformMatrix4fv(glCache.uViewEntity, false, modelViewProjectionMatrix.elements)
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
	}
}

export { Player }