function createProgramObject(curContext, vetexShaderSource, fragmentShaderSource) {
	let vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER)
	curContext.shaderSource(vertexShaderObject, vetexShaderSource)
	curContext.compileShader(vertexShaderObject)
	if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
		throw curContext.getShaderInfoLog(vertexShaderObject)
	}

	let fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER)
	curContext.shaderSource(fragmentShaderObject, fragmentShaderSource)
	curContext.compileShader(fragmentShaderObject)
	if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
		throw curContext.getShaderInfoLog(fragmentShaderObject)
	}

	let programObject = curContext.createProgram()
	curContext.attachShader(programObject, vertexShaderObject)
	curContext.attachShader(programObject, fragmentShaderObject)
	curContext.linkProgram(programObject)
	if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
		throw "Error linking shaders."
	}

	return programObject
}

function uniformMatrix(gl, glCache, cacheId, programObj, vrName, transpose, matrix) {
	let vrLocation = glCache[cacheId]
	if(vrLocation === undefined) {
		vrLocation = gl.getUniformLocation(programObj, vrName)
		glCache[cacheId] = vrLocation
	}
	gl.uniformMatrix4fv(vrLocation, transpose, matrix)
}

function vertexAttribPointer(gl, glCache, cacheId, programObj, vrName, size, VBO) {
	let vrLocation = glCache[cacheId]
	if(vrLocation === undefined) {
		vrLocation = gl.getAttribLocation(programObj, vrName)
		glCache[cacheId] = vrLocation
	}
	if (vrLocation !== -1) {
		gl.enableVertexAttribArray(vrLocation)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
		gl.vertexAttribPointer(vrLocation, size, gl.FLOAT, false, 0, 0)

	}
}

export { createProgramObject, uniformMatrix, vertexAttribPointer };