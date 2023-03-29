#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uTime;
uniform bool uTrans;
uniform vec3 uSky; // The horizon color
uniform vec3 uSun; // The sun position
varying float vShadow;
varying vec2 vTexture;
varying float vFog;
varying vec3 vPosition;

const vec3 skyColor = vec3(0.25, 0.45, 0.7);
void main(){
	vec3 dir = normalize(vPosition);
	float horizonal = 1.0 - abs(dir.y);
    float sunDot = dot(dir, uSun);
	vec3 sky = mix(skyColor, uSky, horizonal * horizonal * (sunDot * 0.5 + 1.2)) * uTime;
		// * max(smoothstep(-0.5, 0.2, uTime), 0.1);

	vec4 color = texture2D(uSampler, vTexture);
	gl_FragColor = vec4(mix(color.rgb * vShadow, sky, vFog), color.a);
	if (!uTrans && gl_FragColor.a != 1.0) discard;
	else if (uTrans && gl_FragColor.a == 1.0) discard;
}