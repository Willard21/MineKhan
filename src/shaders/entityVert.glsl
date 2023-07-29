attribute vec3  aVertex;
attribute vec2  aTexture;
varying vec2  vTexture;
uniform mat4 uView;

void main() {
    vTexture = aTexture;
    gl_Position = uView * vec4(aVertex, 1.0);
}