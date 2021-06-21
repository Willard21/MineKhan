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
		varients: [],
		buffer: null,
		size: 6
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
}

export { shapes };