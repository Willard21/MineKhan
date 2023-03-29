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
	// If you are going to change this final lightlevel calculation
	// you have to change line 4487 as well since it calculates lightlevel of entity based on this

	gl_Position = uView * vec4(aVertex, 1.0);
	float dist = length(uPos - aVertex);
	float worldLight = max(aSkylight * uTime, aBlocklight);
	float dynamicLight = max(worldLight, uLantern - dist / 10.0);

	vShadow = aShadow * min(dynamicLight * 0.9 + 0.1, 1.0);

	float range = max(uDist / 5.0, 8.0);
	vFog = clamp((dist - uDist + range) / range, 0.0, 1.0);
}