attribute vec3 aVertex;
attribute vec2 aTexture;
attribute float aShadow;
varying vec2 vTexture;
varying float vShadow;
uniform vec2 uOffset;
uniform mat4 uView;

void main() {
	vTexture = aTexture;
	vShadow = aShadow;
	vec4 pos;
	if (uOffset.x != 0.0) pos = uView * vec4(aVertex, 1.0);
	else {
		pos.xy = aVertex.xy;
		pos.z = 0.5;
		pos.w = 1.0;
	}
	gl_Position = vec4(pos.x + uOffset.x, pos.y + uOffset.y, pos.z, 1.0);
}