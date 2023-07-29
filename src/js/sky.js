import skyFragmentShaderSrc from '../shaders/skyFrag.glsl'
import skyVertexShaderSrc from '../shaders/skyVert.glsl'
import { createProgramObject } from './glUtils'
/**
 * Initialize the skybox shaders and return the render function
 * @param {WebGLRenderingContext} gl gl
 * @returns Rendering function
 */
function getSkybox(gl, glCache, program3D, program3DFogless) {
	// I can't explain why, but the directions are all backwards from the world coordinates
	const vertexData = new Float32Array([
		// top
		-1, -1, -1, // 1
		 1, -1, -1, // 2
		 1, -1,  1, // 3
		 1, -1,  1, // 3
		-1, -1,  1, // 4
		-1, -1, -1, // 1

		// bottom
		-1,  1, -1, // 1
		-1,  1,  1, // 2
		 1,  1,  1, // 3
		 1,  1,  1, // 3
		 1,  1, -1, // 4
		-1,  1, -1, // 1

		// south
		1, -1, -1, // 1
		1,  1, -1, // 2
		1,  1,  1, // 3
		1,  1,  1, // 3
		1, -1,  1, // 4
		1, -1, -1, // 1

		// north
		-1, -1, -1, // 1
		-1, -1,  1, // 2
		-1,  1,  1, // 3
		-1,  1,  1, // 3
		-1,  1, -1, // 4
		-1, -1, -1, // 1

		// west
		-1, -1, 1, // 1
		 1, -1, 1, // 2
		 1,  1, 1, // 3
		 1,  1, 1, // 3
		-1,  1, 1, // 4
		-1, -1, 1, // 1

		// east
		-1, -1, -1, // 1
		-1,  1, -1, // 2
		 1,  1, -1, // 3
		 1,  1, -1, // 3
		 1, -1, -1, // 4
		-1, -1, -1, // 1
	].map(n => n * 1))


	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)

	const skyboxProgram = createProgramObject(gl, skyVertexShaderSrc, skyFragmentShaderSrc)

	const aVertex = gl.getAttribLocation(skyboxProgram, "aVertex")
	const uTime = gl.getUniformLocation(skyboxProgram, "uTime")
	const uView = gl.getUniformLocation(skyboxProgram, "uView")
	const uSun = gl.getUniformLocation(skyboxProgram, "uSun")
	const uHorizon = gl.getUniformLocation(skyboxProgram, "uHorizon")

	const dayLength = 600 // seconds
	const horizonDay = [0.65, 0.7, 0.8]
	const horizonDawn = [0.95, 0.35, 0.2]

	const smoothstep = (edge0, edge1, x) => {
		let t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0)
		return t * t * (3.0 - 2.0 * t)
	}
	return function renderSkybox(time, view) {
		time %= dayLength
		const cos = Math.cos(time * Math.PI * 2 / dayLength)
		const sin = Math.sin(time * Math.PI * 2 / dayLength)
		const mag = Math.sqrt(cos*cos + sin*sin*2)
		let sunset = 1 - Math.abs(cos / mag)
		sunset *= sunset

		const horizonColor = [
			(horizonDawn[0] - horizonDay[0]) * sunset + horizonDay[0],
			(horizonDawn[1] - horizonDay[1]) * sunset + horizonDay[1],
			(horizonDawn[2] - horizonDay[2]) * sunset + horizonDay[2],
		]

		const sun = [sin/mag, cos/mag, sin/mag]
		const skyBrightness = Math.max(smoothstep(-0.5, 0.3, -cos/mag), 0.3)

		// Set uniform for program3DFogless
		gl.useProgram(program3DFogless)
		gl.uniform1f(glCache.uTimeFogless, skyBrightness)

		// Set uniform for program3D
		gl.useProgram(program3D)
		gl.uniform3f(glCache.uSky, horizonColor[0], horizonColor[1], horizonColor[2])
		gl.uniform3f(glCache.uSun, sun[0], sun[1], sun[2])
		gl.uniform1f(glCache.uTime, skyBrightness)

		gl.useProgram(skyboxProgram)
		gl.disableVertexAttribArray(glCache.aSkylight)
		gl.disableVertexAttribArray(glCache.aBlocklight)
		gl.disableVertexAttribArray(glCache.aShadow)
		gl.disableVertexAttribArray(glCache.aTexture)

		gl.uniform1f(uTime, time)
		gl.uniform3f(uSun, sun[0], sun[1], sun[2])
		gl.uniform3f(uHorizon, horizonColor[0], horizonColor[1], horizonColor[2])
		gl.uniformMatrix4fv(uView, false, view)

		gl.depthFunc(gl.EQUAL)

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0)
		gl.drawArrays(gl.TRIANGLES, 0, 6 * 6)//, gl.UNSIGNED_INT, 0)

		gl.depthFunc(gl.LESS)
	}
}

export { getSkybox }