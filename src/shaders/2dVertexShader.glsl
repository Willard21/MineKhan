attribute vec2 aVertex;
attribute vec2 aTexture;
attribute float aShadow;
varying vec2 vTexture;
varying float vShadow;

void main() {
    vTexture = aTexture;
    vShadow = aShadow;
    gl_Position = vec4(aVertex, 0.5, 1.0);
}