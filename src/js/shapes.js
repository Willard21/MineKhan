import { compareArr } from "./utils"

const textureAtlasWidth = 16 // That's 16 textures wide

const CUBE     = 0
const SLAB     = 0x100 // 9th bit
const STAIR    = 0x200 // 10th bit
const FLIP     = 0x400 // 11th bit
const SOUTH    = 0x800
const EAST     = 0x1000
const WEST     = 0x1800

function objectify(x, y, z, width, height, textureX, textureY) {
	return {
		x: x,
		y: y,
		z: z,
		w: width,
		h: height,
		tx: textureX,
		ty: textureY
	}
}
let shapes = {
	/*
		[
			[(-x, -z), (+x, -z), (+x, +z), (-x, +z)], // minX = 0,  minZ = 2,  maxX = 6, maxZ = 8
			[(-x, +z), (+x, +z), (+x, -z), (-x, -z)], // minX = 9,  minZ = 10, maxX = 3, maxZ = 4
			[(+x, +y), (-x, +y), (-x, -y), (+x, -y)], // minX = 6,  minY = 7,  maxX = 0, maxY = 1
			[(-x, +y), (+x, +y), (+x, -y), (-x, -y)], // minX = 9,  minY = 10, maxX = 3, maxY = 4
			[(+y, -z), (+y, +z), (-y, +z), (-y, -z)], // minY = 10, minZ = 11, maxY = 4, maxZ = 5
			[(+y, +z), (+y, -z), (-y, -z), (-y, +z)]  // minY = 7,  minZ = 8,  maxY = 1, maxZ = 2
		]
		*/
	cube: {
		verts: [
			// x, y, z, width, height, textureX, textureY
			// 0, 0, 0 is the corner on the top left of the texture
			[objectify( 0,  0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 16, 16, 16, 16, 0, 0)], //top
			[objectify(16, 16, 16, 16, 16, 0, 0)], //north
			[objectify( 0, 16,  0, 16, 16, 0, 0)], //south
			[objectify(16, 16,  0, 16, 16, 0, 0)], //east
			[objectify( 0, 16, 16, 16, 16, 0, 0)]  //west
		],
		cull: {
			top: 3,
			bottom: 3,
			north: 3,
			south: 3,
			east: 3,
			west: 3
		},
		texVerts: [],
		buffer: null,
		size: 6,
		varients: [],
		flip: false,
		rotate: true,
	},
	slab: {
		verts: [
			[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 8, 16, 16, 16, 0, 0)], //top
			[objectify(16, 8, 16, 16, 8, 0, 0)], //north
			[objectify( 0, 8,  0, 16, 8, 0, 0)], //south
			[objectify(16, 8,  0, 16, 8, 0, 0)], //east
			[objectify( 0, 8, 16, 16, 8, 0, 0)]  //west
		],
		cull: {
			top: 0,
			bottom: 3,
			north: 1,
			south: 1,
			east: 1,
			west: 1
		},
		texVerts: [],
		buffer: null,
		size: 6,
		varients: [],
		flip: true,
		rotate: false
	},
	stair: {
		verts: [
			[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 8,  8, 16, 8, 0, 8), objectify( 0, 16,  16, 16, 8, 0, 0)], //top
			[objectify(16, 16, 16, 16, 16, 0, 0)], //north
			[objectify( 0, 8,  0, 16, 8, 0, 0), objectify( 0, 16,  8, 16, 8, 0, 0)], //south
			[objectify(16, 8, 0, 8, 8, 8, 0), objectify(16, 16, 8, 8, 16, 0, 0)], //east
			[objectify( 0, 8, 8, 8, 8, 0, 0), objectify( 0, 16, 16, 8, 16, 8, 0)]  //west
		],
		cull: {
			top: 0,
			bottom: 3,
			north: 3,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 10,
		varients: [],
		flip: true,
		rotate: true
	},
	flower: {
		verts: [
			[objectify( 8,  0,  8,  2,  2,  0,  0)],
			[objectify( 8, 16,  8,  2,  2,  0,  0)],
			[objectify(16, 16,  8, 16, 16,  0,  0)],
			[objectify( 0, 16,  8, 16, 16,  0,  0)],
			[objectify( 8, 16,  0, 16, 16,  0,  0)],
			[objectify( 8, 16, 16, 16, 16,  0,  0)]
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
		varients: [],
		flip: false,
		rotate: false
	},
	lantern: {
		verts: [
			[objectify(5,  0, 5, 6, 6, 0, 9)],
			[objectify(6, 9, 10, 4, 4, 1, 10),objectify(5, 7, 11, 6, 6, 0, 9)],
			[objectify(10, 9, 10, 4, 2, 1, 0),objectify(11, 7, 11, 6, 7, 0, 2),objectify(9.5, 11, 8, 3, 2, 11, 10),objectify(9.5, 16, 8, 3, 3, 11, 2)],
			[objectify(6, 9, 6, 4, 2, 1, 0),objectify(5, 7, 5, 6, 7, 0, 2),objectify(6.5, 11, 8, 3, 2, 11, 10),objectify(6.5, 16, 8, 3, 3, 11, 2)],
			[objectify(10, 9, 6, 4, 2, 1, 0),objectify(11, 7, 5, 6, 7, 0, 2),objectify(8, 14, 6.5, 3, 4, 11, 1)],
			[objectify(6, 9, 10, 4, 2, 1, 0),objectify(5, 7, 11, 6, 7, 0, 2),objectify(8, 14, 9.5, 3, 4, 11, 1)]
		],
		cull: {
			top: 0,
			bottom: 3,
			north: 0,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		varients: [],
		buffer: null,
		size: 17,
	},
}

function mapCoords(rect, face) {
	let x = rect.x
	let y = rect.y
	let z = rect.z
	let w = rect.w
	let h = rect.h
	let tx = rect.tx
	let ty = rect.ty
	let tex = [tx+w,ty, tx,ty, tx,ty+h, tx+w,ty+h]
	let pos = null
	switch(face) {
		case 0: // Bottom
			pos = [x,y,z, x+w,y,z, x+w,y,z+h, x,y,z+h]
			break
		case 1: // Top
			pos = [x,y,z, x+w,y,z, x+w,y,z-h, x,y,z-h]
			break
		case 2: // North
			pos = [x,y,z, x-w,y,z, x-w,y-h,z, x,y-h,z]
			break
		case 3: // South
			pos = [x,y,z, x+w,y,z, x+w,y-h,z, x,y-h,z]
			break
		case 4: // East
			pos = [x,y,z, x,y,z+w, x,y-h,z+w, x,y-h,z]
			break
		case 5: // West
			pos = [x,y,z, x,y,z-w, x,y-h,z-w, x,y-h,z]
			break
	}
	pos = pos.map(c => c / 16 - 0.5)
	let minmax = compareArr(pos, [])
	pos.max = minmax.splice(3, 3)
	pos.min = minmax
	tex = tex.map(c => c / 16 / textureAtlasWidth)

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
		varients: shape.varients
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
		varients: shape.varients
	}
}

for (let shape in shapes) {
	let obj = shapes[shape]
	let verts = obj.verts

	// Populate the vertex coordinates
	for (let i = 0; i < verts.length; i++) {
		let side = verts[i]
		let texArr = []
		obj.texVerts.push(texArr)
		for (let j = 0; j < side.length; j++) {
			let face = side[j]
			let mapped = mapCoords(face, i)
			side[j] = mapped.pos
			texArr.push(mapped.tex)
		}
	}

	if (obj.rotate) {
		let v = obj.varients
		let east = rotate(obj)
		let south = rotate(east)
		let west = rotate(south)
		v[0] = obj
		v[2] = south
		v[4] = east
		v[6] = west
	}
	if (obj.flip) {
		let v = obj.varients
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

export { shapes, CUBE, SLAB, STAIR, FLIP, SOUTH, EAST, WEST }