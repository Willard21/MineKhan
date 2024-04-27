import { compareArr } from "./utils"

const textureAtlasWidth = 16 // That's 16 textures wide

const CUBE     = 0
const SLAB     = 0x100 // 9th bit
const STAIR    = 0x200 // 10th bit
const FLIP     = 0x400 // 11th bit
const SOUTH    = 0x800
const EAST     = 0x1000
const WEST     = 0x1800

/**
 * Return the parameters as an array. Honestly just did this for an excuse to write out the parameters.
 * @param {Number} x The X coordinate of the face with the top left corner of the texture
 * @param {Number} y The Y coordinate of the face with the top left corner of the texture
 * @param {Number} z The Z coordinate of the face with the top left corner of the texture
 * @param {Number} width The width of the face/texture. Refers to deltaX if X changes, or deltaZ otherwise
 * @param {Number} height The height of the face/texture. Refers to deltaY if Y changes, or deltaZ otherwise
 * @param {Number} textureX The X coordinate of the texture at (x, y, z) on the face
 * @param {Number} textureY The Y coordinate of the texture at (x, y, z) on the face
 */
function arrayify(x, y, z, width, height, textureX, textureY) {
	return [x, y, z, width, height, textureX, textureY]
}
let shapes = {
	cube: {
		verts: [
			// x, y, z, width, height, textureX, textureY
			// 0, 0, 0 is the corner on the top left of the texture
			[arrayify( 0,  0,  0, 16, 16, 0, 0)], //bottom
			[arrayify( 0, 16, 16, 16, 16, 0, 0)], //top
			[arrayify(16, 16, 16, 16, 16, 0, 0)], //north
			[arrayify( 0, 16,  0, 16, 16, 0, 0)], //south
			[arrayify(16, 16,  0, 16, 16, 0, 0)], //east
			[arrayify( 0, 16, 16, 16, 16, 0, 0)]  //west
		],
		cull: {
			top: 15,
			bottom: 15,
			north: 15,
			south: 15,
			east: 15,
			west: 15
		},
		texVerts: [],
		buffer: null,
		size: 6,
		variants: [],
		flip: false,
		rotate: true,
	},
	slab: {
		verts: [
			[arrayify( 0, 0,  0, 16, 16, 0, 0)], //bottom
			[arrayify( 0, 8, 16, 16, 16, 0, 0)], //top
			[arrayify(16, 8, 16, 16, 8, 0, 0)], //north
			[arrayify( 0, 8,  0, 16, 8, 0, 0)], //south
			[arrayify(16, 8,  0, 16, 8, 0, 0)], //east
			[arrayify( 0, 8, 16, 16, 8, 0, 0)]  //west
		],
		cull: {
			top: 0,
			bottom: 15,
			north: 3,
			south: 3,
			east: 3,
			west: 3
		},
		texVerts: [],
		buffer: null,
		size: 6,
		variants: [],
		flip: true,
		rotate: false
	},
	stair: {
		verts: [
			[[0,0,0,16,16,0,0]], // -y
			[[0,8,16,8,16,8,0],[8,16,16,8,16,0,0]], // +y
			[[8,8,16,8,8,0,0],[16,16,16,8,16,0,0]], // +z
			[[0,8,0,8,8,0,0],[8,16,0,8,16,0,0]], // -z
			[[16,16,0,16,16,0,0]], // +x
			[[0,8,16,16,8,0,0],[8,16,16,16,8,0,0]] // -x
		],
		cull: {
			top: 0b1100,
			bottom: 15,
			north: 15,
			south: 3,
			east: 0b0111,
			west: 0b1011
		},
		texVerts: [],
		buffer: null,
		size: 10,
		variants: [],
		flip: true,
		rotate: true
	},
	flower: {
		verts: [
			[],
			[],
			// [arrayify( 8,  0,  8,  2,  2,  0,  0)],
			// [arrayify( 8, 16,  8,  2,  2,  0,  0)],
			[arrayify(16, 16,  8, 16, 16,  0,  0)],
			[arrayify( 0, 16,  8, 16, 16,  0,  0)],
			[arrayify( 8, 16,  0, 16, 16,  0,  0)],
			[arrayify( 8, 16, 16, 16, 16,  0,  0)]
		],
		cull: {
			top: 0,
			bottom: 0,
			north: 0,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 4,
		variants: [],
		flip: false,
		rotate: false
	},
	lantern: {
		verts: [
			[[5,1,5,6,6,0,9]],
			[[5,8,11,6,6,0,9],[6,10,10,4,4,1,10]],
			[[11,8,11,6,7,0,2],[10,10,10,4,2,1,0],[9.5,15,8,3,4,11,1]],
			[[5,8,5,6,7,0,2],[6,10,6,4,2,1,0],[6.5,15,8,3,4,11,1]],
			[[11,8,5,6,7,0,2],[10,10,6,4,2,1,0],[8,16,6.5,3,6,11,6]],
			[[5,8,11,6,7,0,2],[6,10,10,4,2,1,0],[8,16,9.5,3,6,11,6]]
		],
		cull: {
			top: 0,
			bottom: 0,
			north: 0,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 15,
		variants: [],
		flip: false,
		rotate: false
	},
	door: {
		verts: [
			[[0,0,0,3,16,13,0]],
			[[0,16,16,3,16,0,0]],
			[[3,16,16,3,16,0,0]],
			[[0,16,0,3,16,0,0]],
			[[3,16,0,16,16,0,0]],
			[[0,16,16,16,16,0,0]]
		],
		cull: {
			top: 0,
			bottom: 0,
			north: 0,
			south: 15,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 6,
		variants: [],
		flip: false,
		rotate: true
	},
	fence: {
		verts: [
			[[6,0,6,4,4,6,6]],
			[[6,16,10,4,4,6,6]],
			[[10,16,10,4,16,6,0]],
			[[6,16,6,4,16,6,0]],
			[[10,16,6,4,16,6,0]],
			[[6,16,10,4,16,6,0]]
		],
		cull: {
			top: 0,
			bottom: 0,
			north: 0,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 6,
		variants: [],
		flip: false,
		rotate: false
	},
	fenceSide: {
		verts: [
			[[7,12,0,2,9,7,0],[7,6,0,2,9,7,0]],
			[[7,15,9,2,9,7,0],[7,9,9,2,9,7,0]],
			[[9,15,9,2,3,7,1],[9,9,9,2,3,7,7]],
			[],
			[[9,15,0,9,3,0,1],[9,9,0,9,3,0,7]],
			[[7,15,9,9,3,0,1],[7,9,9,9,3,0,7]]
		],
		cull: {
			top: 0,
			bottom: 0,
			north: 0,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 10,
		variants: [],
		flip: false,
		rotate: true
	},
}

function mapCoords(rect, face) {
	const [x, y, z, w, h, tx, ty] = rect
	const tex = [tx+w,ty, tx,ty, tx,ty+h, tx+w,ty+h].map(c => c / 16 / textureAtlasWidth)
	const pos = [x, y, z]
	switch(face) {
		case 0: // Bottom
			pos.push(x+w,y,z, x+w,y,z+h, x,y,z+h)
			break
		case 1: // Top
			pos.push(x+w,y,z, x+w,y,z-h, x,y,z-h)
			break
		case 2: // North
			pos.push(x-w,y,z, x-w,y-h,z, x,y-h,z)
			break
		case 3: // South
			pos.push(x+w,y,z, x+w,y-h,z, x,y-h,z)
			break
		case 4: // East
			pos.push(x,y,z+w, x,y-h,z+w, x,y-h,z)
			break
		case 5: // West
			pos.push(x,y,z-w, x,y-h,z-w, x,y-h,z)
			break
	}
	for(let i = 0; i < 12; i++) pos[i] = (pos[i] - 8) / 16
	let minmax = compareArr(pos, [])
	pos.max = minmax.splice(3, 3)
	pos.min = minmax

	return {
		pos: pos,
		tex: tex
	}
}

// 90 degree clockwise rotation; returns a new shape object
function rotate(shape) {
	let verts = shape.verts
	let texVerts = shape.texVerts
	let cull = shape.cull
	let pos = []
	let tex = []
	for (let i = 0; i < verts.length; i++) {
		let side = verts[i]
		pos[i] = []
		tex[i] = []
		for (let j = 0; j < side.length; j++) {
			let face = side[j]
			let c = []
			pos[i][j] = c
			for (let k = 0; k < face.length; k += 3) {
				c[k] = face[k + 2]
				c[k + 1] = face[k + 1]
				c[k + 2] = -face[k]
			}

			tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
			if (i === 0) {
				// Bottom
				c.push(...c.splice(0, 3))
				tex[i][j].push(...tex[i][j].splice(0, 2))
			}
			if (i === 1) {
				// Top
				c.unshift(...c.splice(-3, 3))
				tex[i][j].unshift(...tex[i][j].splice(-2, 2))
			}

			let minmax = compareArr(c, [])
			c.max = minmax.splice(3, 3)
			c.min = minmax
		}
	}

	// Make sure each direction has the correct number of faces and whatnot.
	let temp = tex[2] // North
	tex[2] = tex[5] // North = West
	tex[5] = tex[3] // West = South
	tex[3] = tex[4] // South = East
	tex[4] = temp // East = North

	temp = pos[2] // North
	pos[2] = pos[5] // North = West
	pos[5] = pos[3] // West = South
	pos[3] = pos[4] // South = East
	pos[4] = temp // East = North

	let cull2 = {
		top: cull.top,
		bottom: cull.bottom,
		north: cull.west,
		west: cull.south,
		south: cull.east,
		east: cull.north
	}

	// let buffer = gl.createBuffer()
	// gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

	return {
		verts: pos,
		texVerts: tex,
		cull: cull2,
		rotate: true,
		flip: shape.flip,
		buffer: null,
		size: shape.size,
		variants: shape.variants
	}
}

// Reflect over the y plane; returns a new shape object
function flip(shape) {
	let verts = shape.verts
	let texVerts = shape.texVerts
	let cull = shape.cull
	let pos = []
	let tex = []
	for (let i = 0; i < verts.length; i++) {
		let side = verts[i]
		pos[i] = []
		tex[i] = []
		for (let j = 0; j < side.length; j++) {
			let face = side[j].slice().reverse()
			let c = []
			pos[i][j] = c
			for (let k = 0; k < face.length; k += 3) {
				c[k] = face[k + 2]
				c[k + 1] = -face[k + 1]
				c[k + 2] = face[k]
			}
			let minmax = compareArr(c, [])
			c.max = minmax.splice(3, 3)
			c.min = minmax

			tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
		}
	}
	let temp = pos[0] // Bottom
	pos[0] = pos[1] // Bottom = Top
	pos[1] = temp // Top = Bottom

	temp = tex[0] // Bottom
	tex[0] = tex[1] // Bottom = Top
	tex[1] = temp // Top = Bottom

	let cull2 = {
		top: cull.bottom,
		bottom: cull.top,
		north: (cull.north & 1) << 1 | (cull.north & 2) >> 1,
		west: (cull.west & 1) << 1 | (cull.west & 2) >> 1,
		south: (cull.south & 1) << 1 | (cull.south & 2) >> 1,
		east: (cull.east & 1) << 1 | (cull.east & 2) >> 1
	}

	// let buffer = gl.createBuffer()
	// gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

	return {
		verts: pos,
		texVerts: tex,
		cull: cull2,
		rotate: shape.rotate,
		flip: shape.flip,
		buffer: null,
		size: shape.size,
		variants: shape.variants
	}
}

for (let shape in shapes) {
	let obj = shapes[shape]
	let verts = obj.verts

	// Populate the vertex coordinates
	for (let i = 0; i < verts.length; i++) { // 6 directions
		let side = verts[i] // Array of faces in this direction
		let texArr = []
		obj.texVerts.push(texArr)
		for (let j = 0; j < side.length; j++) { // Each face in this direction
			let face = side[j] // Array of arrayified data
			let mapped = mapCoords(face, i)
			side[j] = mapped.pos
			texArr.push(mapped.tex)
		}
	}

	if (obj.rotate) {
		let v = obj.variants
		let east = rotate(obj)
		let south = rotate(east)
		let west = rotate(south)
		v[0] = obj
		v[2] = south
		v[4] = east
		v[6] = west
	}
	if (obj.flip) {
		let v = obj.variants
		v[1] = flip(obj)
		if (obj.rotate) {
			v[3] = flip(v[2])
			v[5] = flip(v[4])
			v[7] = flip(v[6])
		}
	}

	// obj.buffer = gl.createBuffer()
	// gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts.flat(2)), gl.STATIC_DRAW)
}

// Now that fenceSide is rotated, let's generate a bunch of fence variants
{
	const clone = obj => {
		return {
			verts: obj.verts.map(a => a.slice()),
			texVerts: obj.texVerts.map(a => a.slice()),
			cull: obj.cull,
			rotate: false,
			flip: false,
			buffer: null,
			size: obj.size,
			variants: obj.variants
		}
	}
	const v = shapes.fence.variants
	for (let i = 0; i < 16; i++) {
		let obj = clone(shapes.fence)
		for (let j = 0; j < 4; j++) {
			if (i & 1 << j) for (let k = 0; k < 6; k++) {
				obj.verts[k].push(...shapes.fenceSide.variants[j * 2].verts[k])
				obj.texVerts[k].push(...shapes.fenceSide.variants[j * 2].texVerts[k])
			}
		}
		v.push(obj)
	}

	shapes.fence.texVerts = shapes.cube.texVerts
	shapes.fence.verts = shapes.cube.verts
}


export { shapes, CUBE, SLAB, STAIR, FLIP, SOUTH, EAST, WEST }