attribute vec3 aVertex;
uniform float uTime;
uniform mat4 uView;
varying vec3 position;
mat4 no_translate (mat4 mat) {
	mat4 nmat = mat;
	nmat[3].xyz = vec3(0.0);

	return nmat;
}
void main(void) {
   position = aVertex;
   gl_Position = no_translate(uView) * vec4(aVertex * -100.0, 0.0);
}