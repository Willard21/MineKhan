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
	vec4 sky = vec4(mix(skyColor, uSky, horizonal * horizonal * (sunDot * 0.5 + 1.2)) * uTime, 1.0);
		// * max(smoothstep(-0.5, 0.2, uTime), 0.1);

	vec4 color = texture2D(uSampler, vTexture);
	gl_FragColor = mix(vec4(color.rgb * vShadow, color.a), sky, vFog);
	if (!uTrans && color.a != 1.0 || uTrans && (color.a == 1.0 || color.a == 0.0)) discard;
}