#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uTime;
uniform bool uTrans;
uniform vec3 uSky; // vec3(0.33, 0.54, 0.72)
varying float vShadow;
varying vec2 vTexture;
varying float vFog;

void main(){
    vec4 color = texture2D(uSampler, vTexture);
    gl_FragColor = vec4(mix(color.rgb * vShadow, uSky * uTime, vFog), color.a);
    if (!uTrans && gl_FragColor.a != 1.0) discard;
    else if (uTrans && gl_FragColor.a == 1.0) discard;
}