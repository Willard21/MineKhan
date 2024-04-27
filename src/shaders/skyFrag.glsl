#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float uTime;
uniform vec3 uSun;
uniform vec3 uHorizon;
varying vec3 position;

const vec3 skyColor = vec3(0.25, 0.45, 0.7);
const vec3 sunColor = vec3(1.0, 1.0, 0.7);
const vec3 moonColor = vec3(0.7);
void main (void) {
	vec3 dir = normalize(position);
	float horizonal = 1.0 - abs(dir.y);

	float sunDot = dot(dir, uSun);
	vec3 col = mix(skyColor, uHorizon, horizonal * horizonal * (sunDot * 0.5 + 1.2)); // Mix the sky and the horizon

	// The sky starts getting darker when it's 30% above the horizon, then reachest max darkness at 50% below the horizon
	col *= max(smoothstep(-0.5, 0.3, -uSun.y), 0.1);

	// Draw the sun
	float sun = 1.0 - max(sunDot * 50.0 - 49.0, 0.0);
	col = mix(col, sunColor, 1.0 - sun * sun);

	if (dot(dir, -uSun) > 0.994) col = moonColor; // Draw the moon
	gl_FragColor = vec4(col, 1.0);
}