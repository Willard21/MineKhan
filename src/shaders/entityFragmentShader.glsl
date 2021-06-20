#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uLightLevel;
varying vec2 vTexture;

void main(){
    vec4 color = texture2D(uSampler, vTexture);
    gl_FragColor = vec4(color.rgb * uLightLevel, color.a);
}