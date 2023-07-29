attribute vec3  aVertex;
attribute vec2  aTexture;
attribute float aShadow;
attribute float aSkylight;
attribute float aBlocklight;
varying vec2  vTexture;
varying float vShadow;
uniform mat4 uView;
uniform vec3 uPos;
uniform float uTime;
uniform float uLantern;

mat4 no_translate (mat4 mat) {
	mat4 nmat = mat;
	nmat[3].xyz = vec3(0.0);

	return nmat;
}

void main() {
	vTexture = aTexture;
	gl_Position = uView * vec4(aVertex, 1.0);

	float dist = length(uPos - aVertex);
	float worldLight = max(aSkylight * uTime, aBlocklight);
	float dynamicLight = max(worldLight, uLantern - dist / 10.0);
	vShadow = aShadow * min(dynamicLight * 0.9 + 0.1, 1.0);
}