attribute vec3  aVertex;
attribute vec2  aTexture;
attribute float aShadow;
attribute float aSkylight;
attribute float aBlocklight;
varying vec2  vTexture;
varying float vShadow;
varying float vFog;
varying vec3 vPosition;
uniform mat4 uView;
uniform float uDist;
uniform vec3 uPos;
uniform float uTime;
uniform float uLantern;

mat4 no_translate (mat4 mat) {
	mat4 nmat = mat;
	nmat[3].xyz = vec3(0.0);

	return nmat;
}

void main() {
	vPosition = uPos - aVertex;
	vTexture = aTexture;

	gl_Position = uView * vec4(aVertex, 1.0);
	float worldLight = max(aSkylight * uTime, aBlocklight);
	float dynamicLight = max(worldLight, uLantern - length(uPos - aVertex) / 10.0);

	vShadow = aShadow * min(dynamicLight * 0.9 + 0.1, 1.0);

	float range = 8.0;//clamp(uDist / 5.0, 8.0, 24.0);
	vFog = clamp((length(uPos.xz - aVertex.xz) - uDist + range) / range, 0.0, 1.0);
}