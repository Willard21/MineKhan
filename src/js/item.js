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
}

export { Item }