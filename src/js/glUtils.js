import { initTextures, hitboxTextureCoords } from './texture.js'
import { shapes } from "./shapes.js"
import { getSkybox } from './sky'

// GLSL Shader code
import vertexShaderSrc3D from '../shaders/blockVert.glsl'
import fragmentShaderSrc3D from '../shaders/blockFrag.glsl'
import foglessVertexShaderSrc3D from '../shaders/blockVertFogless.glsl'
import foglessFragmentShaderSrc3D from '../shaders/blockFragFogless.glsl'
import vertexShaderSrc2D from '../shaders/2dVert.glsl'
import fragmentShaderSrc2D from '../shaders/2dFrag.glsl'
import vertexShaderSrcEntity from '../shaders/entityVert.glsl'
import fragmentShaderSrcEntity from '../shaders/entityFrag.glsl'
import skyFragmentShaderSrc from '../shaders/skyFrag.glsl'
import skyVertexShaderSrc from '../shaders/skyVert.glsl'

/**
 * @param {WebGLRenderingContext} gl
 * @param {String} vetexShaderSource The vertex shader source code
 * @param {String} fragmentShaderSource The fragment shader source code
 */
const createProgramObject = (gl, vetexShaderSource, fragmentShaderSource, attribLocations = []) => {
	let vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertexShaderObject, vetexShaderSource)
	gl.compileShader(vertexShaderObject)
	if (!gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS)) {
		throw gl.getShaderInfoLog(vertexShaderObject)
	}

	let fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragmentShaderObject, fragmentShaderSource)
	gl.compileShader(fragmentShaderObject)
	if (!gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS)) {
		throw gl.getShaderInfoLog(fragmentShaderObject)
	}

	let programObject = gl.createProgram()
	gl.attachShader(programObject, vertexShaderObject)
	gl.attachShader(programObject, fragmentShaderObject)

	for (let [attrib, location] of attribLocations) {
		gl.bindAttribLocation(programObject, location, attrib)
	}

	gl.linkProgram(programObject)
	if (!gl.getProgramParameter(programObject, gl.LINK_STATUS)) {
		throw "Error linking shaders."
	}

	return programObject
}

/** @type {HTMLCanvasElement} */
let canv = document.getElementById("webgl-canvas")
canv.width = window.parent.innerWidth
canv.height = window.parent.innerHeight

const gl = canv.getContext("webgl", { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false })
if (!gl) {
	alert("Error: WebGL not detected. Please enable WebGL and/or \"hardware acceleration\" in your browser settings, then restart your browser.")
	throw "Error: Cannot play a WebGL game without WebGL."
}
const glExtensions = {
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


const blockAttribs = [
	["aVertex", 0],
	["aTexture", 1],
	["aShadow", 2],
	["aSkylight", 3],
	["aBlocklight", 4]
]
const program3DFogless = createProgramObject(gl, foglessVertexShaderSrc3D, foglessFragmentShaderSrc3D, blockAttribs)
const program3D = createProgramObject(gl, vertexShaderSrc3D, fragmentShaderSrc3D, blockAttribs)
const program2D = createProgramObject(gl, vertexShaderSrc2D, fragmentShaderSrc2D)
const programEntity = createProgramObject(gl, vertexShaderSrcEntity, fragmentShaderSrcEntity)
const skyboxProgram = createProgramObject(gl, skyVertexShaderSrc, skyFragmentShaderSrc)

const glLocations = {
	// program2D
	uOffset: gl.getUniformLocation(program2D, "uOffset"),
	uSampler2: gl.getUniformLocation(program2D, "uSampler"),
	uView2: gl.getUniformLocation(program2D, "uView"),
	aTexture2: gl.getAttribLocation(program2D, "aTexture"),
	aVertex2: gl.getAttribLocation(program2D, "aVertex"),
	aShadow2: gl.getAttribLocation(program2D, "aShadow"),

	// programEntity
	uSamplerEntity: gl.getUniformLocation(programEntity, "uSampler"),
	uLightLevelEntity: gl.getUniformLocation(programEntity, "uLightLevel"),
	uViewEntity: gl.getUniformLocation(programEntity, "uView"),
	aTextureEntity: gl.getAttribLocation(programEntity, "aTexture"),
	aVertexEntity: gl.getAttribLocation(programEntity, "aVertex"),

	// program3DFogless
	uViewFogless: gl.getUniformLocation(program3DFogless, "uView"),
	uSamplerFogless: gl.getUniformLocation(program3DFogless, "uSampler"),
	uPosFogless: gl.getUniformLocation(program3DFogless, "uPos"),
	uTimeFogless: gl.getUniformLocation(program3DFogless, "uTime"),
	uTransFogless: gl.getUniformLocation(program3DFogless, "uTrans"),
	uLanternFogless: gl.getUniformLocation(program3DFogless, "uLantern"),
	uZoffset: gl.getUniformLocation(program3DFogless, "uZoffset"),

	// program3D
	aVertex: gl.getAttribLocation(program3D, "aVertex"),
	aShadow: gl.getAttribLocation(program3D, "aShadow"),
	aTexture: gl.getAttribLocation(program3D, "aTexture"),
	aSkylight: gl.getAttribLocation(program3D, "aSkylight"),
	aBlocklight: gl.getAttribLocation(program3D, "aBlocklight"),
	uSampler: gl.getUniformLocation(program3D, "uSampler"),
	uLantern: gl.getUniformLocation(program3D, "uLantern"),
	uTrans: gl.getUniformLocation(program3D, "uTrans"),
	uView: gl.getUniformLocation(program3D, "uView"),
	uDist: gl.getUniformLocation(program3D, "uDist"),
	uTime: gl.getUniformLocation(program3D, "uTime"),
	uPos: gl.getUniformLocation(program3D, "uPos"),
	uSky: gl.getUniformLocation(program3D, "uSky"),
	uSun: gl.getUniformLocation(program3D, "uSun"),
}

gl.useProgram(program3D)
gl.uniform1f(glLocations.uDist, 1000)
gl.uniform1i(glLocations.uTrans, 0)

const skybox = getSkybox(gl, glLocations, program3D, program3DFogless, skyboxProgram)
const bigArray = new Float32Array(1000000)

let indexOrder = new Uint32Array(bigArray.length / 6 | 0)
for (let i = 0, j = 0; i < indexOrder.length; i += 6, j += 4) {
	indexOrder[i + 0] = 0 + j
	indexOrder[i + 1] = 1 + j
	indexOrder[i + 2] = 2 + j
	indexOrder[i + 3] = 0 + j
	indexOrder[i + 4] = 2 + j
	indexOrder[i + 5] = 3 + j
}
// Bind the index buffer that will be used to draw squares instead of 2 triangles for everything
const indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexOrder, gl.STATIC_DRAW)

// Send the block textures to the GPU
initTextures(gl, glLocations)

// Create buffers for the hitbox outline shapes and icon geometry
for (let shape in shapes) {
	let obj = shapes[shape]
	obj.buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((obj.hitbox || obj.verts).flat(2)), gl.STATIC_DRAW)
	for (let i in obj.variants) {
		let v = obj.variants[i]
		v.buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, v.buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((v.hitbox || v.verts).flat(2)), gl.STATIC_DRAW)
	}
}

// Make a buffer for the hitbox outline texture (just black repeatedly)
const hitboxBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, hitboxBuffer)
gl.bufferData(gl.ARRAY_BUFFER, hitboxTextureCoords, gl.STATIC_DRAW)

// Tell it not to render the insides of blocks
gl.enable(gl.CULL_FACE)
gl.cullFace(gl.BACK)

gl.depthRange(0, 2)
gl.lineWidth(2)
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

export { skybox, gl, glExtensions, glLocations, program2D, program3D, program3DFogless, programEntity, bigArray, indexBuffer, hitboxBuffer }