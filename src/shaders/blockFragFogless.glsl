#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

uniform sampler2D uSampler;
uniform bool uTrans;
varying float vShadow;
varying vec2 vTexture;

void main(){
	vec4 color = texture2D(uSampler, vTexture);
	gl_FragColor = vec4(color.rgb * vShadow, color.a);

	if (!uTrans && gl_FragColor.a != 1.0 || uTrans && gl_FragColor.a == 1.0) discard;
}