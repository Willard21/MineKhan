#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D uSampler;
varying vec2 vTexture;
varying float vShadow;

void main() {
    vec4 color = texture2D(uSampler, vTexture);
    gl_FragColor = vec4(color.rgb * vShadow, color.a);
    if (gl_FragColor.a == 0.0) discard;
}