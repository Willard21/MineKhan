let fragmentShaderSrc3D = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uTime;
varying float vShadow;
varying vec2 vTexture;
varying float vFog;

void main(){
    vec4 color = texture2D(uSampler, vTexture);
    gl_FragColor = vec4(mix(color.rgb * vShadow, vec3(0.33, 0.54, 0.72) * uTime, vFog), color.a);
    if (gl_FragColor.a == 0.0) discard;
}`

export { fragmentShaderSrc3D as default };