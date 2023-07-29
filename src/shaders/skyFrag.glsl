#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float uTime;
uniform vec3 uSun;
uniform vec3 uHorizon;
varying vec3 position;

/*
float rand3D(in vec3 co) {
	return fract(sin(dot(co.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);
}
float simple_interpolate(in float a, in float b, in float x) {
	return a + smoothstep(0.0,1.0,x) * (b-a);
}
float interpolatedNoise3D(in float x, in float y, in float z) {
	float integer_x = x - fract(x);
	float fractional_x = x - integer_x;

	float integer_y = y - fract(y);
	float fractional_y = y - integer_y;

	float integer_z = z - fract(z);
	float fractional_z = z - integer_z;

	float v1 = rand3D(vec3(integer_x, integer_y, integer_z));
	float v2 = rand3D(vec3(integer_x+1.0, integer_y, integer_z));
	float v3 = rand3D(vec3(integer_x, integer_y+1.0, integer_z));
	float v4 = rand3D(vec3(integer_x+1.0, integer_y +1.0, integer_z));

	float v5 = rand3D(vec3(integer_x, integer_y, integer_z+1.0));
	float v6 = rand3D(vec3(integer_x+1.0, integer_y, integer_z+1.0));
	float v7 = rand3D(vec3(integer_x, integer_y+1.0, integer_z+1.0));
	float v8 = rand3D(vec3(integer_x+1.0, integer_y +1.0, integer_z+1.0));

	float i1 = simple_interpolate(v1,v5, fractional_z);
	float i2 = simple_interpolate(v2,v6, fractional_z);
	float i3 = simple_interpolate(v3,v7, fractional_z);
	float i4 = simple_interpolate(v4,v8, fractional_z);

	float ii1 = simple_interpolate(i1,i2,fractional_x);
	float ii2 = simple_interpolate(i3,i4,fractional_x);

	return simple_interpolate(ii1 , ii2 , fractional_y);
}
float Noise3D(in vec3 coord, in float wavelength) {
	return interpolatedNoise3D(coord.x/wavelength, coord.y/wavelength, coord.z/wavelength);
}
float noise(vec3 p, float frequency) {
	float sum = 0.0;
	for (float i = 0.0; i < 5.0; i++) {
		sum += Noise3D(p * frequency * pow(2.0, i), 1.0) / pow(2.0, i);
	}
	return sum * 0.5;
}
*/

const vec3 skyColor = vec3(0.25, 0.45, 0.7);
const vec3 sunColor = vec3(1.0, 1.0, 0.7);
const vec3 moonColor = vec3(0.7);
void main (void) {
	vec3 dir = normalize(position);
	float horizonal = 1.0 - abs(dir.y);

	float sunDot = dot(dir, uSun);
	vec3 col = mix(skyColor, uHorizon, horizonal * horizonal * (sunDot * 0.5 + 1.2)); // Mix the sky and the horizon
	

	// float cloud = noise(position + uTime * 0.02, 10.0);
	// col = mix(col, vec3(1.0), cloud);

	// The sky starts getting darker when it's 30% above the horizon, then reachest max darkness at 50% below the horizon
	col *= max(smoothstep(-0.5, 0.3, -uSun.y), 0.3);
	// col *= clamp((-uSun.y + 0.5) / 0.8, 0.1, 1.0);

	// Draw the sun
	float sun = 1.0 - max(sunDot * 50.0 - 49.0, 0.0);
	col = mix(col, sunColor, 1.0 - sun * sun);

	if (dot(dir, -uSun) > 0.994) col = moonColor; // Draw the moon
	gl_FragColor = vec4(col, 1.0);
}