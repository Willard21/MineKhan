class PVector {
	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
	}
	set(x, y, z) {
		if (y === undefined) {
			this.x = x.x
			this.y = x.y
			this.z = x.z
		}
		else {
			this.x = x
			this.y = y
			this.z = z
		}
	}
	normalize() {
		let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
		this.x /= mag
		this.y /= mag
		this.z /= mag
	}
	add(v) {
		this.x += v.x
		this.y += v.y
		this.z += v.z
	}
	mult(m) {
		this.x *= m
		this.y *= m
		this.z *= m
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}
	magSquared() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}
}

const { cos, sin } = Math;

class Matrix {
	constructor(arr) {
		this.elements = new Float32Array(arr || 16)
	}
	translate(x, y, z) {
		let a = this.elements
		a[3] += a[0] * x + a[1] * y + a[2] * z
		a[7] += a[4] * x + a[5] * y + a[6] * z
		a[11] += a[8] * x + a[9] * y + a[10] * z
		a[15] += a[12] * x + a[13] * y + a[14] * z
	}
	rotX(angle) {
		let elems = this.elements
		let c = cos(angle)
		let s = sin(angle)
		let t = elems[1]
		elems[1] = t * c + elems[2] * s
		elems[2] = t * -s + elems[2] * c
		t = elems[5]
		elems[5] = t * c + elems[6] * s
		elems[6] = t * -s + elems[6] * c
		t = elems[9]
		elems[9] = t * c + elems[10] * s
		elems[10] = t * -s + elems[10] * c
		t = elems[13]
		elems[13] = t * c + elems[14] * s
		elems[14] = t * -s + elems[14] * c
	}
	rotY(angle) {
		let c = cos(angle)
		let s = sin(angle)
		let elems = this.elements
		let t = elems[0]
		elems[0] = t * c + elems[2] * -s
		elems[2] = t * s + elems[2] * c
		t = elems[4]
		elems[4] = t * c + elems[6] * -s
		elems[6] = t * s + elems[6] * c
		t = elems[8]
		elems[8] = t * c + elems[10] * -s
		elems[10] = t * s + elems[10] * c
		t = elems[12]
		elems[12] = t * c + elems[14] * -s
		elems[14] = t * s + elems[14] * c
	}
	scale(x, y, z) {
		let a = this.elements
		a[0] *= x;
		a[1] *= y;
		a[2] *= z;
		a[4] *= x;
		a[5] *= y;
		a[6] *= z;
		a[8] *= x;
		a[9] *= y;
		a[10] *= z;
		a[12] *= x;
		a[13] *= y;
		a[14] *= z;
	}
	identity() {
		let a = this.elements
		a[0] = 1
		a[1] = 0
		a[2] = 0
		a[3] = 0
		a[4] = 0
		a[5] = 1
		a[6] = 0
		a[7] = 0
		a[8] = 0
		a[9] = 0
		a[10] = 1
		a[11] = 0
		a[12] = 0
		a[13] = 0
		a[14] = 0
		a[15] = 1
	}
	// somebody optimize this
	// you just have to expand it
	mult(b) {
		const a = this.elements.slice()
		const out = this.elements
		let e = 0
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				out[e++] = a[row * 4 + 0] * b[col + 0] + a[row * 4 + 1] * b[col + 4] + a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12];
			}
		}
	}
	// same here
	postMult(a) {
		const b = this.elements.slice()
		const out = this.elements
		let e = 0
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				out[e++] = a[row * 4 + 0] * b[col + 0] + a[row * 4 + 1] * b[col + 4] + a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12];
			}
		}
	}
	transpose() {
		let matrix = this.elements
		let temp = matrix[4]
		matrix[4] = matrix[1]
		matrix[1] = temp

		temp = matrix[8]
		matrix[8] = matrix[2]
		matrix[2] = temp

		temp = matrix[6]
		matrix[6] = matrix[9]
		matrix[9] = temp

		temp = matrix[3]
		matrix[3] = matrix[12]
		matrix[12] = temp

		temp = matrix[7]
		matrix[7] = matrix[13]
		matrix[13] = temp

		temp = matrix[11]
		matrix[11] = matrix[14]
		matrix[14] = temp
	}
	copyArray(from) {
		let to = this.elements
		for (let i = 0; i < from.length; i++) {
			to[i] = from[i]
		}
	}
	copyMatrix(from) {
		let to = this.elements
		from = from.elements
		for (let i = 0; i < from.length; i++) {
			to[i] = from[i]
		}
	}
}

class Plane {
	constructor(nx, ny, nz) {
		this.set(nx, ny, nz)
	}
	set(nx, ny, nz) {
		// Pre-computed chunk offsets to reduce branching during culling
		this.dx = nx > 0 ? 16 : 0
		this.dy = ny > 0
		this.dz = nz > 0 ? 16 : 0

		// Normal vector for the plane
		this.nx = nx
		this.ny = ny
		this.nz = nz
	}
}

function cross(v1, v2, result) {
	let x = v1.x,
		y = v1.y,
		z = v1.z,
		x2 = v2.x,
		y2 = v2.y,
		z2 = v2.z
	result.x = y * z2 - y2 * z
	result.y = z * x2 - z2 * x
	result.z = x * y2 - x2 * y
}

function trans(matrix, x, y, z) {
	let a = matrix
	a[3] += a[0] * x + a[1] * y + a[2] * z
	a[7] += a[4] * x + a[5] * y + a[6] * z
	a[11] += a[8] * x + a[9] * y + a[10] * z
	a[15] += a[12] * x + a[13] * y + a[14] * z
}

function rotX(matrix, angle) {
	// This function is basically multiplying 2 4x4 matrices together,
	// but 1 of them has a bunch of 0's and 1's in it,
	// so I removed all terms that multiplied by 0, and just left off the 1's.
	// mat2 = [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]
	let elems = matrix
	let c = cos(angle)
	let s = sin(angle)
	let t = elems[1]
	elems[1] = t * c + elems[2] * s
	elems[2] = t * -s + elems[2] * c
	t = elems[5]
	elems[5] = t * c + elems[6] * s
	elems[6] = t * -s + elems[6] * c
	t = elems[9]
	elems[9] = t * c + elems[10] * s
	elems[10] = t * -s + elems[10] * c
	t = elems[13]
	elems[13] = t * c + elems[14] * s
	elems[14] = t * -s + elems[14] * c
}

function rotY(matrix, angle) {
	//source = c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1
	let c = cos(angle)
	let s = sin(angle)
	let elems = matrix
	let t = elems[0]
	elems[0] = t * c + elems[2] * -s
	elems[2] = t * s + elems[2] * c
	t = elems[4]
	elems[4] = t * c + elems[6] * -s
	elems[6] = t * s + elems[6] * c
	t = elems[8]
	elems[8] = t * c + elems[10] * -s
	elems[10] = t * s + elems[10] * c
	t = elems[12]
	elems[12] = t * c + elems[14] * -s
	elems[14] = t * s + elems[14] * c
}

function transpose(matrix) {
	let temp = matrix[4]
	matrix[4] = matrix[1]
	matrix[1] = temp

	temp = matrix[8]
	matrix[8] = matrix[2]
	matrix[2] = temp

	temp = matrix[6]
	matrix[6] = matrix[9]
	matrix[9] = temp

	temp = matrix[3]
	matrix[3] = matrix[12]
	matrix[12] = temp

	temp = matrix[7]
	matrix[7] = matrix[13]
	matrix[13] = temp

	temp = matrix[11]
	matrix[11] = matrix[14]
	matrix[14] = temp
}

function copyArr(a, b) {
	for (let i = 0; i < a.length; i++) {
		b[i] = a[i]
	}
}

export { PVector, Matrix, Plane, cross, rotX, rotY, trans, transpose, copyArr };