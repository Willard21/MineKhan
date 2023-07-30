/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec3  aVertex;\r\nattribute vec2  aTexture;\r\nattribute float aShadow;\r\nattribute float aSkylight;\r\nattribute float aBlocklight;\r\nvarying vec2  vTexture;\r\nvarying float vShadow;\r\nvarying float vFog;\r\nvarying vec3 vPosition;\r\nuniform mat4 uView;\r\nuniform float uDist;\r\nuniform vec3 uPos;\r\nuniform float uTime;\r\nuniform float uLantern;\r\n\r\nmat4 no_translate (mat4 mat) {\r\n\tmat4 nmat = mat;\r\n\tnmat[3].xyz = vec3(0.0);\r\n\r\n\treturn nmat;\r\n}\r\n\r\nvoid main() {\r\n\tvPosition = uPos - aVertex;\r\n\tvTexture = aTexture;\r\n\r\n\tgl_Position = uView * vec4(aVertex, 1.0);\r\n\tfloat worldLight = max(aSkylight * uTime, aBlocklight);\r\n\tfloat dynamicLight = max(worldLight, uLantern - length(uPos - aVertex) / 10.0);\r\n\r\n\tvShadow = aShadow * min(dynamicLight * 0.9 + 0.1, 1.0);\r\n\r\n\tfloat range = 8.0;//clamp(uDist / 5.0, 8.0, 24.0);\r\n\tvFog = clamp((length(uPos.xz - aVertex.xz) - uDist + range) / range, 0.0, 1.0);\r\n}");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D uSampler;\r\nuniform float uTime;\r\nuniform bool uTrans;\r\nuniform vec3 uSky; // The horizon color\r\nuniform vec3 uSun; // The sun position\r\nvarying float vShadow;\r\nvarying vec2 vTexture;\r\nvarying float vFog;\r\nvarying vec3 vPosition;\r\n\r\nconst vec3 skyColor = vec3(0.25, 0.45, 0.7);\r\nvoid main(){\r\n\tvec3 dir = normalize(vPosition);\r\n\tfloat horizonal = 1.0 - abs(dir.y);\r\n    float sunDot = dot(dir, uSun);\r\n\tvec4 sky = vec4(mix(skyColor, uSky, horizonal * horizonal * (sunDot * 0.5 + 1.2)) * uTime, 1.0);\r\n\t\t// * max(smoothstep(-0.5, 0.2, uTime), 0.1);\r\n\r\n\tvec4 color = texture2D(uSampler, vTexture);\r\n\tgl_FragColor = mix(vec4(color.rgb * vShadow, color.a), sky, vFog);\r\n\tif (!uTrans && color.a != 1.0 || uTrans && (color.a == 1.0 || color.a == 0.0)) discard;\r\n}");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec3  aVertex;\nattribute vec2  aTexture;\nattribute float aShadow;\nattribute float aSkylight;\nattribute float aBlocklight;\nvarying vec2  vTexture;\nvarying float vShadow;\nuniform mat4 uView;\nuniform vec3 uPos;\nuniform float uTime;\nuniform float uLantern;\n\nmat4 no_translate (mat4 mat) {\n\tmat4 nmat = mat;\n\tnmat[3].xyz = vec3(0.0);\n\n\treturn nmat;\n}\n\nvoid main() {\n\tvTexture = aTexture;\n\tgl_Position = uView * vec4(aVertex, 1.0);\n\n\tfloat dist = length(uPos - aVertex);\n\tfloat worldLight = max(aSkylight * uTime, aBlocklight);\n\tfloat dynamicLight = max(worldLight, uLantern - dist / 10.0);\n\tvShadow = aShadow * min(dynamicLight * 0.9 + 0.1, 1.0);\n}");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#ifdef GL_FRAGMENT_PRECISION_HIGH\n\tprecision highp float;\n#else\n\tprecision mediump float;\n#endif\n\nuniform sampler2D uSampler;\nuniform bool uTrans;\nvarying float vShadow;\nvarying vec2 vTexture;\n\nvoid main(){\n\tvec4 color = texture2D(uSampler, vTexture);\n\tgl_FragColor = vec4(color.rgb * vShadow, color.a);\n\n\tif (!uTrans && gl_FragColor.a != 1.0 || uTrans && gl_FragColor.a == 1.0) discard;\n}");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 aVertex;\r\nattribute vec2 aTexture;\r\nattribute float aShadow;\r\nvarying vec2 vTexture;\r\nvarying float vShadow;\r\nuniform vec2 uOffset;\r\n\r\nvoid main() {\r\n    vTexture = aTexture;\r\n    vShadow = aShadow;\r\n    gl_Position = vec4(aVertex.x + uOffset.x, aVertex.y + uOffset.y, 0.5, 1.0);\r\n}");

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n    precision highp float;\r\n#else\r\n    precision mediump float;\r\n#endif\r\n\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTexture;\r\nvarying float vShadow;\r\n\r\nvoid main() {\r\n    vec4 color = texture2D(uSampler, vTexture);\r\n    gl_FragColor = vec4(color.rgb * vShadow, color.a);\r\n}");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec3  aVertex;\r\nattribute vec2  aTexture;\r\nvarying vec2  vTexture;\r\nuniform mat4 uView;\r\n\r\nvoid main() {\r\n    vTexture = aTexture;\r\n    gl_Position = uView * vec4(aVertex, 1.0);\r\n}");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n    precision highp float;\r\n#else\r\n    precision mediump float;\r\n#endif\r\n\r\nuniform sampler2D uSampler;\r\nuniform float uLightLevel;\r\nvarying vec2 vTexture;\r\n\r\nvoid main(){\r\n    vec4 color = texture2D(uSampler, vTexture);\r\n    gl_FragColor = vec4(color.rgb * uLightLevel, color.a);\r\n}");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("async function Worker() {\n\t// Originally this stuff was generated in code\n\tconst GRADIENTS_3D = new Int8Array([-11,4,4,-4,11,4,-4,4,11,11,4,4,4,11,4,4,4,11,-11,-4,4,-4,-11,4,-4,-4,11,11,-4,4,4,-11,4,4,-4,11,-11,4,-4,-4,11,-4,-4,4,-11,11,4,-4,4,11,-4,4,4,-11,-11,-4,-4,-4,-11,-4,-4,-4,-11,11,-4,-4,4,-11,-4,4,-4,-11])\n\tconst POSITIONS = [-1,180,216,528,624,-1,912,288,144,360,252,816,-1,-1,720,216,-1,-1,72,960,-1,-1,912,36,144,360,0,816,-1,480,576,72,324,-1,144,-1,432,-1,624,36,-1,288,108,576,-1,864,-1,180,252,36,144,672,-1,-1,-1,108,-1,-1,396,-1,-1,-1,432,360,252,36,324,-1,768,-1,528,396,0,-1,252,480,-1,672,-1,360]\n\tconst DATA = [0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-1,-255,0,1,255,0,-1,0,-255,1,0,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,-1,0,255,1,0,0,-1,-255,0,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-255,0,-1,255,0,1,0,-255,-1,0,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-4/3,-4/3,-255.33333333333334,1,1,255,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-2/3,-5/3,1,0,1,-4/3,-255.33333333333334,-4/3,1,255,1,0,0,0,0,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-2,-1,2,1,0,-2,-3,-1,1,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-3,-1,-2,2,0,1,-2,-1,-3,1,0,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1,-3,-2,0,2,1,-1,-2,-3,0,1,2,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-4/3,-1/3,-1/3,1,0,0,-8/3,-2/3,-2/3,2,0,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-4/3,-1/3,0,1,0,-2/3,-8/3,-2/3,0,2,0,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-1/3,-1/3,-4/3,0,0,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-255.33333333333334,-4/3,1,255,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-255.33333333333334,-4/3,-4/3,255,1,1,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,0,0,0,0,0,0,-4/3,-4/3,-255.33333333333334,1,1,255,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-2,-2,-2,1,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-255.33333333333334,-4/3,1,255,1,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-2/3,-8/3,0,0,2,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-255.33333333333334,-4/3,-4/3,255,1,1,-2/3,-8/3,-2/3,0,2,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-8/3,-2/3,-2/3,2,0,0,-4/3,-1/3,-1/3,1,0,0,-1/3,-4/3,-1/3,0,1,0,-1/3,-1/3,-4/3,0,0,1,-5/3,-5/3,-2/3,1,1,0,-5/3,-2/3,-5/3,1,0,1,-2/3,-5/3,-5/3,0,1,1,-4/3,-4/3,-255.33333333333334,1,1,255,-2/3,-8/3,-2/3,0,2,0]\n\tlet SPHERE = new Int16Array([-529, -528, -527, -513, -512, -511, -497, -496, -495, -289, -288, -287, -274, -273, -272, -271, -270, -258, -257, -256, -255, -254, -242, -241, -240, -239, -238, -225, -224, -223, -33, -32, -31, -18, -17, -16, -15, -14, -2, -1, 0, 1, 2, 14, 15, 16, 17, 18, 31, 32, 33, 223, 224, 225, 238, 239, 240, 241, 242, 254, 255, 256, 257, 258, 270, 271, 272, 273, 274, 287, 288, 289, 495, 496, 497, 511, 512, 513, 527, 528, 529])\n\n\tlet data, positions, perm, perm3D, caves, gradients3D, sphere\n\tfunction seedNoise(seed, buffer) {\n\t\tpositions = new Int32Array(buffer, 0, 80)\n\t\tdata = new Float64Array(buffer, positions.byteLength, DATA.length)\n\t\tconst source = new Uint8Array(buffer, data.byteOffset + data.byteLength, 256)\n\t\tperm = new Uint8Array(buffer, source.byteOffset + source.byteLength, 256)\n\t\tperm3D = new Uint8Array(buffer, perm.byteOffset + perm.byteLength, 256)\n\t\tgradients3D = new Int8Array(buffer, perm3D.byteOffset + perm3D.byteLength, GRADIENTS_3D.length)\n\t\tcaves = new Uint8Array(buffer, gradients3D.byteOffset + gradients3D.byteLength, 16 * 16 * 82)\n\t\tsphere = new Int16Array(buffer, caves.byteOffset + caves.byteLength, SPHERE.length)\n\n\t\tsphere.set(SPHERE)\n\t\tpositions.set(POSITIONS)\n\t\tdata.set(DATA)\n\t\tgradients3D.set(GRADIENTS_3D)\n\n\t\tfor (let i = 0; i < 256; i++) source[i] = i\n\t\tfor (let i = 0; i < 3; i++) {\n\t\t\tseed = seed * 1664525 + 1013904223 | 0\n\t\t}\n\t\tfor (let i = 255; i >= 0; i--) {\n\t\t\tseed = seed * 1664525 + 1013904223 | 0\n\t\t\tlet r = (seed + 31) % (i + 1)\n\t\t\tif (r < 0) r += i + 1\n\t\t\tperm[i] = source[r]\n\t\t\tperm3D[i] = perm[i] % 24 * 3\n\t\t\tsource[r] = source[i]\n\t\t}\n\t}\n\n\t/*\n\tconst { abs, floor } = Math\n\tconst NORM_3D = 1.0 / 206.0\n\tconst SQUISH_3D = 1 / 3\n\tconst STRETCH_3D = -1 / 6\n\tfunction noise(x, y, z) {\n\t\tconst stretchOffset = (x + y + z) * STRETCH_3D\n\t\tconst xs = x + stretchOffset\n\t\tconst ys = y + stretchOffset\n\t\tconst zs = z + stretchOffset\n\t\tconst xsb = floor(xs)\n\t\tconst ysb = floor(ys)\n\t\tconst zsb = floor(zs)\n\t\tconst xins = xs - xsb\n\t\tconst yins = ys - ysb\n\t\tconst zins = zs - zsb\n\t\tconst inSum = xins + yins + zins\n\n\t\tconst bits = yins - zins + 1\n\t\t| xins - yins + 1 << 1\n\t\t| xins - zins + 1 << 2\n\t\t| inSum << 3\n\t\t| inSum + zins << 5\n\t\t| inSum + yins << 7\n\t\t| inSum + xins << 9\n\n\t\tconst n = bits * 571183418275 + 1013904223 >>> 1\n\n\t\tlet c = positions[n % 80]\n\t\tif (c === -1) return 0\n\t\tlet value = 0\n\t\tconst squishOffset = (xsb + ysb + zsb) * SQUISH_3D\n\t\tconst dx0 = x - (xsb + squishOffset)\n\t\tconst dy0 = y - (ysb + squishOffset)\n\t\tconst dz0 = z - (zsb + squishOffset)\n\t\tconst count = c < 432 ? 6 : 8\n\t\tfor (let j = 0; j < count ; j++) {\n\t\t\tconst dx = dx0 + data[c]\n\t\t\tconst dy = dy0 + data[c+1]\n\t\t\tconst dz = dz0 + data[c+2]\n\t\t\tlet attn = 2 - dx * dx - dy * dy - dz * dz\n\t\t\tif (attn > 0) {\n\t\t\t\tlet i = perm3D[(perm[xsb + data[c+3] & 0xFF] + (ysb + data[c+4]) & 0xFF) + (zsb + data[c+5]) & 0xFF]\n\t\t\t\tattn *= attn\n\t\t\t\tvalue += attn * attn * (gradients3D[i] * dx + gradients3D[i + 1] * dy + gradients3D[i + 2] * dz)\n\t\t\t}\n\t\t\tc += 6\n\t\t}\n\n\t\treturn value * NORM_3D + 0.5\n\t}\n\tconst smooth = 0.02\n\tconst caveSize = 0.0055\n\tfunction isCave(x, y, z) {\n\t\t// Generate a 3D rigid multifractal noise shell.\n\t\t// Then generate another one with different coordinates.\n\t\t// Overlay them on top of each other, and the overlapping edges should form a cave-like structure.\n\t\t// This is extremely slow, and requires generating 1 or 2 noise values for every single block in the world.\n\t\t// TODO: replace with a crawler system of some sort, that will never rely on a head position in un-generated chunks.\n\n\t\treturn abs(0.5 - noise(x * smooth, y * smooth, z * smooth)) < caveSize\n\t\t\t&& abs(0.5 - noise(y * smooth, z * smooth, x * smooth)) < caveSize\n\t}\n\t*/\n\n\t// This is my compiled cave generation code. I wrote it in C. It includes my OpenSimplexNoise function, plus the logic to carve caves within the borders of the chunk it's operating on.\n\tconst program = new Uint8Array(atob(\"AGFzbQEAAAABEQNgAABgA3x8fAF8YAJ/fwF/AwQDAAECBAUBcAEBAQUEAQEBAQcdBAZtZW1vcnkCAAFiAAAIZ2V0Q2F2ZXMAAgFkAQAMAQAKzwYDAwABC4YEAgR/CHxEAAAAAAAA8D8gASAAoCACoERVVVVVVVXFv6IiByABoCILIAucIguhIgqhIAcgAKAiDCAMnCIMoSIIoKohA0GACCgCAEQAAAAAAADwPyAHIAKgIgcgB5wiB6EiDaEiCSAKoKogA0EBdHIgCSAIoKpBAnRyIAggCqAgDaAiCapBA3RyIAkgDaCqQQV0ciAJIAqgqkEHdHIgCSAIoKpBCXRyQaOXvWlsQd/mu+MDakEBdkHQAHBBAnRqKAIAIgRBf0YEQEQAAAAAAAAAAA8LIAIgB6EgDCALoCAHoERVVVVVVVXVv6IiAqAhCSABIAuhIAKgIQ0gACAMoSACoCEOQQZBCCAEQbADSBshBkQAAAAAAAAAACEBA0BEAAAAAAAAAEAgDSAEQQN0IgMrA8gCoCIAIACiIA4gAysDwAKgIgIgAqKgIAkgAysD0AKgIgogCqKgoSIIRAAAAAAAAAAAZUUEQCAIIAiiIgggCKIgACADKwPoAiAHoKogAysD2AIgDKCqQf8BcUHAwwBqLQAAIAMrA+ACIAugqmpqQf8BcUHAxQBqLAAAIgNBwccAaiwAALeiIAIgA0HAxwBqLAAAt6KgIAogA0HCxwBqLAAAt6KgoiABoCEBCyAEQQZqIQQgBUEBaiIFIAZHDQALIAFEAqnkvCzicz+iRAAAAAAAAOA/oAvAAgIDfwN8QYjIAEEAQYCkAfwLAEGACCECA0ACQEQAAAAAAADgPyACQQR2QQ9xIgQgAGq3RHsUrkfhepQ/oiIFIAJBCHa3RHsUrkfhepQ/oiIGIAJBD3EiAyABardEexSuR+F6lD+iIgcQAaGZRLpJDAIrh3Y/Zg0ARAAAAAAAAOA/IAYgByAFEAGhmUS6SQwCK4d2P2YNAAJAIARBAmtBC0sNACADQQJJDQBBACEEIANBDUsNAANAIAIgBEEBdEGI7AFqLgEAaiIDQYjIAGotAABBAUcEQCADQQI6AIhICyAEQQFyIgNB0QBGDQIgAiADQQF0QYjsAWouAQBqIgNBiMgAai0AAEEBRwRAIANBAjoAiEgLIARBAmohBAwACwALIAJBiMgAakEBOgAACyACQQFqIgJBgKABRw0AC0GIyAAL\").split(\"\").map(c => c.charCodeAt(0))).buffer\n\n\tconst wasm = await WebAssembly.instantiate(program)\n\t// const wasm = await WebAssembly.instantiateStreaming(fetch('http://localhost:4000//caves.wasm'))\n\t// const wasm = await WebAssembly.instantiateStreaming(fetch('http://localhost:4000//wasm_bg.wasm'))\n\n\tconst exports = wasm.instance.exports\n\tconst wasmCaves = exports.getCaves || exports.get_caves || exports.c\n\tconst wasmMemory = exports.memory || exports.a\n\n\tself.onmessage = function(e) {\n\t\tif (e.data && e.data.seed) {\n\t\t\tif (exports.seed_noise) exports.seed_noise(e.data.seed)\n\t\t\telse seedNoise(e.data.seed, wasmMemory.buffer)\n\t\t\tself.postMessage(e.data)\n\t\t}\n\t\tif (e.data && e.data.caves) {\n\t\t\tconst { x, z } = e.data\n\t\t\tconst ptr = wasmCaves(x, z)\n\t\t\t// const buffer = wasmMemory.buffer.slice(ptr, ptr + 20992)\n\t\t\tconst arr = new Int8Array(wasmMemory.buffer, ptr, 20992)\n\n\t\t\tlet air = []\n\t\t\tlet carve = []\n\t\t\tfor (let i = 512; i < arr.length; i++) {\n\t\t\t\tif (arr[i] === 1) carve.push(i)\n\t\t\t\telse if (arr[i] === 2) air.push(i)\n\t\t\t}\n\t\t\tlet airArr = new Uint16Array(air)\n\t\t\tlet carveArr = new Uint16Array(carve)\n\n\t\t\tself.postMessage({\n\t\t\t\tair: airArr,\n\t\t\t\tcarve: carveArr\n\t\t\t}, [airArr.buffer, carveArr.buffer])\n\t\t}\n\t}\n}\nWorker()");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 12 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\r\n\toverflow: hidden; /* Hide scrollbars */\r\n\tbackground-color: black;\r\n}\r\n.world-select {\r\n\twidth: 99vw;\r\n\tmin-width: 300px;\r\n\theight: calc(100vh - 220px);\r\n\tposition: absolute;\r\n\tbottom: 120px;\r\n\toverflow-y: auto;\r\n\tbackground-color: RGBA(0, 0, 0, 0.6);\r\n\tjustify-content: center;\r\n\tmargin: 0 auto;\r\n}\r\n.world {\r\n\twidth: 250px;\r\n\theight: auto;\r\n\tborder: 1px solid black;\r\n\tfont-size: 18px;\r\n\tfont-family: 'Courier New', Courier, monospace;\r\n\tcolor: rgb(180, 180, 180);\r\n\tmargin: 0 auto;\r\n\tmargin-top: 15px;\r\n\tpadding: 5px;\r\n\tcursor: pointer;\r\n}\r\nstrong {\r\n\tcolor: white;\r\n}\r\n.selected {\r\n\tborder: 3px solid white;\r\n\tpadding: 3px;\r\n}\r\ninput[type=text] {\r\n\tbackground-color: black;\r\n\tcaret-color: white;\r\n\tborder: 2px solid gray;\r\n\tcolor: white;\r\n\tfont-size: 24px;\r\n\tpadding-left: 12px;\r\n}\r\ninput[type=text]:focus {\r\n\tborder: 2px solid lightgray;\r\n}\r\n#boxcentertop {\r\n\tz-index: 1;\r\n\twidth: 80vw;\r\n\tmax-width: 400px;\r\n\theight: 50px;\r\n\tposition: relative;\r\n\ttop: 30px;\r\n\tdisplay: block;\r\n\tmargin: 0 auto;\r\n}\r\n.hidden {\r\n\tdisplay: none !important;\r\n}\r\n#onhover {\r\n\tbackground-color: rgba(0, 0, 0, 0.9);\r\n\tcolor: rgb(200, 200, 200);\r\n\tfont-family: 'Courier New', Courier, monospace;\r\n\tword-wrap: normal;\r\n\twidth: auto;\r\n\tmax-width: 400px;\r\n\tposition: absolute;\r\n\tz-index: 1;\r\n\tpadding: 10px;\r\n\tcursor: default;\r\n}\r\n#quota {\r\n\tdisplay: block;\r\n\tposition: absolute;\r\n\twidth: 99vw;\r\n\tmargin: 0 auto;\r\n\tbottom: 110px;\r\n\tz-index: 1;\r\n\tbackground-color: RGBA(0, 0, 0, 0.6);\r\n\tjustify-content: center;\r\n\ttext-align: center;\r\n\tcolor: white;\r\n}\r\n#chat {\r\n\tposition: absolute;\r\n\tleft: 0px;\r\n\ttop: 100px;\r\n\theight: calc(100vh - 200px);\r\n\toverflow-y: auto;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 20px;\r\n\twidth: 40vw;\r\n\tmin-width: 600px;\r\n\tbackground-color: RGBA(0, 0, 0, 0.8);\r\n\tcolor: white;\r\n}\r\n#chat > div > span {\r\n\twhite-space: pre-wrap;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\n#chatbar {\r\n\tposition: absolute;\r\n\tleft: 30px;\r\n\tbottom: 0px;\r\n\theight: 20;\r\n\twidth: calc(100vw - 60px);\r\n\tbackground-color: RGBA(0, 0, 0, 0.8);\r\n\tcolor: white;\r\n}\r\n.message {\r\n\twidth: 100%;\r\n\tbackground-color: transparent;\r\n\tpadding: 10px;\r\n\tword-wrap: break-word;\r\n}\r\n@font-face {\r\n\tfont-family: 'VT323';\r\n\tfont-style: normal;\r\n\tfont-weight: 400;\r\n\tfont-display: swap;\r\n\tsrc: url(https://willard.fun/fonts/VT323.woff2) format('woff2');\r\n\tunicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\r\n}\r\n#background-text {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\twidth: 100vw;\r\n\theight: 100vh;\r\n\tz-index: -10;\r\n}\r\n#loading-text {\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\ttransform: translate(-50%, -50%);\r\n\ttext-align: center;\r\n\tcolor: #fff;\r\n\tfont-size: 30px;\r\n\tfont-family: monospace;\r\n}\r\n#inv-container {\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\ttop: 50px;\r\n\ttransform: translate(-50%, 0);\r\n\theight: 80hv;\r\n\tmax-height: 500px;\r\n\twidth: fit-content;\r\n\toverflow-y: scroll;\r\n\tpadding: 0;\r\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 13 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hash": () => (/* binding */ hash),
/* harmony export */   "noiseProfile": () => (/* binding */ noiseProfile),
/* harmony export */   "openSimplexNoise": () => (/* binding */ openSimplexNoise),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "randomSeed": () => (/* binding */ randomSeed),
/* harmony export */   "seedHash": () => (/* binding */ seedHash)
/* harmony export */ });
const { imul, floor } = Math

// implementation of xxHash
const {
	seedHash,
	hash
} = (() => {
	// closure around mutable `seed`; updated via calls to `seedHash`

	let seed = Math.random() * 2100000000 | 0

	const PRIME32_2 = 1883677709
	const PRIME32_3 = 2034071983
	const PRIME32_4 = 668265263
	const PRIME32_5 = 374761393

	const seedHash = s => {
		seed = s | 0
	}

	const hash = (x, y) => {
		let h32 = 0

		h32 = seed + PRIME32_5 | 0
		h32 += 8

		h32 += imul(x, PRIME32_3)
		h32 = imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)
		h32 += imul(y, PRIME32_3)
		h32 = imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)

		h32 ^= h32 >> 15
		h32 *= PRIME32_2
		h32 ^= h32 >> 13
		h32 *= PRIME32_3
		h32 ^= h32 >> 16

		return h32 / 2147483647
	}

	return {
		seedHash,
		hash
	}
})()

class Marsaglia {
	// from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c

	nextInt() {
		const { z, w } = this

		this.z = 36969 * (z & 65535) + (z >>> 16) & 0xFFFFFFFF
		this.w = 18000 * (w & 65535) + (w >>> 16) & 0xFFFFFFFF

		return ((this.z & 0xFFFF) << 16 | this.w & 0xFFFF) & 0xFFFFFFFF
	}

	nextDouble() {
		const i = this.nextInt() / 4294967296

		const isNegative = i < 0 | 0 // cast to 1 or 0

		return isNegative + i
	}

	constructor(i1, i2) { // better param names
		this.z = i1 | 0 || 362436069
		this.w = i2 || hash(521288629, this.z) * 2147483647 | 0
	}
}

// The noise and random functions are copied from the processing.js source code

const {
	randomSeed,
	random
} = (() => {
	// closure around mut `currentRandom`

	let currentRandom = null

	const randomSeed = seed => {
		currentRandom = new Marsaglia(seed)
	}

	const random = (min, max) => {
		if (!max) {
			if (min) {
				max = min
				min = 0
			}
			else {
				min = 0
				max = 1
			}
		}

		return currentRandom.nextDouble() * (max - min) + min
	}

	return {
		randomSeed,
		random
	}
})()

class PerlinNoise {
	// http://www.noisemachine.com/talk1/17b.html
	// http://mrl.nyu.edu/~perlin/noise/

	static grad3d(i, x, y, z) {
		const h = i & 15 // convert into 12 gradient directions

		const u = h < 8
			? x
			: y

		const v = h < 4
			? y
			: h === 12 || h === 14
				? x
				: z

		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
	}

	static grad2d(i, x, y) {
		const v = (i & 1) === 0
			? x
			: y

		return (i & 2) === 0
			? -v
			: v
	}

	static grad1d(i, x) {
		return (i & 1) === 0
			? -x
			: x
	}

	static lerp(t, a, b) {
		return a + t * (b - a)
	}

	// end of statics

	// prototype functions:
	noise3d(x, y, z) {
		const X = floor(x) & 0xff
		const Y = floor(y) & 0xff
		const Z = floor(z) & 0xff

		x -= floor(x)
		y -= floor(y)
		z -= floor(z)

		const fx = (3 - 2 * x) * x * x
		const fy = (3 - 2 * y) * y * y
		const fz = (3 - 2 * z) * z * z

		const { perm } = this

		const p0 = perm[X] + Y
		const p00 = perm[p0] + Z
		const p01 = perm[p0 + 1] + Z
		const p1 = perm[X + 1] + Y
		const p10 = perm[p1] + Z
		const p11 = perm[p1 + 1] + Z

		const { lerp, grad3d } = PerlinNoise

		return lerp(
			fz,
			lerp(
				fy,
				lerp(
					fx,
					grad3d(perm[p00], x, y, z),
					grad3d(perm[p10], x - 1, y, z)
				),
				lerp(
					fx,
					grad3d(perm[p01], x, y - 1, z),
					grad3d(perm[p11],x - 1, y - 1, z)
				)
			),
			lerp(
				fy,
				lerp(
					fx,
					grad3d(perm[p00 + 1], x, y, z - 1),
					grad3d(perm[p10 + 1], x - 1, y, z - 1)
				),
				lerp(
					fx,
					grad3d(perm[p01 + 1], x, y - 1, z - 1),
					grad3d(perm[p11 + 1], x - 1, y - 1, z - 1)
				)
			)
		)
	}

	noise2d(x, y) {
		const X = floor(x) & 0xff
		const Y = floor(y) & 0xff

		x -= floor(x)
		y -= floor(y)

		const { perm } = this
		const fx = (3 - 2 * x) * x * x
		const fy = (3 - 2 * y) * y * y
		const p0 = perm[X] + Y
		const p1 = perm[X + 1] + Y

		const { lerp, grad2d } = PerlinNoise

		return lerp(
			fy,
			lerp(
				fx,
				grad2d(
					perm[p0],
					x,
					y
				),
				grad2d(
					perm[p1],
					x - 1,
					y
				)
			),
			lerp(
				fx,
				grad2d(
					perm[p0 + 1],
					x,
					y - 1
				),
				grad2d(
					perm[p1 + 1],
					x - 1,
					y - 1
				)
			)
		)
	}

	constructor(seed) {
		if (seed === undefined) {
			throw new TypeError("A value for `seed` parameter was not provided to `PerlinNoise`")
		}
		// console.log("New noise generator with seed", seed)

		const rnd = new Marsaglia(seed)

		// generate permutation
		const perm = new Uint8Array(0x200)
		this.perm = perm

		// fill 0x0..0x100
		for (let i = 0; i < 0x100; ++i) {
			perm[i] = i
		}

		for (let i = 0; i < 0x100; ++i) {
			const j = rnd.nextInt() & 0xFF
			const t = perm[j]
			perm[j] = perm[i]
			perm[i] = t
		}

		// copy to avoid taking mod in perm[0]
		// copies from first half of array, into the second half
		perm.copyWithin(0x100, 0x0, 0x100)
	}
}

const noiseProfile = {
	generator: undefined,
	octaves: 4,
	fallout: 0.5,
	seed: undefined,
	noiseSeed(seed) {
		this.seed = seed
		this.generator = new PerlinNoise(noiseProfile.seed)
	},
	noise(x, y, z) {
		const { generator, octaves, fallout } = this

		let effect = 1,
			sum = 0

		for (let i = 0; i < octaves; ++i) {
			effect *= fallout

			const k = 1 << i

			let temp
			switch (arguments.length) {
				case 1: {
					temp = generator.noise1d(k * x)
					break
				} case 2: {
					temp = generator.noise2d(k * x, k * y)
					break
				} case 3: {
					temp = generator.noise3d(k * x, k * y, k * z)
					break
				}
			}

			sum += effect * (1 + temp) / 2
		}

		return sum
	}
}

// Copied and modified from https://github.com/blindman67/SimplexNoiseJS
function openSimplexNoise(clientSeed) {
	const toNums = function(s) {
		return s.split(",").map(function(s) {
			return new Uint8Array(s.split("").map(function(v) {
				return Number(v)
			}))
		})
	}
	const decode = function(m, r, s) {
		return new Int8Array(s.split("").map(function(v) {
			return parseInt(v, r) + m
		}))
	}
	const toNumsB32 = function(s) {
		return s.split(",").map(function(s) {
			return parseInt(s, 32)
		})
	}
	const NORM_3D = 1.0 / 206.0
	const SQUISH_3D = 1 / 3
	const STRETCH_3D = -1 / 6
	var base3D = toNums("0000110010101001,2110210120113111,110010101001211021012011")
	const gradients3D = decode(-11, 23, "0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70")
	var lookupPairs3D = function() {
		return new Uint16Array(toNumsB32("0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6"))
	}
	var p3D = decode(-1, 5, "112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131")
	const setOf = function(count) {
		var a = [], i = 0
		while (i < count) {
			a.push(i++)
		}
		return a
	}
	const doFor = function(count, cb) {
		var i = 0
		while (i < count && cb(i++) !== true);
	}

	function shuffleSeed(seed,count){
		seed = seed * 1664525 + 1013904223 | 0
		count -= 1
		return count > 0 ? shuffleSeed(seed, count) : seed
	}
	const types = {
		_3D : {
			base : base3D,
			squish : SQUISH_3D,
			dimensions : 3,
			pD : p3D,
			lookup : lookupPairs3D,
		}
	}

	function createContribution(type, baseSet, index) {
		var i = 0
		const multiplier = baseSet[index ++]
		const c = { next : undefined }
		while(i < type.dimensions) {
			const axis = "xyzw"[i]
			c[axis + "sb"] = baseSet[index + i]
			c["d" + axis] = - baseSet[index + i++] - multiplier * type.squish
		}
		return c
	}

	function createLookupPairs(lookupArray, contributions){
		var i
		const a = lookupArray()
		const res = new Map()
		for (i = 0; i < a.length; i += 2) {
			res.set(a[i], contributions[a[i + 1]])
		}
		return res
	}

	function createContributionArray(type) {
		const conts = []
		const d = type.dimensions
		const baseStep = d * d
		var k, i = 0
		while (i < type.pD.length) {
			const baseSet = type.base[type.pD[i]]
			let previous, current
			k = 0
			do {
				current = createContribution(type, baseSet, k)
				if (!previous) {
					conts[i / baseStep] = current
				}
				else {
					previous.next = current
				}
				previous = current
				k += d + 1
			} while(k < baseSet.length)

			current.next = createContribution(type, type.pD, i + 1)
			if (d >= 3) {
				current.next.next = createContribution(type, type.pD, i + d + 2)
			}
			if (d === 4) {
				current.next.next.next = createContribution(type, type.pD, i + 11)
			}
			i += baseStep
		}
		const result = [conts, createLookupPairs(type.lookup, conts)]
		type.base = undefined
		type.lookup = undefined
		return result
	}

	let temp = createContributionArray(types._3D)
	const lookup3D = temp[1]
	const perm = new Uint8Array(256)
	const perm3D = new Uint8Array(256)
	const source = new Uint8Array(setOf(256))
	var seed = shuffleSeed(clientSeed, 3)
	doFor(256, function(i) {
		i = 255 - i
		seed = shuffleSeed(seed, 1)
		var r = (seed + 31) % (i + 1)
		r += r < 0 ? i + 1 : 0
		perm[i] = source[r]
		perm3D[i] = perm[i] % 24 * 3
		source[r] = source[i]
	})
	base3D = undefined
	lookupPairs3D = undefined
	p3D = undefined

	return function(x, y, z) {
		const pD = perm3D
		const p = perm
		const g = gradients3D
		const stretchOffset = (x + y + z) * STRETCH_3D
		const xs = x + stretchOffset, ys = y + stretchOffset, zs = z + stretchOffset
		const xsb = floor(xs), ysb = floor(ys), zsb = floor(zs)
		const squishOffset	= (xsb + ysb + zsb) * SQUISH_3D
		const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset), dz0 = z - (zsb + squishOffset)
		const xins = xs - xsb, yins = ys - ysb, zins = zs - zsb
		const inSum = xins + yins + zins
		var c = lookup3D.get(
			yins - zins + 1
				| xins - yins + 1 << 1
				| xins - zins + 1 << 2
				| inSum << 3
				| inSum + zins << 5
				| inSum + yins << 7
				| inSum + xins << 9
		)
		var i, value = 0
		while (c !== undefined) {
			const dx = dx0 + c.dx, dy = dy0 + c.dy, dz = dz0 + c.dz
			let attn = 2 - dx * dx - dy * dy - dz * dz
			if (attn > 0) {
				i = pD[(p[xsb + c.xsb & 0xFF] + (ysb + c.ysb) & 0xFF) + (zsb + c.zsb) & 0xFF]
				attn *= attn
				value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz)
			}
			c = c.next
		}
		return value * NORM_3D + 0.5
	}
}



/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Matrix": () => (/* binding */ Matrix),
/* harmony export */   "PVector": () => (/* binding */ PVector),
/* harmony export */   "Plane": () => (/* binding */ Plane),
/* harmony export */   "copyArr": () => (/* binding */ copyArr),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "rotX": () => (/* binding */ rotX),
/* harmony export */   "rotY": () => (/* binding */ rotY),
/* harmony export */   "trans": () => (/* binding */ trans),
/* harmony export */   "transpose": () => (/* binding */ transpose)
/* harmony export */ });
class PVector {
	constructor(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
	}
	set(x, y, z) {
		if (y === undefined) {
			this.x = x.x
			this.y = x.y
			this.z = x.z
		}
		else {
			this.x = x
			this.y = y
			this.z = z
		}
	}
	normalize() {
		let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
		this.x /= mag
		this.y /= mag
		this.z /= mag
	}
	add(v) {
		this.x += v.x
		this.y += v.y
		this.z += v.z
	}
	mult(m) {
		this.x *= m
		this.y *= m
		this.z *= m
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}
	magSquared() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}
}

const { cos, sin } = Math

class Matrix {
	constructor(arr) {
		this.elements = new Float32Array(arr || 16)
	}
	translate(x, y, z) {
		let a = this.elements
		a[3] += a[0] * x + a[1] * y + a[2] * z
		a[7] += a[4] * x + a[5] * y + a[6] * z
		a[11] += a[8] * x + a[9] * y + a[10] * z
		a[15] += a[12] * x + a[13] * y + a[14] * z
	}
	rotX(angle) {
		let elems = this.elements
		let c = cos(angle)
		let s = sin(angle)
		let t = elems[1]
		elems[1] = t * c + elems[2] * s
		elems[2] = t * -s + elems[2] * c
		t = elems[5]
		elems[5] = t * c + elems[6] * s
		elems[6] = t * -s + elems[6] * c
		t = elems[9]
		elems[9] = t * c + elems[10] * s
		elems[10] = t * -s + elems[10] * c
		t = elems[13]
		elems[13] = t * c + elems[14] * s
		elems[14] = t * -s + elems[14] * c
	}
	rotY(angle) {
		let c = cos(angle)
		let s = sin(angle)
		let elems = this.elements
		let t = elems[0]
		elems[0] = t * c + elems[2] * -s
		elems[2] = t * s + elems[2] * c
		t = elems[4]
		elems[4] = t * c + elems[6] * -s
		elems[6] = t * s + elems[6] * c
		t = elems[8]
		elems[8] = t * c + elems[10] * -s
		elems[10] = t * s + elems[10] * c
		t = elems[12]
		elems[12] = t * c + elems[14] * -s
		elems[14] = t * s + elems[14] * c
	}
	scale(x, y, z) {
		let a = this.elements
		a[0] *= x
		a[1] *= y
		a[2] *= z
		a[4] *= x
		a[5] *= y
		a[6] *= z
		a[8] *= x
		a[9] *= y
		a[10] *= z
		a[12] *= x
		a[13] *= y
		a[14] *= z
	}
	identity() {
		let a = this.elements
		a[0] = 1
		a[1] = 0
		a[2] = 0
		a[3] = 0
		a[4] = 0
		a[5] = 1
		a[6] = 0
		a[7] = 0
		a[8] = 0
		a[9] = 0
		a[10] = 1
		a[11] = 0
		a[12] = 0
		a[13] = 0
		a[14] = 0
		a[15] = 1
	}
	// somebody optimize this
	// you just have to expand it
	mult(b) {
		const a = this.elements.slice()
		const out = this.elements
		let e = 0
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				out[e++] = a[row * 4 + 0] * b[col + 0] + a[row * 4 + 1] * b[col + 4] + a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12]
			}
		}
	}
	// same here
	postMult(a) {
		const b = this.elements.slice()
		const out = this.elements
		let e = 0
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				out[e++] = a[row * 4 + 0] * b[col + 0] + a[row * 4 + 1] * b[col + 4] + a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12]
			}
		}
	}
	transpose() {
		let matrix = this.elements
		let temp = matrix[4]
		matrix[4] = matrix[1]
		matrix[1] = temp

		temp = matrix[8]
		matrix[8] = matrix[2]
		matrix[2] = temp

		temp = matrix[6]
		matrix[6] = matrix[9]
		matrix[9] = temp

		temp = matrix[3]
		matrix[3] = matrix[12]
		matrix[12] = temp

		temp = matrix[7]
		matrix[7] = matrix[13]
		matrix[13] = temp

		temp = matrix[11]
		matrix[11] = matrix[14]
		matrix[14] = temp
	}
	copyArray(from) {
		let to = this.elements
		for (let i = 0; i < from.length; i++) {
			to[i] = from[i]
		}
	}
	copyMatrix(from) {
		let to = this.elements
		from = from.elements
		for (let i = 0; i < from.length; i++) {
			to[i] = from[i]
		}
	}
}

class Plane {
	constructor(nx, ny, nz) {
		this.set(nx, ny, nz)
	}
	set(nx, ny, nz) {
		// Pre-computed chunk offsets to reduce branching during culling
		this.dx = nx > 0 ? 16 : 0
		this.dy = ny > 0
		this.dz = nz > 0 ? 16 : 0

		// Normal vector for the plane
		this.nx = nx
		this.ny = ny
		this.nz = nz
	}
}

function cross(v1, v2, result) {
	let x = v1.x,
		y = v1.y,
		z = v1.z,
		x2 = v2.x,
		y2 = v2.y,
		z2 = v2.z
	result.x = y * z2 - y2 * z
	result.y = z * x2 - z2 * x
	result.z = x * y2 - x2 * y
}

function trans(matrix, x, y, z) {
	let a = matrix
	a[3] += a[0] * x + a[1] * y + a[2] * z
	a[7] += a[4] * x + a[5] * y + a[6] * z
	a[11] += a[8] * x + a[9] * y + a[10] * z
	a[15] += a[12] * x + a[13] * y + a[14] * z
}

function rotX(matrix, angle) {
	// This function is basically multiplying 2 4x4 matrices together,
	// but 1 of them has a bunch of 0's and 1's in it,
	// so I removed all terms that multiplied by 0, and just left off the 1's.
	// mat2 = [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]
	let elems = matrix
	let c = cos(angle)
	let s = sin(angle)
	let t = elems[1]
	elems[1] = t * c + elems[2] * s
	elems[2] = t * -s + elems[2] * c
	t = elems[5]
	elems[5] = t * c + elems[6] * s
	elems[6] = t * -s + elems[6] * c
	t = elems[9]
	elems[9] = t * c + elems[10] * s
	elems[10] = t * -s + elems[10] * c
	t = elems[13]
	elems[13] = t * c + elems[14] * s
	elems[14] = t * -s + elems[14] * c
}

function rotY(matrix, angle) {
	//source = c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1
	let c = cos(angle)
	let s = sin(angle)
	let elems = matrix
	let t = elems[0]
	elems[0] = t * c + elems[2] * -s
	elems[2] = t * s + elems[2] * c
	t = elems[4]
	elems[4] = t * c + elems[6] * -s
	elems[6] = t * s + elems[6] * c
	t = elems[8]
	elems[8] = t * c + elems[10] * -s
	elems[10] = t * s + elems[10] * c
	t = elems[12]
	elems[12] = t * c + elems[14] * -s
	elems[14] = t * s + elems[14] * c
}

function transpose(matrix) {
	let temp = matrix[4]
	matrix[4] = matrix[1]
	matrix[1] = temp

	temp = matrix[8]
	matrix[8] = matrix[2]
	matrix[2] = temp

	temp = matrix[6]
	matrix[6] = matrix[9]
	matrix[9] = temp

	temp = matrix[3]
	matrix[3] = matrix[12]
	matrix[12] = temp

	temp = matrix[7]
	matrix[7] = matrix[13]
	matrix[13] = temp

	temp = matrix[11]
	matrix[11] = matrix[14]
	matrix[14] = temp
}

function copyArr(a, b) {
	for (let i = 0; i < a.length; i++) {
		b[i] = a[i]
	}
}



/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BitArrayBuilder": () => (/* binding */ BitArrayBuilder),
/* harmony export */   "BitArrayReader": () => (/* binding */ BitArrayReader),
/* harmony export */   "compareArr": () => (/* binding */ compareArr),
/* harmony export */   "roundBits": () => (/* binding */ roundBits),
/* harmony export */   "timeString": () => (/* binding */ timeString)
/* harmony export */ });
const { floor } = Math

function timeString(millis) {
	if (millis > 300000000000 || !millis) {
		return "never"
	}
	const SECOND = 1000
	const MINUTE = SECOND * 60
	const HOUR = MINUTE * 60
	const DAY = HOUR * 24
	const YEAR = DAY * 365

	let years = floor(millis / YEAR)
	millis -= years * YEAR

	let days = floor(millis / DAY)
	millis -= days * DAY

	let hours = floor(millis / HOUR)
	millis -= hours * HOUR

	let minutes = floor(millis / MINUTE)
	millis -= minutes * MINUTE

	let seconds = floor(millis / SECOND)

	if (years) {
		return `${years} year${years > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} ago`
	}
	if (days) {
		return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
	}
	if (hours) {
		return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
	}
	if (minutes) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""} ago`
	}
	return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
}

function roundBits(number) {
	return (number * 1000000 + 0.5 | 0) / 1000000
}

function compareArr(arr, out) {
	let minX = 1000
	let maxX = -1000
	let minY = 1000
	let maxY = -1000
	let minZ = 1000
	let maxZ = -1000
	let num = 0
	for (let i = 0; i < arr.length; i += 3) {
		num = arr[i]
		minX = minX > num ? num : minX
		maxX = maxX < num ? num : maxX
		num = arr[i + 1]
		minY = minY > num ? num : minY
		maxY = maxY < num ? num : maxY
		num = arr[i + 2]
		minZ = minZ > num ? num : minZ
		maxZ = maxZ < num ? num : maxZ
	}
	out[0] = minX
	out[1] = minY
	out[2] = minZ
	out[3] = maxX
	out[4] = maxY
	out[5] = maxZ
	return out
}

class BitArrayBuilder {
	constructor() {
		this.bitLength = 0
		this.data = [] // Byte array
	}
	add(num, bits) {
		if (+num !== +num || +bits !== +bits || +bits < 0) throw "Broken"
		num &= -1 >>> 32 - bits
		let index = this.bitLength >>> 3
		let openBits = 8 - (this.bitLength & 7)
		this.bitLength += bits
		while (bits > 0) {
			this.data[index] |= openBits >= bits ? num << openBits - bits : num >>> bits - openBits
			bits -= openBits
			index++
			openBits = 8
		}
		return this // allow chaining like arr.add(x, 16).add(y, 8).add(z, 16)
	}
	/**
	 * Takes all the bits from another BAB and adds them to this one.
	 * @param {BitArrayBuilder} bab The BAB to append
	 */
	append(bab) {
		// If our bits are already aligned, just add them directly
		if ((this.bitLength & 7) === 0) {
			this.data.push(...bab.data)
			this.bitLength += bab.bitLength
			return
		}

		// Add them 1 at a time, except for the last one
		let bits = bab.bitLength
		let i = 0
		while (bits > 7) {
			this.add(bab.data[i++], 8)
			bits -= 8
		}
		if (bits) {
			this.add(bab.data[i] >>> 8 - bits, bits)
		}
	}
	get array() {
		return new Uint8Array(this.data)
	}
	/**
	 * @param {Number} num
	 * @returns The number of bits required to hold num
	 */
	static bits(num) {
		return Math.ceil(Math.log2(num))
	}
}
class BitArrayReader {
	/**
	 * @param {Uint8Array} array An array of values from 0 to 255
	 */
	constructor(array) {
		this.data = array // Byte array; values are assumed to be under 256
		this.bit = 0
	}
	read(bits, negative = false) {
		let openBits = 32 - bits
		let { data, bit } = this
		this.bit += bits // Move pointer
		if (bit > data.length * 8) {
			throw "You done messed up A-A-Ron"
		}

		let unread = 8 - (bit & 7)
		let index = bit >>> 3
		let ret = 0
		while (bits > 0) {
			let n = data[index] & -1 >>> 32 - unread
			ret |= bits >= unread ? n << bits - unread : n >> unread - bits
			bits -= unread
			unread = 8
			index++
		}
		if (negative) {
			// console.log("Negative", ret, ret << openBits >> openBits)
			return ret << openBits >> openBits
		}
		return ret
	}
}



/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BLOCK_COUNT": () => (/* binding */ BLOCK_COUNT),
/* harmony export */   "Block": () => (/* binding */ Block),
/* harmony export */   "blockData": () => (/* binding */ blockData),
/* harmony export */   "blockIds": () => (/* binding */ blockIds),
/* harmony export */   "texturesFunc": () => (/* binding */ texturesFunc)
/* harmony export */ });
const texturesFunc = function (setPixel, getPixels) {
	return {
		grassTop: n => {
			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const d = Math.random() * 0.25 + 0.65

					const r = 0x54 * d
					const g = 0xa0 * d
					const b = 0x48 * d

					setPixel(n, x, y, r, g, b)
				}
			}
		},
		grassSide: function(n) {
			const pix = getPixels(this.dirt)

			// Fill in the dirt texture first
			for (let i = 0; i < pix.length; i += 4) {
				setPixel(n, i >> 2 & 15, i >> 6, pix[i], pix[i + 1], pix[i + 2], pix[i + 3])
			}

			const { random } = Math

			for (let x = 0; x < 16; ++x) {
				const m = random() * 4 + 1
				for (let y = 0; y < m; ++y) {
					const d = random() * 0.25 + 0.65
					const r = 0x54 * d
					const g = 0xa0 * d
					const b = 0x48 * d
					setPixel(n, x, y, r, g, b)
				}
			}
		},
		leaves: n => {
			const { floor, random } = Math

			for (let x = 0; x < 16; ++x) {
				for (let y = 0; y < 16; ++y) {
					const r = 0
					const g = floor(random() * 30 + 100)
					const b = floor(random() * 30)
					const a = random() < 0.35 ? 0x0 : 0xff

					setPixel(n, x, y, r, g, b, a)
				}
			}
		},
		hitbox: "0g0g100W",  // Black
		nothing: "0g0g1000", // Transparent black
		"acaciaLog": "0g0g6ÖïYÇQYåĭYÁAWÇUZ÷nH50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"acaciaLogTop": "0g0gbÖïYVQYÁ)HPjZġîHĕàWĨěZöNYāRYĉÃW?3Y1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>čXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>ČQV?ÄVQTgNxg0iz(",
		"acaciaPlanks": "0g0g7ġîHĕàWĨěZāRYĉÃWöNYòiY4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂTAX40cùĪzSāAAā4ŁğãļłĞSA4PkiA9cë0PNgÐ0İAĽŔÉGËĞ",
		"andesite": "0g0g6éŞZâľHĆåZóEZÖĎYĒđY4ĎĨò61aĘĹĕĩ2BĜõwAħ]ĩŁV+peČ0ÚĘ^Úðj6Rĺc!ìóĎłTěd|ðŁÙüÃÖëēÒ+ë4ĻłÙ({*CħïĚ!S+rÖ)ĀÙgŀđĞłVĚSÚĩiÎëő$m3c)Ā",
		"bedrock": "0g0g5ÎðW(ĪWVVHþÇHwíW4JĀ|iów(Ī%IÁ(ĀPÒAķ{5j]J^ïJ^A+1FyúMyÎÙwĿTĘĳPkú(üRdĊÂdðłQĩóxiÆ1ùŀïĞ9òyÀÚ0ŃQùòcJ^c*hCkr1iòTĜ^(ĀĿERÀ",
		"birchLog": "0g0g8ŚĦYņ|HłÙZZZZĦšZÎâH)ĹYŖĵY0Č0Q4ëQ0rÎiÀÚJî04rÚ_ĝTĞĺSFÛđĘĔĝwòTBãĘ4]ÚìĻ?+łÖvĩÎwņŔğłÙjZÚëù]+Ŀ1iĿTĞĪÚŝĩB0ùfŜ&ķ6ĿQēĞŁČăÏļ%9Àł5wù",
		"birchLogTop": "0g0gaZZZŒĖHĂÆWÁ)Hľ8HıľYľEZĎÄHĖGHĢďH1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>BXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>AQV?ÄVQTgNxg0iz(",
		"birchPlanks": "0g0g7ľ8HıľYľEZĖGHĢďHĎÄHĆCW4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"blackConcrete": "0g0g48wZ8MW4wZ8xWmeşŞÑØĪĳ9ŠóşĶøŞ;îŃÓyÀĈĶÃĞX^æĆşŒĔ<~Ŕ<ĢL4ĲţŘŇěøÌĩĶõ;ŞkŇěĚċŇŖĝĜř,ŉĩ",
		"blackWool": "0g0gfcMWcTH8MWgÁYoÎZcMHkÎZ8wZkÁY8xWAJYgTH4wZsßWwíH1w)5ÑßIFIĒQģ9Éĩr|ģŔô|Qő]ì|ę<bńìĕô8QGÆÂQDDd717rýbĒQOĠ^ØĒ]hĒ@ń5|ÕńQBĽ1ÉÇ:yÉĜGĠ8ĒĜĒńQĕ@ĻĠîEwIhQ0ÆGĠhGŅD)XĒò@őĻôç|ģŁŔôĿXČVXgùĿ1ŅęÚ0|",
		"blueConcrete": "0g0g3$ġW$ĠZ$İWlÀ?ÑT?QA]0@VUUh?Čkkw55kUÒoTlV0UhhgÑ0VUR0gÁ?QghX54UVS4Á0UýÁlÀUükÄ",
		"blueWool": "0g0gj$İH(ŀH$İW)ŀY-šW(İH)őW$ġW)ŐZ)ŀZ<:W-šH(ŀY$ĠZ.aH<aY-őW<qY.aY0Q1ùčMeAwR^kčúõ0óĭI$ÉĀ,ġczĉ8ĐI]]ō4Û#sŋï}>aJgŎ!ayg[hıŉĄ1FĩĨkcÂþTöIÈõĬEI8UĊpĵ1]ŊxĵA4Åoĉ#axĘR#oěąI!kĉĨ^àI?-ðßĿXcPhÀëXù1^îąI8}G;[ph5F2ìĊďhc-ŇōdıèJĮx4ÂıUSwhÊë5ĸK{ŇlÛ",
		"bookshelf": "0g0gtĚ*WĆkZāĻWéîZ$ìW)ĉHAÞWMÕZF,YSĨYùTWĒKYòŗYMóWáħHĤÁHãMWĞłHóEYi+YĵþZKĈHËħZdčWĦÓWVĈYPAY;ŚZÖÃW0RxcRgRgIw18RüXx^ÐĈë1ÂýFF^ĿþĈĈiĄŎđFXÑĎĊÏċŃŎđČíĿĎĊá3ńÅġĘĚŇōĆK2Ēý.m#wŋuňgMóÂĀ0Mõ020XgõygRh8K1^ÐmŀFcÂĀë3ĻÄĊmÂÃÙČĈkÒãĊmÃİb}ŊċļãċÉàļb@U3ńãćÉ!ćb}ŇaąīuĽŊýÙń06M^Ã06Mõ00",
		"bricks": "0g0g9ęXZāUWòĞHĬčWĊnZö>ZéjHÝŚWĒÆZ0iO(0k(0hUÒhhUÎhÔäGVÔáâÓy]RyA]RyO0gk(0giÎhlÑÒVVÑÒmÓäGÒÄáRyA]Qyy]0kO(gkO0hUÁhhÑÁhÓáÓVÓäÒVA]Ryy]Ryg0gi(0gkÎhhUÁhhÑãÓÓäãÓÓäRyy]QyAI",
		"brownConcrete": "0g0g3ÊňZKřWKňZqÖlÄÄÄĂþÏĉVÄÈTÈÏĂĎĒÄÒÒýÑāāÈÒVÒlÄVJāúÒþïĂýÓóÇāIĀĒāýÖþVāÖĎþIÄđĂÁVč",
		"brownWool": "0g0giÒ2WÖ2HÑřWÞiHåNZÖ2WâyYKřWÞyYÞiYìÃWéNZÚiHKňZéRZì>WåyYÚ2H0QxùĉMeAw[PüčúõhĩĭI$ÉĀĮġczĉ7Đð]]ō4Û#sŋï}OaJgŎa2yg[hıŉĄ1FĩĪXÁÂþTöIÈõĬEI8UĊpĵg]ŊpĵA4noĉb2ÞĘRbyěąðFüĎT^àI?-ðßĿîcPh{KXùhRÐĆC8}G;[ph5EĮìĆďhc:wōMıçĹĮwīÂĩkSy.Êì5ĶK{ňlÛ",
		"chiseledQuartzBlock": "0g0g6ņÙYŖĖHŖąZŒöYŊéWŚĦZ4Ja]+]5BrÙi]9,A0iÀdĞķ4üüd9wJ0Ń9_PFĘĿi2Ñ1Ę0ĜJÎxA|AČĨÀJPi@ëùā4kíPB.{4ìwJ0]Xû]mJ]òDw0iÀd*%AAù4û9CCĿ",
		"chiseledQuartzBlockTop": "0g0g5ņÙYŖĖHŚĦZŊéWŖąZ4ĊĻMJĈhĘ4ë6ŇgB1ìEŇgD2ì-zg+Tí0biiR÷RK002öĘ0(ĊÂJiJJPAJPA00põ039kÈöpz8,2ö+wÑ@RëĚwÝRìík8hĞ1ìĘgiRĻúJĈ",
		"chiseledStoneBricks": "0g0g7ĆÖZóEYÖĞYéŞZÇÒYÎðWåľY00]0ëRdĜłÖ+Ń&ŀAĞļü!090óáe2ŅÚĒÊe7JŀőÊ!nČïĒ)&cČìŏk!nČñE)aÿIBĐ)eðĲLEáeõĚİ!ÊdÉÑJÈáA2S0Jś:;ěç$üÂPAJPA",
		"coalBlock": "0g0g5sÞZkÁHc(Z4gHEĊY0ü_ÑĎĸAĊăÒ)SFĞòÚĚP|ċ1AĚÃÚg9FĚă$J^ÚĞòÕiûÖiPÑüĸy2ÃÒCI4üłÚkTF(ÉEĊ^ÚJú5NúFĜ]ÚüX5g9ÚĊxÙíÃÚgÃÕJăQJòQüł",
		"coalOre": "0g0g7÷-ZéŞZâľHÖĎY;ŚZ)ĺH?kH4íú|y0Bm04ĞıFĠôÖp90g{ČiiQČŁ5gòwÿĉ#QķQŐB6ÂP|J0ÚČ0igÃķĊRAmUĞù1ÒoăS+ÂAJ0d^1F+2ĂP^0ıPmüPFg1wkúAJÀAJS",
		"cobblestone": "0g0g6ÚĞZÎðWĎĂHÁ?WĞłHóoY5C^óăl!ÈŋÄě?!ĈVĐmÕCíÕĈļ_KĿöCAđì_TãĬ?UļÕA!cĜbTęh|6wdþĹÆMÁSĜîÁĊó_wmüĈi$QģBmwÏĐr?MÈVmíÕ^ó8ĜlP)úT4ĿĐ",
		"cyanConcrete": "0g0g3lĿYlŏYlĿH1IÀpE?SmkÀw6PÁB?S4k299úkÄRPÒÎwĊ?A2ÑIĀ8püUiSÒgý95Eòak?ý?1RÀFÀKSÒù",
		"cyanWool": "0g0gelşYm8ZmFWmPHlşZm.WlŏYmÖZmÇHmoZlĿYmÇYmÖYm.H10zTÃKy6BGîā6pĎpôāĲF:ńĮ*x:ú#PģxçÇROÓimO6Ó_@1@pÎ1GîyJñÇGNhG*ģ1:Vģ<ÎĝTpmF6poÓý?GąGģOç*ĠJÂ24Vh<4lÓlhÓĤÓz%GÄļĮěFÖłāğĳFĚÃäh%gÑĚ1ĤúÉ4ô",
		"darkOakLog": "0g0g6;ĨZ(úW]ňZEìW(úHÇiY50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"darkOakLogTop": "0g0gb;ĨZ)ĉYAÞWsKZ{ĨY]ęHÀňY(ÝZ-úW;ĉW(úH1xizNj1g4Q??ÒUQTAGIĀāāIÏkãÑQ?Q]>čXVVVVPÂ)üÆòĀï]Á*ïÅVVïÆTBüÆÇýýPÀ5üÆÇïï]À5üÆVVýÆÁlXÆñòýPÂBüVVVV]Â)ü?QQ@]Ã)ĀĀIIII>ČQV?ÄVQTgNxg0iz(",
		"darkOakPlanks": "0g0g7{ĨY]ęHÀňY-úW;ĉW(ÝZEKZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"diamondBlock": "0g0g9_ĦHW÷HncHľZHZZZćťYÔŅWàŖWeŒZ00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"diamondOre": "0g0g8÷-ZéŞZâľHÖĎYÔŅWćťYW÷HľZH4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#ĻķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħİó0ŃPrkPFg1wkúAJÀAJS",
		"diorite": "0g0g6óEYĎóWĦţWŒĖYĶ;ZåŎY4üİPĀă)yR×,gÎ+E?ĠóÒĜbÕX_{oî|iŀö+Ň]ČıÖoŀhĠFM2óöĞTQĻÉúpbĉĚjKĐŇNxRò+lÚóAA(Ã&njÝü^wĐìÞīĸX6įöĊcÒ+ŇNgÉ",
		"dirt": "0g0g7ĢlZýĜYåÃYÆřYðoHÚĞZâÑH4Č9PČg?ČÐSĈÉ9(J9Cĩ)yķBkaEðÂ%UÈ{üÉÖ)ù9Eù84Á]2Â$üòFkÃQČĂ?ČŁPwh?0ìKNÏFihČĎÃ{ĊRPAë?$ò{)9FXĺ1kòEiĊByÃ",
		"emeraldBlock": "0g0g6nkHqěHîŁZ>įHnãWuÏY0000019AĂÖ]ń800w0Ëc)ûJ@Ë8w00mV8wJÚoÒcwăúĀ?c(ĂúĀ?8(ŋ4gÒc(ŋCgÒcħĄim?gĩPAþ?cB01ĠÒgJPAJËg]4ù8ļ+łÚĞłÖ",
		"emeraldOre": "0g0g7÷-ZéŞZâľHÖĎYłťYnãW1ňY4íă|y0BiB4ĜóFĜĖPmİ06ħ0pÂQđÃwbòwăčÒ(gQë&4ĊPPĜħÖČ00gÒBĚRAJÛaÀŀÒkă^Ō!AJ4Ĉ1Þ%Ċ5İ+2ßČ]4üP,g1wkúwiÀAJS",
		"glass": "0g0g5ĺĖYē|Y000æģHôcZ0000019AJPAú9wJPAû94JPAû8ČJPAû9AJPAü9AJPAû9AJPAü9AJPAü9AJPAü9AJPAü9AJPAüFAJPAk9AJPwüFAJPAúCpAJP9",
		"glowstone": "0g0g8ŢÔHĵlHïRYÚiWZZZZĴYòċYÞNH5+T%^ÄĈYĸäŁb?ŋćŢĘÌĶgÃŗãŝèĲ_mćĐÕÈ2wĕKŔùb~ŋ>rĜÍä$āĉÓĦÂñīČĒe+ÿĘFùÂÑDŚÜDïĳĦğşnœ5őjĩÈŗ#ò_ĭíćÜyćŃlŏÍĞť",
		"goldBlock": "0g0g9ŞNHšřWĹÃWZŠWZŢZZĜZZÐZZXYĵNH00h01hg23QVO*ÄÐN4ÓàVKh7N4Ô*ÅK0GÂlâVã0ÔãÂlVÅK6VKo3VGãÒÄ1o3ÅGÓGK18lGãÔãK0ÏlGÓGÓÓ7ÏmãÒÄÓÓÅ8gÓVK65Ä8gÒÄ1gGKÏhGKh6Ó0ßgg1gÓ0ÔÆyíEIyIyI",
		"goldOre": "0g0g8÷-ZéŞZâľHÖĎYZĜYZŢHšĚYZZZ4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#ĻķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħİó0ŃPrkPFg1wkúAJÀAJS",
		"granite": "0g0gaĞÖWąčYúïWéUH{ĹZĞDHđĽHË3HıÆWŊaZ1xMihTÁmiãoMjMjNnhiCMûnlnihÅmÏNhNjzGwÎyjh+ÏjÞygMMmÐhjÓÏOjh1A,ÓMylxjÓÐNhMÓCM+ÐljmÓ2ÞMEh,+ÓnÎj>h+RRNMhMzhFiÓMDNÓxhoÓzãiÓgMÓh2yMMh+",
		"gravel": "0g0g8ÒÒYó7Zþ-ZÞĎYþÇHìŞZĚóWĚĢZ5,$âł#þģ_ĔÂ{ĝíİþĀĳĜĺÊĞ/ÚÓŋńĝôdlĈİÿİØ$#èßgŔùĿÒčģÎðÅÖ$ÇńčY#üŁĴáįÆĚěKĞj<Ùł#ĔłÙ..$BôFĒŁŌ(ĹÉĐþcGDÚ)ľË",
		"grayConcrete": "0g0g2)ŊZ-ŊZ00000000090000000000000000S100gg",
		"grayWool": "0g0gd-śW<4HTAZTkYTAY)ŊZ<kY-ŊZ?*W?AZ?)Z.4W-ŚZ00i0)ÀÓ7jIüh71Å1ĂhóÎ^QI>g!rq1ĒgòM1yV6cy5âa5051À1IyhmĀMI@0I>đ0!OđQÝûb15hc1pVj3IkIĂQó>đmM10ObA03VjĘVĀĬiÑI*>IüÎÁ^hĐIhĎNò0ÑĘÝþbĐg.0Ă",
		"greenConcrete": "0g0g2PÏHPßHh;ĒÉÙŐßÆðM!ľĈÇylĖ|aŗÈëÀļĸŚđøcKæÙ",
		"greenWool": "0g0gh|íWÁúZÁĉYÇĸH|úZVĨYÇĨYPßWVęYÓhYÁĉZPÏHËňHËŘHÇňHPßH|ßW0S1c4F÷4w7TÂúā^1įčĄ!rkĎMaOcÓČĬS@Ĭ4{2Āī5&!ëìõŖy91õ7.ħħ;13ĩċù1^@M9]q^ČČį8Âûl÷16ĩý÷M÷[k1yIÞEgyí,ą]1ÂýpFàcÑĘĬKĻíI80gëXÓ08ÃĄB8ÌGNfgķÑČďMÈÿpaæõĬFòÐgĎwċ]įQow-së5öÀ^Ň0Ù",
		"ironBlock": "0g0gbĺ;ZĪcWŚĶWŖĦZŒĖYŎĆHĢŒYĚĲWņéZŊ÷WľËH1g0001hgiyyO)VVÁlVVVVVVÄäIIIāĂĒďiyyzOVVÄlVVVVVVÄäIIāāĒĒďizOOVVVÄlVVVVVVÄäIIIòāĒďiyyzO*VÄlVVVVVVÄäIIòāĂĒďiyzO*VVÄlVVVVVVÄhhhmÎÓÓÓ",
		"ironOre": "0g0g8÷-ZéŞZâľHÖĎYĦÕWŁġWĖ,HŊaY4íú|y0Bm04ĞıFĠôÖr90g|īiiQČŁ5gòwÿŐ#īķQŢC6ÏP|J0ÚČ0mgÃśĊRAmVłg1ÒoăS+ÂAJ0dÊ1F+2Ħłó0ĳPrkPFg1wkúAJÀAJS",
		"jungleLog": "0g0g9ÇhYÖNWéßHÀŘHSĸW;ĨWVMYâJHÎÏW1y3OOhg004S404VQQ@ä?US4xh0hy33O(Sh04Q6ñK03OÕÑ??Vh10OO02x??V1g>O(0iwQÁy00QOñðQO)Väë0hhgÕñ4?U>(>UhQ0xh6KQQjÕÓ3)Q010Q?ÀhTg01g>O00OO",
		"jungleLogTop": "0g0g9éßHÎÏWSĸW;ĨWĢmHđŌHĦ+YýČHąīY1xiOyi1g4Q??ÒUQTAGGñIIGÏkãÑQ?Q[>BáVVVV]Â)XÅäñâ[Á*âÅVVâÅTBXÅÆïï]À5XÅÆââ[À5XÅVVïÅÁláÅGäï]Â*XVVVV[Ã)X?QQ@[ÃAññGGGGRAQV?ÄVQTgzxg0izw",
		"junglePlanks": "0g0g7ĢmHđŌHĦ+YýČHąīYåÃHÖiZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"lapisBlock": "0g0gdB×YxPZ*āWMIYtFHxEYsŐWt8HoĿHoĿYt7ZFÆZkĮW100gzkkkljÁÄâÓâÆ5MnVâåÒæ7ÁVÒÁãÔæ5ÞÅGÒrãÈbVVGÔĝÄä5ĝââåÔÅ×7ÅÔGğþÔĂDÔããÅãýÈDÓÞÄãÓþÆ7ÖÒlÔÅÖÆnâāÔÓlãä5ãÇþÖâÅÙlÅÓÓþÔGÆ@ÅGÓãÓâÊoIIñõāĳĳ",
		"lapisOre": "0g0ga÷-ZéŞZâľHÖĎYpÉZxÕYloZgłZhqZgŀZ1gixzyg0hO(01jOii?@jyxãh1g8+ë10yxizN1N2hgj)ìjïzwx,Xð1ðhhEÐw2iNw06Þ1E)ÓjNg1MEIð-ÁMOíOäÏEÂhÖJ0Oh6Áiw9OäÐ+K0iāÎåKw1ixÓKg1yxhhg1hhh0",
		"lightBlueConcrete": "0g0g3C$Yy$HysHiVUS1kklk?ÀgVKk4ÂlVTVlÁhS5UhhlxTTÁkVÁ9ÁhVgFSÀ1ì5Ò5VÎkh??TlV4VlSl",
		"lightBlueWool": "0g0gq&ÙZNąW!ÊZ/ĴY@ťW&éW&öW=ŔZRŤZC;Y!ÙZC{Y~uH[eW+ĕHy$H!{Y+ĥH_eH/ńYRŔZRťWNąHC$YNöW=ńZ0Q1ùĎ/iĉö_pĿĭĉĵ2ĳŎħMÙąm^ÛQđ@M7oØDÆß#čxïJ;^NV,ħĳyhPí_yŃ1%ĩŌĀmÐ9Á÷zØeōMj8ÆīuÂ1ēzĆÂ?xòsĞĪõęĠRĪĔĻčŀFĿįĸõüùðP7ûÊOö>ÁàùĿü1ÝáĎĮĘÂā(Åp7@(ŒĉĿİwÛ{ÖEĭ{ÑðŐcŜÐ|òĹħÇÒ(È{I~wlĚ",
		"lightGrayConcrete": "0g0g2éŞHéŞWàĝGşąŁÊļņZÍŕYŜGHņ<Ŏŉ:|ĞćŠĞľŢŤÔŤŝ",
		"lightGrayWool": "0g0giðnYðnZí7Y÷-HþÇWJ]YþÆZéŞHí7HĆåHĂÖWóEWéŞWó-H÷-YJÆZóDZĂÖH0QxùxF÷xõ]pÂýpØi2Ğw#ÂþĻđĲNĆśČĬo{čħ×aĻĉï!!ĩNoŎ8ĩyg[TĩĈĄ19ĩĜ4_^]ÎöÐÂ^ĜČĵ8Âûl^g{Ċþ!Oķlk(aĩìĔRaĽċąÒ9ÂþĥFU{ÑĐĬóþNõ>g^ÀħøgRÃąÒë}âA[p6śČĐåÂýoØ:ÌčĝP{@ĝcĎ^ín=2SUňTPÆ^ĉ5^",
		"limeConcrete": "0g0g3ÌĉYÏĉYÌúY402ë00ë88ùEwg1204000ëëëAwëw2A0ó2Ĉì4A14gh00020wEë01g00oĈìS081Ĉ820",
		"limeWool": "0g0ggÓęY×ĨYÏęYÛĸYç1YÓĨYãŘYÏĉYßňYÛňYßŘYñNH×ĸYÌĉYH1YHhZ1w)VÓßIyĂģ@ĳ2ÊĹj}ĪťõÛÓŢ×úÛĨ=ÊŕúĜċÇ@éÆÂQDDÌË1ËsB1ģ@O-_ÙģÕhģÓŋ5Û×śÓB@ÁÊÂ;yÊkľįÈģ+ģ~ÓĦÓśįċFBIh@5Èéqhľ~%)ðģĊÓŢ@õĺÛOŒZĄŏĎĜVðgB]1ŖMÑ5}",
		"magentaConcrete": "0g0g4ĐİZĐıWĐġZČġZ5ÒSüVÁPTÀUÆVÇ@Ŀì2Î^áÇĮSKÊ@ņ3Äĸ45Ä@9ÎVoRtÞä4VVx}ĕãÁxQâ11Àhïxl50Îĸ",
		"magentaWool": "0g0gsĘőHĜšYĔŁHĘŁHġbWĬ:YĘőYĨ#HĨ#YĐıWĥrWĔŁWĥbWĨrHļöWĬ:ZĠšZĜšZĐİZġaZİ{WĸÙYĥrHĬ#Yİ_ZĜőYĔıWĴÊH0QNkĭ/iBE_ÐÊŎĊhqĴp$Oéz/Ĺĸ?góġdKÜ]Xü)F@5ĿÙĳĩńFıõyüPÈ|>A1N>toÞàćßi×çø7.m8ÊŋuĀpė>ĞĀRnĄsĨĳ|ĊSRĳyśĎdOÊŐĉĵĬgñÁ7ċŉĎù{hĂķXĐpĚĻĎ%8ÂĄUPxUñ.ĢTőœxÁ{ĸPĵ÷ĖŀaFğàĴăwzÇęÎðýĀ~ìāś",
		"mossyCobblestone": "0g0gbÎŋWÁàYĎĂHÇĜWæ*HßlWÎðWóoYĞłHÚĞZÁ?W1yMj?6äBiñÞ)ÀÞÔÿÏßúÀ3úhåÓåMàågÀhđÎnÐÓâV3ì?ßþďwÝ,DgDåMnåiGhnúV1ÿÔúkÀgÝÀ+đjÃ0āG(j1å0MhpûgÂÞjj4ÁÎßDj?ú?5þGÿ47ÞÀÿåhåâååpGþn1nÓûhmÔíÝ",
		"mossyStoneBricks": "0g0gcóEYĆÖZÎŋWßlWæ*HÁàYéŞZÇĜWÇÒYåľYÖĞYÎðW1z)>xQ3?m7>R6ÓÏDgÔNNÓ(ãEmþÝ.KÖÖäpFþCÏ+ĂÕ9ßÖāzDãýĂGđďyGāÔģïģIïVÉģQMh81hjQw06ÕgK036KÓĀmùùCK6ÏĐpÖÓÝÓÓJĀ3@6āāđyĀ4ÖþÖĒGFÕÿåđĂĝVÉIïVģV",
		"netherBricks": "0g0g7oMW;ßHQJYwTH(ÎZEÁY-ÎZ000000BmÂQþòþÎČJKÑĂÅBĚÅA0+ħ0+ħÒAãÑĄ}7PAbPAæP%æ_čÙ03Ù03ŀčĂŀĕĆùÖ2ùÖ6ęŐuýİudĘłdĘłĲÔJ_ÓþJTČăTAJĸAJTA",
		"netherQuartzOre": "0g0gcÀÁHUíWÀÎYÑĊYÝĪWSÁHĕĭYľ#YĞĀZï4WŒąZÚÑW12NQOÃ)MjMBzQ5Ow>>l@äwN)ü)^GÑT3zPQďÑûQAM4@ôPÔØO>3QĜĢäĘ)ÑT5CðĜ>!òN)óKOQæÑzPďR))ĐĚk,ôÂ@QĜÂN@Ě5×SRi3>A-ä4-(k)P@ímòSzQûxÒ))Oy)R)lzQO",
		"netherrack": "0g0g7ÀÁHUíWÀÎYÑĊYÝĪWSÁHï4W4CČÛğp%ýÃIÄķ÷ORÒ6ĄĸĭõßgĺĂ)ōĵ?phú+úĎŊe#sö7)XUŊ2)ŝÖĭùÛ@s}ÕőÞį2MįőĂ?×Ö@ïÁóóe*o][oMİĈ]ġĈ}{ĸVĮrPįĄ*.r",
		"netherWartBlock": "0g0g5ä0WÕgWÆ0WüÎYĔíW02I0w10ÿ24Č1A2084oQ0ó{wwÀ0ùwJ1{8Ĺ04RE0h0Sù52ìwNë9A104ë809KkgQ4^Xy1SyIAùU1Ċ21gë4yg50g0wg17g1SÃ10ķ",
		"oakLog": "0g0g6âÐH{řHúīW-ĉYËyYāŋY50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"oakLogTop": "0g0g9ËyY{řHâÐHĢVZĖ*HĩãWéîHýĻWĆkZ1210x0g0jO))U>OM3ÓGñIIGÀ3ÒÃO)O,(4àQQQQ-Sjî[äñá,T4á@QQá[(4î[]XX-S4î[]áá,Skî[QQX[T4à[ãäX-S4îQQQQ,Sjî)OO*,T3ññGGGG(3OQ)?QO(1010x0i0",
		"oakPlanks": "0g0g7ĢVZĖ*HĩãWýĻWĆkZéîHÒRZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"orangeConcrete": "0g0g2ňëWńëWRgguhKoCįù124Sw0x8QùĜ2Áę1ÄSSSo40",
		"orangeWool": "0g0gmŐĈHŔĘYŌùHŌĈHŘĨWŠŘYŐĈYŜňHŜňYňëWŘĸWŌùWšRYš1ZŔħZŔĘZšiWšNHŘĸHŠŘZŜĸHšyH0QNkĭ/iBE_xĿĭĉĶqĳśI&Ùu]ĩ~QgðM7w_7ĤùOĉ25ö:õRýFNõyüPi|3A1NRŜĀÜÐCÂhıØeōMi8Æīudpô3ĆdR4ÓĄĶOĳĚ-ROĆĻčĻMĿĩxõÙgðT7îÌċùQhđSĤĐpõáčŎäÂþīPxUð(ŒTĿĭĉ~Ph7icö]ŏEŌÐ{ÖxŊÇăxĦcÝ}ĸāĘ",
		"pinkConcrete": "0g0g3ļĀZļāWĸĀZ5QSÀ14gkgk01gQ1À0gQ4000ghÀS0?0]9kgk41Q42T4g01hÁ105k4S4hS00gggQÁS",
		"pinkWool": "0g0gvŌŀYŔšWňİHř!YŝçYŌŐZŐŐZŝÉWŝØHŀđWňİYŝ/ZńġHř/YŝĳYŝôZřqHŕaHļāWŝĄWŝĤHŝ^ZŝĳHŝçHŕaWŝăZŀāWŐŠZŝôYŝĔWŝ_W0Q1ùĎ/ičĕ{ÖŃŎĊh3dp((èŉ/}ęQķô.7ÕÜ-Ňà$D+ïŀ;aĹË/ŁĳĩhPÏ_Nŏ1&îmooàġÞ÷bçø7.l8Êŋuå1ėOćġRpĤĄĠŃ{Ĩħ{Ń(ŤCuFŃňĉĵĶÀñ|7Œŉěö|ÁéŇŇI1ãáď7ħáĄĸĂpmñ-œTœœĉÞķĸ-eÛčr9ĔŞàĴĢċ0ÎàÀÏãë~ùlŚ",
		"polishedAndesite": "0g0g9ĎāZĞıZó.ZðEHéşWÞľWÖğWÇâYóPW11hhh1gijQ>OÃ)Ñ,jOO)SIO[3Õ8Q)Oî,jO*NîQQ,k>)Q*OQ@jOX-Iy)Åk>QQÄUO+jEÃO-ë8ñj>)>)>N,j-ëXQIO,mOOOIOIÅjIí)QÑ(ñjOQQOíQ,kQ]îO)>,ðGGGGÓGG",
		"polishedDiorite": "0g0g8Ŏ÷HłÚYĢœWĲ$YĒĢYåşWÎþWó-Y0i00J25+_5@VAkòKEĆ$ġz%)ýxįĀ!)Ĭ5ČįiC}cùTÛyĆ92Ī$ďmMĚÉQ-ą$þû%ČdB]ôÕĚ}cIł1üądíĻdjm9þĀ!(þtCİÖþąŞÉãĽŔÛ",
		"polishedGranite": "0g0g9ıÆWĞÖWĞDHđĽHąčYúïWéUHË3H{ĹZ00gwy2zz4VQU)QV?kk>)QÑR[4QÑVUOV@4QQ>VQQÄCUVQQÁU@5>)ÂQQQÅ4QQ@U>)@B@ÒQOQVBAQ?U?UQ@lQQQQAV@4TVQÑQ@Å4OQQ>)V[BU?ÏQU>+AQUQVQT[ÔGIGäGGI",
		"purpleConcrete": "0g0g4ÑòZÑåZKåYÑåYlm100ĸþTNVQgp5820Áĕ0S2RV1Àlhgìg4pĽjŏk0ÆT)S?lüUìlĻRS1ý0TTp0T]Q4T1",
		"purpleWool": "0g0gmÙóWÝĂHÕóWáĂYëģWÙĂWèĒZÑòZäĒYÕòZýcZXģWáĂHÑåZXĲHIĲYäĒZèĢZõłZXģHÙĂHIĲH0Q1ù5MeAwPTüčúì2^mČzÉí,Ģ1zċpEðS]ŇXÛ3sŋ5Ã(ħígŎĊaJg[PħŇs11ĩjü1ÂþTõÕÈõĬEù8UĊpĺ1]ŊpĺAÃPĀ1Ĉ^ÞĘPċ2ěąð1üĉĬ^ăI?-ðßĩîc]gcKXú0EÐĄC8}åĥDphlEĮòČđú1-ŉňöıéÀĮwīÂĲ]Qw]D05Ĺo|(1Û",
		"quartzBlockBottom": "0g0g3ŖĖHŖąZŒöY05Èë?ÈĐ1ÄĒù5Ēč0ÄčÈþĒÄĒÈđV0ĒV01VU1×À0þù05006Ē05ĒĈ0ÇÒ0Vč05ĎÀ1ÄS01Ē",
		"quartzBlockSide": "0g0g6ŚĦZŖĖHŖąZŒöYŊéWņÙY0000005AăÚJ{9+łÕJV%ĞĹAČý%AăÖ+Ń9+łPĞŃ9yPÚĜý4J^PAý4Čł]J|9+òAJV4JPB+Ń4JÂÚĞĴ4üĂ|y|9CĹAJV%)òAČüJłAJ_Ú",
		"quartzBlockTop": "0g0g6ŚĦZŖĖHŖąZŒöYŊéWņÙY0000005AăÚJ{9+łÕJV%ĞĹAČý%AăÖ+Ń9+łPĞŃ9yPÚĜý4J^PAý4Čł]J|9+òAJV4JPB+Ń4JÂÚĞĴ4üĂ|y|9CĹAJV%)òAČüJłAJ_Ú",
		"quartzPillar": "0g0g4ŊéWŖĖHŚĦZŒöYh&Ņtiu&%uŕĹň&ňŉŕŕ%xŅň%%&ňŕňyĹŉŉŉŅyŕ%uŕuńŕŅhĹňŅĹiňĹŉŉňuyŕ%&%Ŕtŕtĸ",
		"quartzPillarTop": "0g0g5ŊéWņÙYŒöYŖĖHŚĦZ54Ăó6ÁP4ù90úFDs÷)JÎ.rJ@ë1ħJP8ĩóQŋúđi^*i^FjòĝkíF2^?k×D4×?i2CĹ^QłúđkTħJP8ħ1.AJ@îPDAJ)úF0J90J8ęk|yò",
		"redConcrete": "0g0g1õíW",
		"redNetherBricks": "0g0g7$0WÕTHÝÁY)0WQgH-gHUMW000000BmÂQþòþÎČJKÑĂÅBĚÅA0+ħ0+ħÒAãÑĄ}7PAbPAæP%æ_čÙ03Ù03ŀčĂŀĕĆùÖ2ùÖ6ęŐuýİudĘłdĘłĲÔJ_ÓþJTČăTAJĸAJTA",
		"redstoneBlock": "0g0g5ŋëYĤëYČKYÝ(WüÀW0000004íÂQí]4XĂPyI4ċzßCI0đs}Q05@łÚĘI5ĐłÚİ8a@łÚĠù9ołÚİ859q÷]I5]łdīë4đsÛ]į5BAJAù0īköyI4ù9]J]000000",
		"redstoneOre": "0g0g9÷-ZéŞZâľHÖĎYü0Wţ0Wõ0WĐgHĠgH1gixzyg0hx(01jOiiORjNxUh011lÎ1gyxizN1x2hgh*ÞiÅzwxoá@1@hhzMg0ONw05T1zÅih2h1MDÓÎ01MxROw3Myhhg03BK1iz(2âá@i0lÎh6Îxhix01g1yxhhhwhhh0",
		"redWool": "0g0gdüíWĀJWùíWĄJWĐĊWČĊWĈJWĠĹZĐĊHõíWĔĚHĔĊHĀíW1w)0VwÓ2*GïM21JjójĒÎÈVďVM^h/3ĒMçÃ3QFĭ2Q2ya919hw1GQO+ñÃGÄhGVē0^VēV$ĝ1Ĩ2OyĪoJ+5G*GĢVæVĐmÃ30Óh?0ĬylhJĢF)ÒGÂVďĝÎûÈOďĒOĎUäcÒgwĞ1ĒMÉ0ó",
		"sand": "0g0g6ŎăYł/WŊØWľpHĹŏYŖĔY4Ċĸ?ĊĂÑĚŁõr8@+9AĚŀFNĺPĊİÓþóEþ^$üúÒNÇKğÇÛiĲ$þ_%ĚbÒiĄÖüÇ5JÉ(ĚÃ(ĊıBoıÙüÇPĞÇÒĎôlmı?laEĊÇEĒú?oò?kó$üÁ",
		"smoothStone": "0g0g7éŞZâľH÷-ZĒĒYĊóWĚĲWĆåZ42ÂByg&,ÚĕŐqOÖsJ+ŀmĿłĞğy|İsãłp*ĞłÛÖĈ|łÒĕĭŀÃÖČĺPÕmĢŊÚĭő%ĞŊĞģÕ&.+úįŉdğÚĝģ×Â[ÙßÚqlįłĕĠĿN:Øãġx5wiSJg",
		"soulSand": "0g0g6ÇjYSĩH)ĊW]ĹZÖQHåïW4A3{č4ëhÕBCyÁĪFcĊňMItöþĩTįĴõĞ]dIUdħpÖ(KÙq3ÚC3ÏÈRc+İKPRì(qyĬoÖIħ}No{RĈÑwĺRĬwÒðĂëİÐAĞĀĐ^T$4Ĭö-pTÿd",
		"spruceLog": "0g0g6-úW(ÝY{ĨH$ÀY$ÝYUňZ50ķcyX6ħœcy4eSœ4i4{SQgNkQSīĘSÀSXTęgÀëïwT0ÀìXy1Tg5ķyh?g0ķwhko0x3gko4x3Ĉ/8Č5jĘ(wĈX1Àg0SĈj4iëSĊh42X",
		"spruceLogTop": "0g0g8UňZQĩWÇiHìîYåÐHòûYÎyZÞRZ4wSQ20%ğsĚ+ŀd%ĦZŤĐdÈłÞğĀj.AJ[ŇLġğŢ[ĉj]ČûPĀjġĎĺĮŇjġĎĺ[ĈOġČûİĉj.ĚņĮŇjġAJ[ĈLğrÚľĉfŖĞłÚĀdġsþ@Ŀ40SQ2ë",
		"sprucePlanks": "0g0g7ìîYåÐHòûYÎyZÞRZÇiHUňZ4AJ9Aî0ÿ80ùAw2cJi3ãğãğËĖaAüP2KwoÐXë1ùí_0jAŁľãŁŁŕ92ÂPAX40cùĪzSāAAā4ŁğãļłĞÀA4PQiA9cëgPNgÐ0İAĽŔÉGËĞ",
		"stone": "0g0g4÷-ZéŞZâľHÖĎY0ÖĢVÇýÅōÜēđVÀ?5×þĎSB?VØĠü8!VėĢÈý1k5ÄÁÀk1ŀėā×VTV4×@ÿŕ6þčĐÖVV0VÈTÒ",
		"stoneBricks": "0g0g7óEYĆÖZÇÒYéŞZåľYÖĞYÎðW4JPAù2$(0dĞĩxðłÙ8Ł&(sÎĮyNįĪß.ÈiğAõ^ŉĞłÚĞł×ŀ%JÉÚĞAJR4JPë0Łxë3dðŉ&8rK,!MĭĿÚĠŉi(ŋJĲÏdįŃĞł×ĞłÚłÚJ_ÚĞ",
		"tntBottom": "0g0g4ĘÂHĿęY÷-ZùęWkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZkkkkØØØØØØØØZZZZ",
		"tntSide": "0g0gaŐ1YĿęYĘÂHùęWZZZĶ;ZņÚY)ļHoÐZĦĲW0i0i0i0ihzhzhzhzhzhzhzhzhzhzhzhzhzhzhzhz?ÓVÓÒÄÓÑ@GðâÆÔäUÖÆVGÅÄãÓ?ÔÓãGVïþ@ÆÄâÆVðUāāāāāāāāyOyOyOyOhzhzhzhzhzhzhzhzhzhzhzhzyzyzyzyz",
		"tntTop": "0g0g7ĿęYŐ1Y÷-ZĘÂHVVHùęWgTZ4ë]4ë]FNûFNû!ÂĎĸËýÛĮĕÜÓŔ4œ]4Ň]FNěó;û!]ĞŀÇýÛľ+Ĺ[ĕ4òĞłc]!{ĞĹ;û!ÃþĸÖlÛŀĔøÄŔ4ħÝĿį]!NċMOjFÂýFÂýÛĽŔÛĽŔ",
		"waterStill": "0g0g8Īc%ĖĢŔĎĂÚĺ|%Ķ;ŔľËÚZZŔŢŖĕ4üúAùŌPyPBAJBAJA0ÂFy1A2P]JJ?AP]ĊTAiJ4JPAþŗÞJTAJSŀñĀwë_PAJPAÂFAÂQíPPAJPAúPAJPkJFAPA2óPAúzÕawÿşAiP",
		"whiteConcrete": "0g0g3ĶËHĺËHĶ|H4?541S4k40ggh50g?À0Àk1wA0l4g04U0kQ?À4l00U01hÁ0044Àl0hÁ1QÀkTg4Á5h",
		"whiteWool": "0g0gnłêWŊĆHľéZłéZŒĖYŞņHł÷Wņ÷WŚĶWŚņHĺÚYŒĦZľÚYŖĶWZZZŢŖYŎĆYĺËHľÚZŎĖYŖĦZĺËYŞŖY0QNkĮRU*ĔÙÉÊŎĎ1reoįOçĪ,=ì_Ĺÿ.%Æ^ŗXø)uŜïĶÙĳĚýV/Ķyü×J÷ŚU1*RmsÎàĔÂiØçú7.)8ÊŋĉŖpıś*Ŗ^ÑGĈĨ-}ĩSÂ;2šĒdOÊŐčĵçĹÿ<EçĩĞùØpĂķXđp÷ļE%8×ďĢVxÄÿ.Ĕ^sŎčÎĔĹŠĴŕàÿ7ĕčàĵæAzÎćTïŕĀÀŘāŖ",
		"yellowConcrete": "0g0g4řĨHřęHřĨYŕęHlV01zs@S1àÁá?ħń4S9551ÿOÄúKV14ÁVÁN[lÃÆśÁllħħĬĨRļŗh(0oUVUV{Á{0SľQh",
		"yellowWool": "0g0gjŝňZŝŘZŝĸYŝňYŢiHZ>WŢyYŢNZřĨHřĸYZÐZŞ2WŢ2WZÃHZÃYŢyHZNZZ>HŝřW0QNk0MķygPxüĊąØqSĜA$#ÄĮ*Œ:}GEōwKļXö2ŁĹ5ÁO0RĨ890yü]^0ķw122ĜëßÂô2hX!õĝEŖ8Uċāęowĺpę.ĹoĀ1aħJ$RaŋUxÓ1üĎt^ô}â)ōÖÄ>gQgcKXďo2Ñy@8ÀIĠ]x]âEİ.ĄĐĄô>eĽMĒàIĞùķÁSnĄz]yŘïĖK|hëĕ",
		"light": "0g0g1Zŗ7",
		"lightIcon": "0g0g1ZŗA",
		"lavaStill": "0g0g*ńĨZļÀZńęYőîZōÐHńřWįŇHĴgYĸSZŀúHńŉWļìWļÞWŉ2HŀęYĸÁWŉyYŉ2YōÃHŉiYňřHįŗHĸwYļÎWĸ(ZńřHŉNZŢďWŕĻYŀĉYĴwYĴ0YńĸZńęZŕīYŕīHĸÀZōOWŀìHŉiZőČWőüWŕŋZŕĻZĸ(YŉyZįķHőĜHīķHŚ*YōÐYőîYōàY0gRcTToß1Ay^EJĳ)ŉI;Č1MkûÀĹTxVÿK6]5ĎŃÁķÆåŚwïÔĿCDz0ëÆÏ>ÒÑāĀAOÈáî8ù9Ã(İıxĹ^BGP-^0èőÃÆňË%âĨÓĒĴuĪIoí11ď]Îm÷tŞįxVõĝAòäíĽqŌĄĥð5ÖēħęÎĘVŚMĥïĈwĩĳ~#&tñąMVĔ(mnĴħÍKĩIoÏ9ĥ*ńCÒ[(üįKàEĒĉÈMÎýÆî9ĜùÈEÆ)|ķ[éKUPlİ",
		"obsidian": "0g0g540Y00WgMZ-ýHAàZ4Jg&1s4yìÕ8ķBĠQòl8&B28ùìMAPAë8Pië1ħ9]EŃ6g]5)óAJňBīüëĀJIüASĈëSg20ücE4RdīJdĊJö4ķú0a]0K(4w9g]SĊkQ00",
		"cryingObsidian": "0g0g840Y00WE7YgMZ-ýHAàZKqYë&H4üoNìÒ4NúõØoC^?ĕŞ]Âğàfúú*)Ğţë(ÜŉħqÀhŃ:y6Ą^5ĭťQŊFCVńēqł~nŜÐ(řÖÛ20ÿö$DîiÄĹiNăě6ĀĝõbÜAÕ)ÓEpü]KŉtÕ0ë",
		"chiseledNetherBricks": "0g0g7QJY(ÎZ;ßH-ÎZEÁYoMWwTH0229238EpAĐýgĠòAĐd{łÚĞŁd,UĂ?ĕĕQķjPcąQĹóBsdcĻÂScĴ:VĚÉ#Úcķh]õdQĹŝŀĂdQķòSaĴ:ØĞĞłĝTĤħ0ctQĂİ%ĂËçØĞłØĝ",
		"crackedNetherBricks": "0g0g8oMW;ßHQJYwTHEÁY(ÎZ-ÎZ8gH000000BmÂXþđĚňĐĽŇ?Ġ[ÕĞĮÕ0+ħ0+ħÒzśÔs}7ÁÚałAæņÑæİAÙ00c03ŀŜîŘĖuĜb[ĿÎ@ýŖÌĝŢÌdĘłdĘłĴÔJĽÄťĖĸĕþĨļĝĨÙJÁĕ",
		"crackedPolishedBlackstoneBricks": "0g0g6(ěH|BHkMW;ŋHAìZsTY4ĊÇ(þĩcwÉeëqcīŇöĸÈ×6îÎēR{0o192ìę0óPÏúXAóôÏĝ#Â^łÚ$ĉyĘyÇ1ĉyìmÉìĂyÀþĿK/2A+îÖëJÒXy8]2Ù_$þĲ!2_Ú^ŁJ^ēÂ",
		"crackedStoneBricks": "0g0g7ÎðWéŞZĆÖZåľYóEYÇÒYÖĞY5CJFFBīùÑÝĪdQ6{-ù|Ï!PA0ń?ĀpÒíŜöĞĵïĨËçÙŝĶ<?2ķ%Ĉ00P8ĬNīJCÏâõOcùħËÎįTAĂE@i9AŌBQĀpÜRËõġÉŀōĴç<Û00%Ĝ00",
		"endStoneBricks": "0g0g8ĩŏYŒłWŖŃYŖőZĒñHņĂHĶ.HľÇH4ČJÚCQčJÉČJÛÓJŀAě},ł|ĕĞÛĜĞÚ)ěÕĦûÜŝłÕvZZğZīî0AùcA|ČIëĜJAĚ|kJPAĂŀcJŀ)ĞÚĭĽĴĔņŖĽĆÚŝš~mŢHğZşîZZëÙ4J1A",
		"polishedBlackstoneBricks": "0g0g6(ěH|BH;ŋHkMWAìZsTY4ĊÁEüî8wÂi0j8ČĈúEûT42T9Ð]0g0_Ðì#0þ_3ú8AþI3ĝģÉÛłÚEüûęiÁ14j8AÂìkûëüùSwċ]A2T8z?8wgPØ]_$þĲ#2_ÚÛŁłÛģÉ",
		"prismarineBricks": "0g0g8ÛőZÿ;HîrZ@DHÈĢHR6YÂÕWÏāY4J]QJî(0BwSz(86wå5g~ōST<2x<S9:y1Bĩ8jÂ1őĊPĪuTùÿĶŢÊ{SiZ3;ÏA2Ñ3ÌÐ4jŉ<ÍŋDûÐŌjŊWťÃŊiÒZJÒBăŀWłņŚÛĽŔâģÉ",
		"quartzBricks": "0g0g6ŚĦZŒöYŖĖHŖąZŊéWņÙY0000019ĞİAČüdJP%AąQJÉP+ń?Ğİ%J{dJPÙJ{dĜJAþńĚ_ÙþłÑ0S0TÀë%SJPķŀPÀāAħJPķPBÀJÙĻÉPÀJBķJPķłÚUûÚīÇĚÇAĞŀ%",
		"oakDoorBottom": "0g0g9ÖğYýĻWÒRZéîHĞ*WÀřHĎ4ZĢVZíFH1xj)xlUjÎ+Q@+Q@iÎÓhOhjMiÞÂyxÂyClÞxhmxhmjÞxh)xh)iÞxj)xj)iÞ+Q@+Q@*ÎÓÎOmÎOOÞÂyxNyCiìxhmxhmi1xh)xh)lÎxj)xj)jÎ+Q@+Q@NàMÓjMÓjNBVVVVVVV",
		"oakDoorTop": "0g0gbĢVZĎ4ZýĻWÒRZÀřH000íFHĞ*WéîHÚĞZÖğY1g0100g2iyyyyyyz2>ON>ONz2*VÁ*VÁAÏ*VÅ*VÅEJ*VÁ*VÁziìGhìGhz2>ON>ONA2*VÁ*VÁEi*VÅ*VÅz2*VÁ*VÁz2ìGhìGhA2hiIhiIE2>ON>ONziNyxNC×zÕ-Iì-ó]X",
		"warpedDoorBottom": "0g0gb]ŜW/8WyŀZCĂZtVWFĭHCÖH%âWgŊH/-ZËÓY1z?ÔV]IáJVÓGhU?kBV[nāUÇüBhTnāUÇÿxā?ÅāUÁnMāTnhUylMlPÿhßVMýOPÿVAá[NlBnÅ)VllGBVGÑÁlďVRBãQß,5VQ>ÑáBàúh[áâU,V.hTllÐâk.āTlmUÁkU??Q?ááQ",
		"warpedDoorTop": "0g0gcyŀZCĂZ/8WtVWFĭHCÖH/-Z%âWËÓY]ŜWt4WgŊH0gg11102iyNy4>ÂAg4)TQ>?gÔÞVnRzà,í[Å[R>yzJAk>y>ÓÐÏwNzÓ>ÓÑw4+ÔÓzÏwÑ[+ÑÏzÞ7nQ+Ñy>ná4y+ÏS3á?2yNAlSQU2Ó+K[à1>ÏÓ+KGO,àßÓNxáĈÓċíÏN?QĞAğ",
		"endStone": "0g0g6ņĂHľÖHŖłHĭşYĶoYŞŒZ4XI}iĉAEÂùíg9n8?wRÝĊňa^üXĻTÁûÉ(!IÀħĉxoV]XIPİaĉnhČĠTÏNR]Rjïo]&wÁA2RÑüĐ9ħhB4Ï}gSS#zwíýòÂŀwAb(yT5ħĄ",
		"ironTrapdoor": "0g0g8ĚĲWĢŒYĪcWĺ;ZľËH000ņéZŎĆH4üJPi]%ĞŃöĞŀ$ČċÒBp%ÉÐ×łp|ÉÐ×łq|Éà×łĂ|İĤ÷ÜŁÁĞŋúĞŉÁĞŋúĞŉ{ČČïBq|ÉÐ×łq%ÉÐ×łq%Éà×łā%ĴŢÛ|ŀ%ĞŃöĞŀ4JJPi]",
	}
}

const blockData = [
	{
		name: "air",
		id: 0,
		textures: [],
		transparent: true,
		shadow: false,
		solid: false
	},
	{
		name: "grass",
		textures: ["dirt", "grassTop", "grassSide"],
	},
	{ name: "dirt" },
	{ name: "stone" },
	{ name: "bedrock" },
	{ name: "sand" },
	{ name: "gravel" },
	{
		name: "leaves",
		transparent: true,
		hideInterior: false
	},
	{
		name: "glass",
		transparent: true,
		shadow: false,
	},
	{ name: "cobblestone" },
	{ name: "mossyCobblestone" },
	{ name: "stoneBricks" },
	{ name: "mossyStoneBricks" },
	{ name: "bricks" },
	{ name: "coalOre" },
	{ name: "ironOre" },
	{ name: "goldOre" },
	{ name: "diamondOre" },
	{ name: "redstoneOre" },
	{ name: "lapisOre" },
	{ name: "emeraldOre" },
	{ name: "coalBlock" },
	{ name: "ironBlock" },
	{ name: "goldBlock" },
	{ name: "diamondBlock" },
	{ name: "redstoneBlock" },
	{ name: "lapisBlock" },
	{ name: "emeraldBlock" },
	{ name: "oakPlanks" },
	{
		name: "oakLog",
		textures: ["oakLogTop", "oakLog"],
	},
	{ name: "acaciaPlanks" },
	{
		name: "acaciaLog",
		textures: ["acaciaLogTop", "acaciaLog"],
	},
	{ name: "birchPlanks" },
	{
		name: "birchLog",
		textures: ["birchLogTop", "birchLog"],
	},
	{ name: "darkOakPlanks" },
	{
		name: "darkOakLog",
		textures: ["darkOakLogTop", "darkOakLog"],
	},
	{ name: "junglePlanks" },
	{
		name: "jungleLog",
		textures: ["jungleLogTop", "jungleLog"],
	},
	{ name: "sprucePlanks" },
	{
		name: "spruceLog",
		textures: ["spruceLogTop", "spruceLog"],
	},
	{ name: "whiteWool" },
	{ name: "orangeWool" },
	{ name: "magentaWool" },
	{ name: "lightBlueWool" },
	{ name: "yellowWool" },
	{ name: "limeWool" },
	{ name: "pinkWool" },
	{ name: "grayWool" },
	{ name: "lightGrayWool" },
	{ name: "cyanWool" },
	{ name: "purpleWool" },
	{ name: "blueWool" },
	{ name: "brownWool" },
	{ name: "greenWool" },
	{ name: "redWool" },
	{ name: "blackWool" },
	{ name: "whiteConcrete" },
	{ name: "orangeConcrete" },
	{ name: "magentaConcrete" },
	{ name: "lightBlueConcrete" },
	{ name: "yellowConcrete" },
	{ name: "limeConcrete" },
	{ name: "pinkConcrete" },
	{ name: "grayConcrete" },
	{ name: "lightGrayConcrete" },
	{ name: "cyanConcrete" },
	{ name: "purpleConcrete" },
	{ name: "blueConcrete" },
	{ name: "brownConcrete" },
	{ name: "greenConcrete" },
	{ name: "redConcrete" },
	{ name: "blackConcrete" },
	{
		name: "bookshelf",
		textures: ["oakPlanks", "bookshelf"]
	},
	{ name: "netherrack" },
	{ name: "soulSand" },
	{
		name: "glowstone",
		lightLevel: 15
	},
	{ name: "netherWartBlock" },
	{ name: "netherBricks" },
	{ name: "redNetherBricks" },
	{ name: "netherQuartzOre" },
	{
		name: "quartzBlock",
		textures: ["quartzBlockBottom", "quartzBlockTop", "quartzBlockSide"]
	},
	{
		name: "quartzPillar",
		textures: ["quartzPillarTop", "quartzPillar"]
	},
	{
		name: "chiseledQuartzBlock",
		textures: ["chiseledQuartzBlock", "chiseledQuartzBlockTop"]
	},
	{ name: "chiseledStoneBricks" },
	{ name: "smoothStone" },
	{ name: "andesite" },
	{ name: "polishedAndesite" },
	{ name: "diorite" },
	{ name: "polishedDiorite" },
	{ name: "granite" },
	{ name: "polishedGranite" },
	{ name: "light", lightLevel: 15, solid: false, transparent: true, shadow: false, semiTrans: true, icon: "lightIcon" },
	{ name: "water", textures: "waterStill", semiTrans: true, transparent: true, solid: false, shadow: false },
	{ name: "lava", textures: "lavaStill", solid: false, lightLevel: 15 },
	{ name: "obsidian" },
	{ name: "cryingObsidian", lightLevel: 10 },
	{ name: "endStone" },
	{ name: "endStoneBricks" },
	{ name: "chiseledNetherBricks" },
	{ name: "crackedNetherBricks" },
	{ name: "crackedPolishedBlackstoneBricks" },
	{ name: "crackedStoneBricks" },
	{ name: "polishedBlackstoneBricks" },
	{ name: "prismarineBricks" },
	{ name: "quartzBricks" },
	{ name: "oakDoorTop", textures: ["nothing", "oakDoorTop"], solid: false, transparent: true, icon: "oakDoorTop" },
	{ name: "oakDoorBottom", textures: ["nothing", "oakDoorBottom"], solid: false, transparent: true, icon: "oakDoorBottom" },
	{ name: "warpedDoorTop", textures: ["nothing", "warpedDoorTop"], solid: false, transparent: true, icon: "warpedDoorTop" },
	{ name: "warpedDoorBottom", textures: ["nothing", "warpedDoorBottom"], solid: false, transparent: true, icon: "warpedDoorBottom" },
	{ name: "ironTrapdoor", solid: false, transparent: true }
	// I swear, if y'all don't stop asking about TNT every 5 minutes!
	/* {
        name: "tnt",
        textures: ["tntBottom", "tntTop", "tntSide"]
    },*/
]

const BLOCK_COUNT = blockData.length

// Set defaults on blockData
for (let i = 1; i < BLOCK_COUNT; ++i) {
	const data = blockData[i]
	data.id = i

	if ( !("textures" in data) ) {
		data.textures = new Array(6).fill(data.name)
	}
	else if (typeof data.textures === "string") {
		data.textures = new Array(6).fill(data.textures)
	}
	else {
		const { textures } = data

		if (textures.length === 3) {
			textures[3] = textures[2]
			textures[4] = textures[2]
			textures[5] = textures[2]
		}
		else if (textures.length === 2) {
			// Top and bottom are the first texture, sides are the second.
			textures[2] = textures[1]
			textures[3] = textures[2]
			textures[4] = textures[2]
			textures[5] = textures[2]
			textures[1] = textures[0]
		}
	}

	data.transparent ??= false
	data.shadow ??= true
	data.lightLevel ??= 0
	data.solid ??= true
	data.icon ??= false
	data.semiTrans ??= false
	data.hideInterior ??= data.transparent
}

const blockIds = {}
blockData.forEach(block => blockIds[block.name] = block.id)

let Block = {
	top: 0x4,
	bottom: 0x8,
	north: 0x20,
	south: 0x10,
	east: 0x2,
	west: 0x1,
}



/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDatabase": () => (/* binding */ createDatabase),
/* harmony export */   "deleteFromDB": () => (/* binding */ deleteFromDB),
/* harmony export */   "loadFromDB": () => (/* binding */ loadFromDB),
/* harmony export */   "saveToDB": () => (/* binding */ saveToDB)
/* harmony export */ });
async function createDatabase() {
	return await new Promise((resolve, reject) => {
		let request = window.indexedDB.open("MineKhan", 1)

		request.onupgradeneeded = function(event) {
			let DB = event.target.result
			// Worlds will contain and ID containing the timestamp at which the world was created, a "saved" timestamp,
			// and a "data" string that's identical to the copy/paste save string
			let store = DB.createObjectStore("worlds", { keyPath: "id" })
			store.createIndex("id", "id", { unique: true })
			store.createIndex("data", "data", { unique: false })
		}

		request.onsuccess = function() {
			resolve(request.result)
		}

		request.onerror = function(e) {
			console.error(e)
			reject(e)
		}
	})
}
async function loadFromDB(id) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = id ? store.get(id) : store.getAll()
	return await new Promise(resolve => {
		req.onsuccess = function() {
			resolve(req.result)
			db.close()
		}
		req.onerror = function() {
			resolve(null)
			db.close()
		}
	})
}
async function saveToDB(id, data) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = store.put({ id: id, data: data })
	return new Promise((resolve, reject) => {
		req.onsuccess = function() {
			resolve(req.result)
		}
		req.onerror = function(e) {
			reject(e)
		}
	})
}
async function deleteFromDB(id) {
	let db = await createDatabase()
	let trans = db.transaction("worlds", "readwrite")
	let store = trans.objectStore("worlds")
	let req = store.delete(id)
	return new Promise((resolve, reject) => {
		req.onsuccess = function() {
			resolve(req.result)
		}
		req.onerror = function(e) {
			reject(e)
		}
	})
}



/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shapes": () => (/* binding */ shapes)
/* harmony export */ });
function objectify(x, y, z, width, height, textureX, textureY) {
	return {
		x: x,
		y: y,
		z: z,
		w: width,
		h: height,
		tx: textureX,
		ty: textureY
	}
}
let shapes = {
	/*
		[
			[(-x, -z), (+x, -z), (+x, +z), (-x, +z)], // minX = 0,  minZ = 2,  maxX = 6, maxZ = 8
			[(-x, +z), (+x, +z), (+x, -z), (-x, -z)], // minX = 9,  minZ = 10, maxX = 3, maxZ = 4
			[(+x, +y), (-x, +y), (-x, -y), (+x, -y)], // minX = 6,  minY = 7,  maxX = 0, maxY = 1
			[(-x, +y), (+x, +y), (+x, -y), (-x, -y)], // minX = 9,  minY = 10, maxX = 3, maxY = 4
			[(+y, -z), (+y, +z), (-y, +z), (-y, -z)], // minY = 10, minZ = 11, maxY = 4, maxZ = 5
			[(+y, +z), (+y, -z), (-y, -z), (-y, +z)]  // minY = 7,  minZ = 8,  maxY = 1, maxZ = 2
		]
		*/
	cube: {
		verts: [
			// x, y, z, width, height, textureX, textureY
			// 0, 0, 0 is the corner on the top left of the texture
			[objectify( 0,  0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 16, 16, 16, 16, 0, 0)], //top
			[objectify(16, 16, 16, 16, 16, 0, 0)], //north
			[objectify( 0, 16,  0, 16, 16, 0, 0)], //south
			[objectify(16, 16,  0, 16, 16, 0, 0)], //east
			[objectify( 0, 16, 16, 16, 16, 0, 0)]  //west
		],
		cull: {
			top: 3,
			bottom: 3,
			north: 3,
			south: 3,
			east: 3,
			west: 3
		},
		texVerts: [],
		varients: [],
		buffer: null,
		size: 6
	},
	slab: {
		verts: [
			[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 8, 16, 16, 16, 0, 0)], //top
			[objectify(16, 8, 16, 16, 8, 0, 0)], //north
			[objectify( 0, 8,  0, 16, 8, 0, 0)], //south
			[objectify(16, 8,  0, 16, 8, 0, 0)], //east
			[objectify( 0, 8, 16, 16, 8, 0, 0)]  //west
		],
		cull: {
			top: 0,
			bottom: 3,
			north: 1,
			south: 1,
			east: 1,
			west: 1
		},
		texVerts: [],
		buffer: null,
		size: 6,
		varients: [],
		flip: true,
		rotate: false
	},
	stair: {
		verts: [
			[objectify( 0, 0,  0, 16, 16, 0, 0)], //bottom
			[objectify( 0, 8,  8, 16, 8, 0, 8), objectify( 0, 16,  16, 16, 8, 0, 0)], //top
			[objectify(16, 16, 16, 16, 16, 0, 0)], //north
			[objectify( 0, 8,  0, 16, 8, 0, 0), objectify( 0, 16,  8, 16, 8, 0, 0)], //south
			[objectify(16, 8, 0, 8, 8, 8, 0), objectify(16, 16, 8, 8, 16, 0, 0)], //east
			[objectify( 0, 8, 8, 8, 8, 0, 0), objectify( 0, 16, 16, 8, 16, 8, 0)]  //west
		],
		cull: {
			top: 0,
			bottom: 3,
			north: 3,
			south: 0,
			east: 0,
			west: 0
		},
		texVerts: [],
		buffer: null,
		size: 10,
		varients: [],
		flip: true,
		rotate: true
	},
}



/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createProgramObject": () => (/* binding */ createProgramObject),
/* harmony export */   "uniformMatrix": () => (/* binding */ uniformMatrix),
/* harmony export */   "vertexAttribPointer": () => (/* binding */ vertexAttribPointer)
/* harmony export */ });
function createProgramObject(curContext, vetexShaderSource, fragmentShaderSource) {
	let vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER)
	curContext.shaderSource(vertexShaderObject, vetexShaderSource)
	curContext.compileShader(vertexShaderObject)
	if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
		throw curContext.getShaderInfoLog(vertexShaderObject)
	}

	let fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER)
	curContext.shaderSource(fragmentShaderObject, fragmentShaderSource)
	curContext.compileShader(fragmentShaderObject)
	if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
		throw curContext.getShaderInfoLog(fragmentShaderObject)
	}

	let programObject = curContext.createProgram()
	curContext.attachShader(programObject, vertexShaderObject)
	curContext.attachShader(programObject, fragmentShaderObject)
	curContext.linkProgram(programObject)
	if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
		throw "Error linking shaders."
	}

	return programObject
}

function uniformMatrix(gl, glCache, cacheId, programObj, vrName, transpose, matrix) {
	let vrLocation = glCache[cacheId]
	if(vrLocation === undefined) {
		vrLocation = gl.getUniformLocation(programObj, vrName)
		glCache[cacheId] = vrLocation
	}
	gl.uniformMatrix4fv(vrLocation, transpose, matrix)
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {{}} glCache
 * @param {String} cacheId
 * @param {WebGLProgram} programObj
 * @param {String} vrName
 * @param {Number} size
 * @param {WebGLBuffer} VBO
 */
function vertexAttribPointer(gl, glCache, cacheId, programObj, vrName, size, VBO) {
	let vrLocation = glCache[cacheId]
	if(vrLocation === undefined) {
		vrLocation = gl.getAttribLocation(programObj, vrName)
		glCache[cacheId] = vrLocation
	}
	if (vrLocation !== -1) {
		gl.enableVertexAttribArray(vrLocation)
		gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
		gl.vertexAttribPointer(vrLocation, size, gl.FLOAT, false, 0, 0)

	}
}



/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initTextures": () => (/* binding */ initTextures),
/* harmony export */   "textureAtlas": () => (/* binding */ textureAtlas),
/* harmony export */   "textureCoords": () => (/* binding */ textureCoords),
/* harmony export */   "textureMap": () => (/* binding */ textureMap)
/* harmony export */ });
/* harmony import */ var _blockData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


const textureMap = {}
const textureCoords = []

let dirtTexture
let textureAtlas

function initTextures(gl, glCache) {
	let textureSize = 256
	let scale = 1 / 16
	let texturePixels = new Uint8Array(textureSize * textureSize * 4)
	const setPixel = function(textureNum, x, y, r, g, b, a) {
		let texX = textureNum & 15
		let texY = textureNum >> 4
		let offset = (texY * 16 + y) * 1024 + texX * 64 + x * 4
		texturePixels[offset] = r
		texturePixels[offset + 1] = g
		texturePixels[offset + 2] = b
		texturePixels[offset + 3] = a !== undefined ? a : 255
	}

	const base256CharSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEF!#$%&L(MNO)*+,-./:;<=WSTR>Q?@[]P^_{|}~ÀÁÂÃUVÄÅÆÇÈÉÊËÌÍKÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãGäåæçèéêHëìíîXïðñIòóôõö÷øùúJûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦYħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťZ'
	const base256DecodeMap = new Map()
	for (let i = 0; i < 256; i++) base256DecodeMap.set(base256CharSet[i], i)
	function decodeByte(str) {
		let num = 0
		for (let char of str) {
			num <<= 8
			num += base256DecodeMap.get(char)
		}
		return num
	}

	const getPixels = function(str, r = 255, g = 255, b = 255) {
		if (Array.isArray(r)) {
			[r, g, b] = r
		}
		const width = decodeByte(str.substr(0, 2))
		const height = decodeByte(str.substr(2, 2))
		const colorCount = decodeByte(str.substr(4, 1))
		const colors = []
		const pixels = new Uint8ClampedArray(width * height * 4)
		let pixi = 0

		for (let i = 0; i < colorCount; i++) {
			const num = decodeByte(str.substr(5 + i * 3, 3))

			let alpha = (num & 63) << 2
			let blue  = (num >>> 6 & 63) << 2
			let green = (num >>> 12 & 63) << 2
			let red   = (num >>> 18 & 63) << 2
			if (alpha >= 240) alpha = 255 // Make sure we didn't accidentally make the texture transparent

			if (red === blue && red === green) {
				red = red / 252 * r | 0
				green = green / 252 * g | 0
				blue = blue / 252 * b | 0
			}
			colors.push([red, green, blue, alpha])
		}

		// Special case for a texture filled with 1 pixel color
		if (colorCount === 1) {
			while (pixi < pixels.length) {
				pixels[pixi + 0] = colors[0][0]
				pixels[pixi + 1] = colors[0][1]
				pixels[pixi + 2] = colors[0][2]
				pixels[pixi + 3] = colors[0][3]
				pixi += 4
			}
			return pixels
		}

		let bytes = []
		for (let i = 5 + colorCount * 3; i < str.length; i++) { // Load the bit-packed index array
			const byte = decodeByte(str[i])
			bytes.push(byte)
		}

		const bits = Math.ceil(Math.log2(colorCount))
		const bitMask = (1 << bits) - 1
		let filledBits = 8
		let byte = bytes.shift()
		while (bytes.length || filledBits) {
			let num = 0
			if (filledBits >= bits) { // The entire number is inside the byte
				num = byte >> filledBits - bits & bitMask
				if (filledBits === bits && bytes.length) {
					byte = bytes.shift()
					filledBits = 8
				}
				else filledBits -= bits
			}
			else {
				num = byte << bits - filledBits & bitMask // Only part of the number is in the byte
				byte = bytes.shift() // Load in the next byte
				num |= byte >> 8 - bits + filledBits // Apply the rest of the number from this byte
				filledBits += 8 - bits
			}

			pixels[pixi + 0] = colors[num][0]
			pixels[pixi + 1] = colors[num][1]
			pixels[pixi + 2] = colors[num][2]
			pixels[pixi + 3] = colors[num][3]
			pixi += 4
		}
		return pixels
	}

	const textures = (0,_blockData_js__WEBPACK_IMPORTED_MODULE_0__.texturesFunc)(setPixel, getPixels)

	{
		// Specify the texture coords for each index
		const s = scale
		for (let i = 0; i < 256; i++) {
			let texX = i & 15
			let texY = i >> 4
			let offsetX = texX * s
			let offsetY = texY * s
			textureCoords.push(new Float32Array([offsetX, offsetY, offsetX + s, offsetY, offsetX + s, offsetY + s, offsetX, offsetY + s]))
		}

		// Set all of the textures into 1 big tiled texture
		let n = 0
		for (let name in textures) {
			if (typeof textures[name] === "function") {
				textures[name](n)
			}
			else if (typeof textures[name] === "string") {
				let pix = name.includes("water")
					? getPixels(textures[name], 40, 100, 220)
					: getPixels(textures[name])
				for (let j = 0; j < pix.length; j += 4) {
					setPixel(n, j >> 2 & 15, j >> 6, pix[j], pix[j+1], pix[j+2], pix[j+3])
				}
			}
			textureMap[name] = n
			n++
		}

		//Set the hitbox texture to 1 pixel
		let arr = new Float32Array(192)
		for (let i = 0; i < 192; i += 2) {
			arr[i] = textureCoords[textureMap.hitbox][0] + 0.01
			arr[i + 1] = textureCoords[textureMap.hitbox][1] + 0.01
		}
		textureCoords[textureMap.hitbox] = arr
	}

	// Big texture with everything in it
	textureAtlas = gl.createTexture()
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, textureAtlas)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, texturePixels)
	gl.generateMipmap(gl.TEXTURE_2D)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.uniform1i(glCache.uSampler, 0)

	// Dirt texture for the background
	let dirtPixels = new Uint8Array(getPixels(textures.dirt))
	dirtTexture = gl.createTexture()
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, dirtTexture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, dirtPixels)
	gl.generateMipmap(gl.TEXTURE_2D)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
}



/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSkybox": () => (/* binding */ getSkybox)
/* harmony export */ });
/* harmony import */ var _shaders_skyFrag_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
/* harmony import */ var _shaders_skyVert_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _glUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);



/**
 * Initialize the skybox shaders and return the render function
 * @param {WebGLRenderingContext} gl gl
 * @returns Rendering function
 */
function getSkybox(gl, glCache, program3D, program3DFogless) {
	// I can't explain why, but the directions are all backwards from the world coordinates
	const vertexData = new Float32Array([
		// top
		-1, -1, -1, // 1
		 1, -1, -1, // 2
		 1, -1,  1, // 3
		 1, -1,  1, // 3
		-1, -1,  1, // 4
		-1, -1, -1, // 1

		// bottom
		-1,  1, -1, // 1
		-1,  1,  1, // 2
		 1,  1,  1, // 3
		 1,  1,  1, // 3
		 1,  1, -1, // 4
		-1,  1, -1, // 1

		// south
		1, -1, -1, // 1
		1,  1, -1, // 2
		1,  1,  1, // 3
		1,  1,  1, // 3
		1, -1,  1, // 4
		1, -1, -1, // 1

		// north
		-1, -1, -1, // 1
		-1, -1,  1, // 2
		-1,  1,  1, // 3
		-1,  1,  1, // 3
		-1,  1, -1, // 4
		-1, -1, -1, // 1

		// west
		-1, -1, 1, // 1
		 1, -1, 1, // 2
		 1,  1, 1, // 3
		 1,  1, 1, // 3
		-1,  1, 1, // 4
		-1, -1, 1, // 1

		// east
		-1, -1, -1, // 1
		-1,  1, -1, // 2
		 1,  1, -1, // 3
		 1,  1, -1, // 3
		 1, -1, -1, // 4
		-1, -1, -1, // 1
	].map(n => n * 1))


	const buffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)

	const skyboxProgram = (0,_glUtils__WEBPACK_IMPORTED_MODULE_2__.createProgramObject)(gl, _shaders_skyVert_glsl__WEBPACK_IMPORTED_MODULE_1__["default"], _shaders_skyFrag_glsl__WEBPACK_IMPORTED_MODULE_0__["default"])

	const aVertex = gl.getAttribLocation(skyboxProgram, "aVertex")
	const uTime = gl.getUniformLocation(skyboxProgram, "uTime")
	const uView = gl.getUniformLocation(skyboxProgram, "uView")
	const uSun = gl.getUniformLocation(skyboxProgram, "uSun")
	const uHorizon = gl.getUniformLocation(skyboxProgram, "uHorizon")

	const dayLength = 600 // seconds
	const horizonDay = [0.65, 0.7, 0.8]
	const horizonDawn = [0.95, 0.35, 0.2]

	const smoothstep = (edge0, edge1, x) => {
		let t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0)
		return t * t * (3.0 - 2.0 * t)
	}
	return function renderSkybox(time, view) {
		time %= dayLength
		const cos = Math.cos(time * Math.PI * 2 / dayLength)
		const sin = Math.sin(time * Math.PI * 2 / dayLength)
		const mag = Math.sqrt(cos*cos + sin*sin*2)
		let sunset = 1 - Math.abs(cos / mag)
		sunset *= sunset

		const horizonColor = [
			(horizonDawn[0] - horizonDay[0]) * sunset + horizonDay[0],
			(horizonDawn[1] - horizonDay[1]) * sunset + horizonDay[1],
			(horizonDawn[2] - horizonDay[2]) * sunset + horizonDay[2],
		]

		const sun = [sin/mag, cos/mag, sin/mag]
		const skyBrightness = Math.max(smoothstep(-0.5, 0.3, -cos/mag), 0.3)

		// Set uniform for program3DFogless
		gl.useProgram(program3DFogless)
		gl.uniform1f(glCache.uTimeFogless, skyBrightness)

		// Set uniform for program3D
		gl.useProgram(program3D)
		gl.uniform3f(glCache.uSky, horizonColor[0], horizonColor[1], horizonColor[2])
		gl.uniform3f(glCache.uSun, sun[0], sun[1], sun[2])
		gl.uniform1f(glCache.uTime, skyBrightness)

		gl.useProgram(skyboxProgram)
		gl.disableVertexAttribArray(glCache.aSkylight)
		gl.disableVertexAttribArray(glCache.aBlocklight)
		gl.disableVertexAttribArray(glCache.aShadow)
		gl.disableVertexAttribArray(glCache.aTexture)

		gl.uniform1f(uTime, time)
		gl.uniform3f(uSun, sun[0], sun[1], sun[2])
		gl.uniform3f(uHorizon, horizonColor[0], horizonColor[1], horizonColor[2])
		gl.uniformMatrix4fv(uView, false, view)

		gl.depthFunc(gl.EQUAL)

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0)
		gl.drawArrays(gl.TRIANGLES, 0, 6 * 6)//, gl.UNSIGNED_INT, 0)

		gl.depthFunc(gl.LESS)
	}
}



/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nuniform float uTime;\nuniform vec3 uSun;\nuniform vec3 uHorizon;\nvarying vec3 position;\n\n/*\nfloat rand3D(in vec3 co) {\n\treturn fract(sin(dot(co.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);\n}\nfloat simple_interpolate(in float a, in float b, in float x) {\n\treturn a + smoothstep(0.0,1.0,x) * (b-a);\n}\nfloat interpolatedNoise3D(in float x, in float y, in float z) {\n\tfloat integer_x = x - fract(x);\n\tfloat fractional_x = x - integer_x;\n\n\tfloat integer_y = y - fract(y);\n\tfloat fractional_y = y - integer_y;\n\n\tfloat integer_z = z - fract(z);\n\tfloat fractional_z = z - integer_z;\n\n\tfloat v1 = rand3D(vec3(integer_x, integer_y, integer_z));\n\tfloat v2 = rand3D(vec3(integer_x+1.0, integer_y, integer_z));\n\tfloat v3 = rand3D(vec3(integer_x, integer_y+1.0, integer_z));\n\tfloat v4 = rand3D(vec3(integer_x+1.0, integer_y +1.0, integer_z));\n\n\tfloat v5 = rand3D(vec3(integer_x, integer_y, integer_z+1.0));\n\tfloat v6 = rand3D(vec3(integer_x+1.0, integer_y, integer_z+1.0));\n\tfloat v7 = rand3D(vec3(integer_x, integer_y+1.0, integer_z+1.0));\n\tfloat v8 = rand3D(vec3(integer_x+1.0, integer_y +1.0, integer_z+1.0));\n\n\tfloat i1 = simple_interpolate(v1,v5, fractional_z);\n\tfloat i2 = simple_interpolate(v2,v6, fractional_z);\n\tfloat i3 = simple_interpolate(v3,v7, fractional_z);\n\tfloat i4 = simple_interpolate(v4,v8, fractional_z);\n\n\tfloat ii1 = simple_interpolate(i1,i2,fractional_x);\n\tfloat ii2 = simple_interpolate(i3,i4,fractional_x);\n\n\treturn simple_interpolate(ii1 , ii2 , fractional_y);\n}\nfloat Noise3D(in vec3 coord, in float wavelength) {\n\treturn interpolatedNoise3D(coord.x/wavelength, coord.y/wavelength, coord.z/wavelength);\n}\nfloat noise(vec3 p, float frequency) {\n\tfloat sum = 0.0;\n\tfor (float i = 0.0; i < 5.0; i++) {\n\t\tsum += Noise3D(p * frequency * pow(2.0, i), 1.0) / pow(2.0, i);\n\t}\n\treturn sum * 0.5;\n}\n*/\n\nconst vec3 skyColor = vec3(0.25, 0.45, 0.7);\nconst vec3 sunColor = vec3(1.0, 1.0, 0.7);\nconst vec3 moonColor = vec3(0.7);\nvoid main (void) {\n\tvec3 dir = normalize(position);\n\tfloat horizonal = 1.0 - abs(dir.y);\n\n\tfloat sunDot = dot(dir, uSun);\n\tvec3 col = mix(skyColor, uHorizon, horizonal * horizonal * (sunDot * 0.5 + 1.2)); // Mix the sky and the horizon\n\t\n\n\t// float cloud = noise(position + uTime * 0.02, 10.0);\n\t// col = mix(col, vec3(1.0), cloud);\n\n\t// The sky starts getting darker when it's 30% above the horizon, then reachest max darkness at 50% below the horizon\n\tcol *= max(smoothstep(-0.5, 0.3, -uSun.y), 0.3);\n\t// col *= clamp((-uSun.y + 0.5) / 0.8, 0.1, 1.0);\n\n\t// Draw the sun\n\tfloat sun = 1.0 - max(sunDot * 50.0 - 49.0, 0.0);\n\tcol = mix(col, sunColor, 1.0 - sun * sun);\n\n\tif (dot(dir, -uSun) > 0.994) col = moonColor; // Draw the moon\n\tgl_FragColor = vec4(col, 1.0);\n}");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec3 aVertex;\nuniform float uTime;\nuniform mat4 uView;\nvarying vec3 position;\nmat4 no_translate (mat4 mat) {\n\tmat4 nmat = mat;\n\tnmat[3].xyz = vec3(0.0);\n\n\treturn nmat;\n}\nvoid main(void) {\n   position = aVertex;\n   gl_Position = no_translate(uView) * vec4(aVertex * -100.0, 0.0);\n}");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Chunk": () => (/* binding */ Chunk)
/* harmony export */ });
/* harmony import */ var _random_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _blockData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17);
/* harmony import */ var _texture_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);



// let world

const { floor, max, abs } = Math
const semiTrans = new Uint8Array(_blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData.filter((data, i) => data && i < 256).map(data => data.semiTrans ? 1 : 0))
const transparent = new Uint8Array(1 << 13) // 5 bits of block state
for (let i = 0; i < _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData.length; i++) transparent[i] = _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData[i].transparent ? 1 : 0
const hideInterior = new Uint8Array(255)
hideInterior.set(_blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData.slice(0, 255).map(data => data.hideInterior))

transparent.fill(1, 256) // Anything other than default cubes should be considered transparent for lighting and face culling

const shadow = new Uint8Array(_blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData.map(data => data.shadow ? 1 : 0))
const lightLevels = new Uint8Array(_blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData.map(data => data.lightLevel || 0))

// Save the coords for a small sphere used to carve out caves
let sphere = new Int8Array([-2,-1,-1,-2,-1,0,-2,-1,1,-2,0,-1,-2,0,0,-2,0,1,-2,1,-1,-2,1,0,-2,1,1,-1,-2,-1,-1,-2,0,-1,-2,1,-1,-1,-2,-1,-1,-1,-1,-1,0,-1,-1,1,-1,-1,2,-1,0,-2,-1,0,-1,-1,0,0,-1,0,1,-1,0,2,-1,1,-2,-1,1,-1,-1,1,0,-1,1,1,-1,1,2,-1,2,-1,-1,2,0,-1,2,1,0,-2,-1,0,-2,0,0,-2,1,0,-1,-2,0,-1,-1,0,-1,0,0,-1,1,0,-1,2,0,0,-2,0,0,-1,0,0,0,0,0,1,0,0,2,0,1,-2,0,1,-1,0,1,0,0,1,1,0,1,2,0,2,-1,0,2,0,0,2,1,1,-2,-1,1,-2,0,1,-2,1,1,-1,-2,1,-1,-1,1,-1,0,1,-1,1,1,-1,2,1,0,-2,1,0,-1,1,0,0,1,0,1,1,0,2,1,1,-2,1,1,-1,1,1,0,1,1,1,1,1,2,1,2,-1,1,2,0,1,2,1,2,-1,-1,2,-1,0,2,-1,1,2,0,-1,2,0,0,2,0,1,2,1,-1,2,1,0,2,1,1])

// {
// 	let blocks = []
// 	let radius = 3.5
// 	let radsq = radius * radius
// 	for (let i = -radius; i <= radius; i++) {
// 		for (let j = -radius; j <= radius; j++) {
// 			for (let k = -radius; k <= radius; k++) {
// 				if (i*i + j*j + k*k < radsq) {
// 					blocks.push(i|0, j|0, k|0)
// 				}
// 			}
// 		}
// 	}
// 	sphere = new Int8Array(blocks)
// }
// console.log(sphere)

function carveSphere(x, y, z, world) {
	if (y > 3) {
		for (let i = 0; i < sphere.length; i += 3) {
			world.setWorldBlock(x + sphere[i], y + sphere[i + 1], z + sphere[i + 2], _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.air, true)
		}
	}
}

let getShadows
{
	const shade = [1, 0.85, 0.7, 0.6, 0.3]
	const ret = []
	getShadows = [
		b => { // Bottom
			ret[0] = shade[b[0] + b[3] + b[1] + b[4]]*0.75
			ret[1] = shade[b[3] + b[6] + b[4] + b[7]]*0.75
			ret[2] = shade[b[7] + b[4] + b[8] + b[5]]*0.75
			ret[3] = shade[b[4] + b[1] + b[5] + b[2]]*0.75
			return ret
		},
		b => { // Top
			ret[0] = shade[b[20] + b[19] + b[23] + b[22]]
			ret[1] = shade[b[26] + b[25] + b[23] + b[22]]
			ret[2] = shade[b[24] + b[21] + b[25] + b[22]]
			ret[3] = shade[b[18] + b[21] + b[19] + b[22]]
			return ret
		},
		b => { // North
			ret[0] = shade[b[17] + b[26] + b[23] + b[14]]*0.95
			ret[1] = shade[b[11] + b[20] + b[23] + b[14]]*0.95
			ret[2] = shade[b[11] + b[2]  + b[5]  + b[14]]*0.95
			ret[3] = shade[b[17] + b[8]  + b[5]  + b[14]]*0.95
			return ret
		},
		b => { // South
			ret[0] = shade[b[9]  + b[18] + b[12] + b[21]]*0.95
			ret[1] = shade[b[21] + b[12] + b[24] + b[15]]*0.95
			ret[2] = shade[b[12] + b[3]  + b[15] + b[6]]*0.95
			ret[3] = shade[b[0]  + b[9]  + b[3]  + b[12]]*0.95
			return ret
		},
		b => { // East
			ret[0] = shade[b[15] + b[24] + b[16] + b[25]]*0.8
			ret[1] = shade[b[25] + b[16] + b[26] + b[17]]*0.8
			ret[2] = shade[b[16] + b[7] + b[17] + b[8]]*0.8
			ret[3] = shade[b[6] + b[15] + b[7] + b[16]]*0.8
			return ret
		},
		b => { // West
			ret[0] = shade[b[11] + b[20] + b[10] + b[19]]*0.8
			ret[1] = shade[b[19] + b[10] + b[18] + b[9]]*0.8
			ret[2] = shade[b[10] + b[1]  + b[9]  + b[0]]*0.8
			ret[3] = shade[b[2]  + b[11] + b[1]  + b[10]]*0.8
			return ret
		},
	]
}

function average(l, a, b, c, d) {
	a = l[a]
	b = l[b]
	c = l[c]
	d = l[d]
	let count = 1
	let zero = 0
	let total = a
	if (b && abs(a-b) <= 2) {
		total += b
		count++
	}
	else zero++
	if (c && abs(a-c) <= 2) {
		total += c
		count++
	}
	else zero++
	if (d && abs(a-d) <= 2) {
		total += d
		count++
	}
	else zero++

	let mx = max(a, b, c, d)
	if (mx > 2) {
		return total / (count * 15)
	}
	if (mx > 1) {
		return zero ? total / (count * 15 + 15) : total / (count * 15)
	}
	return total / 60
}

let getLight
{
	const blocks = []
	getLight = [
		(lights27, ret, blockMask, blockShift) => { // Bottom
			const face = (lights27[4] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[3] & blockMask) >> blockShift
			blocks[2] = (lights27[6] & blockMask) >> blockShift
			blocks[3] = (lights27[1] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[7] & blockMask) >> blockShift
			blocks[6] = (lights27[2] & blockMask) >> blockShift
			blocks[7] = (lights27[5] & blockMask) >> blockShift
			blocks[8] = (lights27[8] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 0, 1, 3)
			ret[1] = average(blocks, 4, 1, 2, 5)
			ret[2] = average(blocks, 4, 5, 7, 8)
			ret[3] = average(blocks, 4, 3, 6, 7)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // Top
			const face = (lights27[22] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[18] & blockMask) >> blockShift
			blocks[1] = (lights27[21] & blockMask) >> blockShift
			blocks[2] = (lights27[24] & blockMask) >> blockShift
			blocks[3] = (lights27[19] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[25] & blockMask) >> blockShift
			blocks[6] = (lights27[20] & blockMask) >> blockShift
			blocks[7] = (lights27[23] & blockMask) >> blockShift
			blocks[8] = (lights27[26] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 3, 6, 7)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 1, 2, 5)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // North
			const face = (lights27[14] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[2] & blockMask) >> blockShift
			blocks[1] = (lights27[5] & blockMask) >> blockShift
			blocks[2] = (lights27[8] & blockMask) >> blockShift
			blocks[3] = (lights27[11] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[17] & blockMask) >> blockShift
			blocks[6] = (lights27[20] & blockMask) >> blockShift
			blocks[7] = (lights27[23] & blockMask) >> blockShift
			blocks[8] = (lights27[26] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 5, 7, 8)
			ret[1] = average(blocks, 4, 3, 6, 7)
			ret[2] = average(blocks, 4, 0, 1, 3)
			ret[3] = average(blocks, 4, 1, 2, 5)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // South
			const face = (lights27[12] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[9] & blockMask) >> blockShift
			blocks[2] = (lights27[18] & blockMask) >> blockShift
			blocks[3] = (lights27[3] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[21] & blockMask) >> blockShift
			blocks[6] = (lights27[6] & blockMask) >> blockShift
			blocks[7] = (lights27[15] & blockMask) >> blockShift
			blocks[8] = (lights27[24] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 1, 2, 5)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 3, 6, 7)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // East
			const face = (lights27[16] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[6] & blockMask) >> blockShift
			blocks[1] = (lights27[15] & blockMask) >> blockShift
			blocks[2] = (lights27[24] & blockMask) >> blockShift
			blocks[3] = (lights27[7] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[25] & blockMask) >> blockShift
			blocks[6] = (lights27[8] & blockMask) >> blockShift
			blocks[7] = (lights27[17] & blockMask) >> blockShift
			blocks[8] = (lights27[27] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 1, 2, 5)
			ret[1] = average(blocks, 4, 5, 7, 8)
			ret[2] = average(blocks, 4, 3, 6, 7)
			ret[3] = average(blocks, 4, 0, 1, 3)
			return ret
		},
		(lights27, ret, blockMask, blockShift) => { // West
			const face = (lights27[10] & blockMask) >> blockShift
			if (face === 0 || face === 15) {
				const n = face / 15
				ret[0] = n
				ret[1] = n
				ret[2] = n
				ret[3] = n
				return ret
			}
			blocks[0] = (lights27[0] & blockMask) >> blockShift
			blocks[1] = (lights27[9] & blockMask) >> blockShift
			blocks[2] = (lights27[18] & blockMask) >> blockShift
			blocks[3] = (lights27[1] & blockMask) >> blockShift
			blocks[4] = face
			blocks[5] = (lights27[19] & blockMask) >> blockShift
			blocks[6] = (lights27[2] & blockMask) >> blockShift
			blocks[7] = (lights27[11] & blockMask) >> blockShift
			blocks[8] = (lights27[20] & blockMask) >> blockShift

			ret[0] = average(blocks, 4, 5, 7, 8)
			ret[1] = average(blocks, 4, 1, 2, 5)
			ret[2] = average(blocks, 4, 0, 1, 3)
			ret[3] = average(blocks, 4, 3, 6, 7)
			return ret
		}
	]
}

class Chunk {
	/**
	 * @param {Number} x
	 * @param {Number} z
	 * @param {World} world
	 * @param {{vertex_array_object: OES_vertex_array_object}} glExtensions
	 * @param {WebGLRenderingContext} gl
	 * @param {Object} glCache
	 * @param {Boolean} superflat
	 * @param {Boolean} caves
	 */
	constructor(x, z, world, glExtensions, gl, glCache, superflat, caves) {
		this.x = x
		this.z = z
		this.maxY = 0
		this.minY = 255
		this.tops = new Uint8Array(16 * 16) // Store the heighest block at every (x,z) coordinate
		this.optimized = false
		this.generated = false // Terrain
		this.populated = superflat // Trees and ores
		this.lit = false
		this.lightDropped = false
		this.edited = false
		this.loaded = false
		// vao for this chunk
		this.vao = glExtensions.vertex_array_object.createVertexArrayOES()
		this.caves = !caves
		this.world = world
		this.gl = gl
		this.glCache = glCache
		this.glExtensions = glExtensions
		this.doubleRender = false
		this.blocks = new Int16Array(16*16*256)
		this.originalBlocks = new Int16Array(0)
		this.light = new Uint8Array(16*16*256)
		this.renderData = []
		this.renderLength = 0
		this.hasBlockLight = false

		// These are temporary and will be removed after the chunk is generated.
		this.blockSpread = []
		this.visFlags = new Int8Array(0)
		this.shadowFlags = new Int8Array(0)
	}
	getBlock(x, y, z) {
		// if (y < 0 || y > 255) debugger
		return this.blocks[y * 256 + x * 16 + z]
	}
	setBlock(x, y, z, blockID, user) {
		if (user && !this.edited) {
			this.edited = true
			this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}

		if (semiTrans[blockID & 255]) {
			this.doubleRender = true
			if (!this.world.doubleRenderChunks.includes(this)) {
				this.world.doubleRenderChunks.push(this)
			}
		}
		this.blocks[y * 256 + x * 16 + z] = blockID
	}

	processBlocks() {
		// Do some pre-processing for dropLight, optimize, and genMesh. It's more efficient to do it all at once.
		const { blocks, maxY, blockSpread, world } = this
		const trans = transparent

		const chunkN = world.getChunk(this.x, this.z + 16).blocks
		const chunkS = world.getChunk(this.x, this.z - 16).blocks
		const chunkE = world.getChunk(this.x + 16, this.z).blocks
		const chunkW = world.getChunk(this.x - 16, this.z).blocks

		const flags = new Int8Array((maxY + 1) * 256)
		this.visFlags = flags
		// this.shadowFlags = new Int32Array(flags.length >> 5)
		for (let i = flags.length - 256; i < flags.length; i++) {
			flags[i] = 8 // Up is Air
		}
		for (let i = 0; i < 255; i++) this.shadowFlags[i] = 1
		for (let i = 256; i < flags.length; i++) {
			const x = i >> 4 & 15
			const z = i & 15
			const b = blocks[i]

			// Set bit flags on adjacent blocks
			if (trans[b] === 1) {
				if (b === 0) flags[i] ^= 128 // This is an air block, so it can't be rendered
				else if (hideInterior[b] === 1) {
					flags[i] ^= (b === (i >> 4 & 15 ? blocks[i - 16] : chunkW[i + 240])) << 0
					| (b === (~i >> 4 & 15 ? blocks[i + 16] : chunkE[i - 240])) << 1
					| (b === blocks[i - 256]) << 2
					| (b === blocks[i + 256]) << 3
					| (b === (i & 15 ? blocks[i - 1] : chunkS[i + 15])) << 4
					| (b === (~i & 15 ? blocks[i + 1] : chunkN[i - 15])) << 5
				}

				flags[i - 256] ^= 8 // Top face of block below is visible
				if (i < flags.length - 256) flags[i + 256] ^= 4 // Bottom face of block above is visible
				if (z)      flags[i - 1] ^= 32 // South face of North block is visible
				if (z < 15) flags[i + 1] ^= 16 // North face of South block is visible
				if (x)      flags[i - 16] ^= 2 // West face of East block is visible
				if (x < 15) flags[i + 16] ^= 1 // East face of West block is visible
			}

			// Some lighting stuff
			const light = lightLevels[255 & b]
			if (light) {
				if (!blockSpread[light]) blockSpread[light] = []
				blockSpread[light].push(this.x + x, i >> 8, this.z + z)
				this.light[i] |= light * 16
			}
		}
	}

	dropLight() {
		// Drop light from the sky without spreading it.
		if (this.lightDropped) return
		const { blocks, hasBlockLight } = this

		if (!hasBlockLight) this.light.fill(15, (this.maxY + 1) * 256)
		else {
			// May introduce a subtle lighting glitch, but it's worth it for the time savings.
			let end = Math.min((this.maxY + 14) * 256, blocks.length)
			this.light.fill(15, end)
			for (let i = this.maxY * 256; i < end; i++) this.light[i] |= 15
		}

		// Set vertical columns of light to level 15
		this.tops.fill(0)
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.maxY; y > 0; y--) {
					const block = blocks[y * 256 + x * 16 + z]

					if (block && !transparent[block]) {
					// if ((visFlags[y*256 + x*16 + z - 256] & 8) === 0) {
						this.tops[x * 16 + z] = y
						break
					}
					this.light[y * 256 + x * 16 + z] |= 15
				}
			}
		}

		this.lightDropped = true
	}
	fillLight() {
		const { world } = this
		this.processBlocks()
		this.dropLight()
		let blockSpread = this.blockSpread
		this.blockSpread = null

		// Drop light in neighboring chunk borders so we won't need to spread into them as much.
		world.getChunk(this.x - 1, this.z).dropLight()
		world.getChunk(this.x + 17, this.z).dropLight()
		world.getChunk(this.x, this.z - 1).dropLight()
		world.getChunk(this.x, this.z + 17).dropLight()

		// Spread the light to places where the vertical columns stopped earlier, plus chunk borders
		let spread = []
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = this.tops[x * 16 + z] + 1; y <= this.maxY; y++) {
					if (   x === 15 || this.tops[x * 16 + z + 1 ] > y
						|| x === 0  || this.tops[x * 16 + z - 1 ] > y
						|| z === 15 || this.tops[x * 16 + z + 16] > y
						|| z === 0  || this.tops[x * 16 + z - 16] > y
					) {
						spread.push(x + this.x, y, z + this.z)
					}
					else break
				}
			}
		}
		this.spreadLight(spread, 14)

		for (let i = blockSpread.length - 1; i > 0; i--) {
			let blocks = blockSpread[i]
			if (blocks && blocks.length) {
				this.spreadLight(blocks, i - 1, false, 1)
			}
		}

		this.lit = true
	}
	setLight(x, y, z, level) {
		const i = y * 256 + x * 16 + z
		this.light[i] = level
		// debugger
	}
	setBlockLight(x, y, z, level) {
		this.hasBlockLight = true
		const i = y * 256 + x * 16 + z
		this.light[i] = level << 4 | this.light[i] & 15
	}
	setSkyLight(x, y, z, level) {
		const i = y * 256 + x * 16 + z
		this.light[i] = level | this.light[i] & 240
	}
	getLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z]
	}
	getBlockLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z] >>> 4
	}
	getSkyLight(x, y, z) {
		return this.light[y * 256 + x * 16 + z] & 15
	}
	trySpread(x, y, z, level, spread, blockLight, update = false) {
		if (y > 255) return
		const { world } = this
		if (world.getLight(x, y, z, blockLight) < level) {
			if (transparent[world.getBlock(x, y, z)]) {
				world.setLight(x, y, z, level, blockLight)
				spread.push(x, y, z)
			}
		}
		if (update && (x < this.x || x > this.x + 15 || z < this.z || z > this.z + 15)) {
			let chunk = world.getChunk(x, z)
			if (chunk.buffer && !world.meshQueue.includes(chunk)) {
				world.meshQueue.push(chunk)
			}
		}
	}
	spreadLight(blocks, level, update = false, blockLight = 0) {
		let spread = []
		for (let i = 0; i < blocks.length; i += 3) {
			let x = blocks[i]
			let y = blocks[i+1]
			let z = blocks[i+2]
			this.trySpread(x - 1, y, z, level, spread, blockLight, update)
			this.trySpread(x + 1, y, z, level, spread, blockLight, update)
			this.trySpread(x, y - 1, z, level, spread, blockLight, update)
			this.trySpread(x, y + 1, z, level, spread, blockLight, update)
			this.trySpread(x, y, z - 1, level, spread, blockLight, update)
			this.trySpread(x, y, z + 1, level, spread, blockLight, update)
		}
		if (level > 1 && spread.length) {
			this.spreadLight(spread, level - 1, update, blockLight)
		}
	}
	tryUnSpread(x, y, z, level, spread, respread, blockLight) {
		if (y > 255) return
		const { world } = this
		let light = world.getLight(x, y, z, blockLight)
		let trans = transparent[world.getBlock(x, y, z)]
		if (light === level) {
			if (trans) {
				world.setLight(x, y, z, 0, blockLight)
				spread.push(x, y, z)
			}
		}
		else if (light > level) {
			respread[light].push(x, y, z)
		}
		if (x < this.x || x > this.x + 15 || z < this.z || z > this.z + 15) {
			let chunk = world.getChunk(x, z)
			if (chunk && chunk.buffer && !world.meshQueue.includes(chunk)) {
				world.meshQueue.push(chunk)
			}
		}
	}
	unSpreadLight(blocks, level, respread, blockLight) {
		let spread = []
		let x = 0, y = 0, z = 0

		for (let i = 0; i < blocks.length; i += 3) {
			x = blocks[i]
			y = blocks[i+1]
			z = blocks[i+2]
			this.tryUnSpread(x - 1, y, z, level, spread, respread, blockLight)
			this.tryUnSpread(x + 1, y, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y - 1, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y + 1, z, level, spread, respread, blockLight)
			this.tryUnSpread(x, y, z - 1, level, spread, respread, blockLight)
			this.tryUnSpread(x, y, z + 1, level, spread, respread, blockLight)
		}
		if (level > 1 && spread.length) {
			this.unSpreadLight(spread, level - 1, respread, blockLight)
		}
	}
	reSpreadLight(respread, blockLight) {
		for (let i = respread.length - 1; i > 1; i--) {
			let blocks = respread[i]
			let level = i - 1
			let spread = respread[level]
			for (let j = 0; j < blocks.length; j += 3) {
				let x = blocks[j]
				let y = blocks[j+1]
				let z = blocks[j+2]
				this.trySpread(x - 1, y, z, level, spread, blockLight)
				this.trySpread(x + 1, y, z, level, spread, blockLight)
				this.trySpread(x, y - 1, z, level, spread, blockLight)
				this.trySpread(x, y + 1, z, level, spread, blockLight)
				this.trySpread(x, y, z - 1, level, spread, blockLight)
				this.trySpread(x, y, z + 1, level, spread, blockLight)
			}
		}
	}
	generate() {
		let trueX = this.x
		let trueZ = this.z

		const { grass, dirt, stone, bedrock } = _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds

		if (this.generated) {
			return
		}

		const smoothness = 0.01 // How close hills and valleys are together
		const hilliness = 80 // Height of the hills
		const extra = 30 // Extra blocks stacked onto the terrain
		const superflat = this.populated
		let gen = 0
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				gen = superflat ? 4 : Math.round(_random_js__WEBPACK_IMPORTED_MODULE_0__.noiseProfile.noise((trueX + i) * smoothness, (trueZ + k) * smoothness) * hilliness) + extra
				this.tops[i * 16 + k] = gen
				if (gen > this.maxY) this.maxY = gen

				let index = i * 16 + k
				this.blocks[index] = bedrock
				index += 256
				for (let max = (gen - 3) * 256; index < max; index += 256) {
					this.blocks[index] = stone
				}
				this.blocks[index] = dirt
				this.blocks[index + 256] = dirt
				this.blocks[index + 512] = dirt
				this.blocks[index + 768] = grass
			}
		}
		this.generated = true
		this.getCaveData() // Queue up the multithreaded cave gen
	}
	optimize() {
		const { blocks, renderData, world, x, z, maxY } = this
		const trans = transparent
		const flags = this.visFlags // Computed in this.processBlocks()
		this.visFlags = null

		// Load adjacent chunks blocks
		const chunkN = world.getChunk(x, z + 17).blocks
		const chunkS = world.getChunk(x, z - 1).blocks
		const chunkE = world.getChunk(x + 17, z).blocks
		const chunkW = world.getChunk(x - 1, z).blocks
		// let max = (maxY - 1) * 256
		// for (let i = 256; i <= max; i += 16) if (trans[chunkN[i]]) flags[i + 15] |= 32
		for (let y = 1; y <= maxY; y++) {
			let indexN = y * 256
			let indexS = indexN + 15
			let indexE = indexN
			let indexW = indexN + 240
			for (let i = 0; i < 16; i++) {
				if (trans[chunkN[indexN]]) flags[indexN + 15] ^= 32
				if (trans[chunkS[indexS]]) flags[indexS - 15] ^= 16
				if (trans[chunkE[indexE]]) flags[indexE + 240] ^= 2
				if (trans[chunkW[indexW]]) flags[indexW - 240] ^= 1
				indexN += 16
				indexS += 16
				indexE++
				indexW++
			}
		}

		//Check all the blocks in the chunk to see if they're visible.
		for (let index = 256; index < flags.length; index++) {
			if (flags[index] > 0) {
				renderData[this.renderLength++] = index << 16 | flags[index] << 10
			}
		}
		this.minY = renderData[0] >>> 24

		// The bottom layer of bedrock is only ever visible on top
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				if (transparent[blocks[256 + i*16 + k]]) {
					this.minY = 0
					renderData.push(i*16 + k << 16 | 1 << 13)
				}
			}
		}
		this.renderLength = renderData.length

		if (!world.meshQueue.includes(this)) {
			world.meshQueue.push(this)
		}
		this.optimized = true
	}
	render(p, global) {
		const { glExtensions, gl } = this
		if (this.buffer === undefined) {
			return
		}
		if (p.canSee(this.x, this.minY, this.z, this.maxY)) {
			global.renderedChunks++
			glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
			gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
			glExtensions.vertex_array_object.bindVertexArrayOES(null)
		}
	}
	updateBlock(x, y, z, world) {
		if (!this.buffer) return
		if (!world.meshQueue.includes(this)) {
			world.meshQueue.push(this)
		}
		let i = x
		let j = y
		let k = z
		x += this.x
		z += this.z
		let index = j * 256 + i * 16 + k
		let blockState = this.blocks[index]

		let w = i      ? this.blocks[index - 16] : world.getBlock(x - 1, j, z)
		let e = i < 15 ? this.blocks[index + 16] : world.getBlock(x + 1, j, z)
		let d = y      ? this.blocks[index - 256]: 4
		let u =          this.blocks[index + 256]
		let s = k      ? this.blocks[index - 1] : world.getBlock(x, j, z - 1)
		let n = k < 15 ? this.blocks[index + 1] : world.getBlock(x, j, z + 1)

		let visible = blockState && transparent[w]
		+ transparent[e] * 2
		+ transparent[d] * 4
		+ transparent[u] * 8
		+ transparent[s] * 16
		+ transparent[n] * 32

		if (blockState < 256 && hideInterior[blockState]) {
			visible ^= w === blockState
			| (e === blockState) << 1
			| (d === blockState) << 2
			| (u === blockState) << 3
			| (s === blockState) << 4
			| (n === blockState) << 5
		}

		let pos = index << 16
		index = -1

		// Find index of current block in this.renderData
		for (let i = 0; i < this.renderLength; i++) {
			if ((this.renderData[i] & 0xffff0000) === pos) {
				index = i
				break
			}
		}

		// Update palette
		// if (!this.paletteMap[blockState]) {
		// 	this.paletteMap[blockState] = this.palette.length
		// 	this.palette.push(blockState)
		// }

		if (index < 0 && !visible) {
			// Wasn't visible before, isn't visible after.
			return
		}
		if (!visible) {
			// Was visible before, isn't visible after.
			this.renderData.splice(index, 1)
			this.renderLength--
			return
		}
		if (visible && index < 0) {
			if (y <= this.minY) this.minY = y - 1
			if (y > this.maxY) this.maxY = y
			// Wasn't visible before, is visible after.
			index = this.renderLength++
		}
		this.renderData[index] = pos | visible << 10// | this.paletteMap[blockState]
	}
	deleteBlock(x, y, z, user) {
		if (user && !this.edited) {
			this.edited = true
			this.originalBlocks = this.blocks.slice() // save originally generated chunk
		}
		this.blocks[y * 256 + x * 16 + z] = 0
		this.minY = y < this.minY ? y : this.minY
	}
	getCaveData() {
		if (this.caves || this.caveData) return
		this.caveData = new Promise(resolve => {
			window.doWork({
				caves: true,
				x: this.x,
				y: 0,
				z: this.z
			}, resolve)
		})
	}
	async carveCaves() {
		const { world } = this
		this.caves = true

		const { carve, air } = await this.caveData

		// Find the lowest point we need to check.
		let lowest = 255
		for (let i = 0; i < 256; i++) {
			let n = this.tops[i]
			lowest = lowest < n ? lowest : n
		}
		lowest = (lowest - 1) * 256

		// Set air blocks
		for (let i = 0; i < air.length; i++) {
			let index = air[i]
			// if (index === 20030) debugger
			if (index < lowest || index >> 8 <= this.tops[index & 255]) {
				this.blocks[index] = 0
			}
		}

		// // Carve spheres
		for (let i = 0; i < carve.length; i++) {
			let index = carve[i]
			// if (index === 20030) debugger
			if (index < lowest || index >> 8 <= this.tops[index & 255]) {
				let x = index >> 4 & 15
				let y = index >> 8
				let z = index & 15
				carveSphere(x + this.x, y, z + this.z, world)
			}
		}

		// let sx = this.x, sy = 0, sz = this.z
		// let cy = 0
		// for (let xz = 0; xz < 256; xz++) {
		// 	cy = this.tops[xz]
		// 	cy = cy > 82 ? 82 : cy
		// 	for (let y = 2; y <= cy; y++) {
		// 		let i = y * 256 + xz
		// 		let c = caves[i]
		// 		if (c === 1) {
		// 			carveSphere(sx + (xz >> 4), sy + y, sz + (xz & 15), world)
		// 		}
		// 		else if (c === 2) {
		// 			this.blocks[i] = 0
		// 		}
		// 	}
		// }
		this.caveData = null
	}
	populate(trees) {
		if (this.populated) return
		const { world } = this
		;(0,_random_js__WEBPACK_IMPORTED_MODULE_0__.randomSeed)((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.hash)(this.x, this.z) * 210000000)
		let wx = 0, wz = 0, ground = 0, top = 0, rand = 0, place = false

		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				wx = this.x + i
				wz = this.z + k

				ground = this.tops[i * 16 + k]
				let topBlock = this.getBlock(i, ground, k)
				if (trees && (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 0.005 && topBlock === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.grass) {

					top = ground + floor(4.5 + (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)(2.5))
					rand = floor((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)(4096))
					let tree = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 0.6 ? _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.oakLog : ++top && _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.birchLog

					//Center
					for (let j = ground + 1; j <= top; j++) {
						this.setBlock(i, j, k, tree)
					}
					this.setBlock(i, top + 1, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
					this.setBlock(i, ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.dirt)

					//Bottom leaves
					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) { // Not center
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top - 2, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top - 2, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
								}
							}
						}
					}

					//2nd layer leaves
					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) {
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top - 1, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top - 1, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
								}
							}
						}
					}

					//3rd layer leaves
					for (let x = -1; x <= 1; x++) {
						for (let z = -1; z <= 1; z++) {
							if (x || z) {
								if (x & z) {
									place = rand & 1
									rand >>>= 1
									if (place) {
										world.spawnBlock(wx + x, top, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
									}
								}
								else {
									world.spawnBlock(wx + x, top, wz + z, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
								}
							}
						}
					}

					//Top leaves
					world.spawnBlock(wx + 1, top + 1, wz, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz - 1, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz + 1, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
					world.spawnBlock(wx - 1, top + 1, wz, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.leaves)
				}

				// Blocks of each per chunk in Minecraft
				// Coal: 185.5
				// Iron: 111.5
				// Gold: 10.4
				// Redstone: 29.1
				// Diamond: 3.7
				// Lapis: 4.1
				ground -= 4
				while (this.getBlock(i, ground, k) !== _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) ground--

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 3.7 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.diamondOre)
					}
				}

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 111.5 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * 64 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.ironOre)
					}
				}

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 185.5 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * ground | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.coalOre)
					}
				}

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 10.4 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.goldOre)
					}
				}

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 29.1 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.redstoneOre)
					}
				}

				if ((0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() < 4.1 / 256) {
					let y = (0,_random_js__WEBPACK_IMPORTED_MODULE_0__.random)() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k) === _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.stone) {
						this.setBlock(i, y < ground ? y : ground, k, _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockIds.lapisOre)
					}
				}
			}
		}

		this.populated = true
	}
	getSurroundingBlocks(loc, sides, blocks27, lights27) {
		// Used in this.genMesh()
		// Note that, while this *does* do more work than simply loading the blocks/lights as they're needed,
		// the improved cache efficiency nearly doubled the overall speed of genMesh (on Chrome).
		const chunkX = loc >> 4 & 15
		const chunkY = loc >> 8
		const chunkZ = loc & 15

		const worldX = chunkX + this.x
		const worldY = chunkY
		const worldZ = chunkZ + this.z

		// Preload any blocks that will be used for the shadows/lighting.
		if (chunkX && chunkZ && chunkX < 15 && chunkZ < 15) {
			const index = loc
			let topLight = this.light[index + 256]
			lights27[22] = topLight
			if (topLight !== 15 || sides !== 8) {
				// Bottom layer
				lights27[0] = this.light[index - 273]
				lights27[1] = this.light[index - 272]
				lights27[2] = this.light[index - 271]
				lights27[3] = this.light[index - 257]
				lights27[4] = this.light[index - 256]
				lights27[5] = this.light[index - 255]
				lights27[6] = this.light[index - 241]
				lights27[7] = this.light[index - 240]
				lights27[8] = this.light[index - 239]

				// Middle layer
				lights27[9] = this.light[index - 17]
				lights27[10] = this.light[index - 16]
				lights27[11] = this.light[index - 15]
				lights27[12] = this.light[index - 1]
				lights27[14] = this.light[index + 1]
				lights27[15] = this.light[index + 15]
				lights27[16] = this.light[index + 16]
				lights27[17] = this.light[index + 17]

				// Top layer
				lights27[18] = this.light[index + 239]
				lights27[19] = this.light[index + 240]
				lights27[20] = this.light[index + 241]
				lights27[21] = this.light[index + 255]
				lights27[23] = this.light[index + 257]
				lights27[24] = this.light[index + 271]
				lights27[25] = this.light[index + 272]
				lights27[26] = this.light[index + 273]
			}
			if (sides !== 8) {
				// Bottom layer
				blocks27[0] = shadow[255 & this.blocks[index - 273]]
				blocks27[1] = shadow[255 & this.blocks[index - 272]]
				blocks27[2] = shadow[255 & this.blocks[index - 271]]
				blocks27[3] = shadow[255 & this.blocks[index - 257]]
				blocks27[4] = shadow[255 & this.blocks[index - 256]]
				blocks27[5] = shadow[255 & this.blocks[index - 255]]
				blocks27[6] = shadow[255 & this.blocks[index - 241]]
				blocks27[7] = shadow[255 & this.blocks[index - 240]]
				blocks27[8] = shadow[255 & this.blocks[index - 239]]

				// Middle layer
				blocks27[9] = shadow[255 & this.blocks[index - 17]]
				blocks27[10] = shadow[255 & this.blocks[index - 16]]
				blocks27[11] = shadow[255 & this.blocks[index - 15]]
				blocks27[12] = shadow[255 & this.blocks[index - 1]]
				blocks27[14] = shadow[255 & this.blocks[index + 1]]
				blocks27[15] = shadow[255 & this.blocks[index + 15]]
				blocks27[16] = shadow[255 & this.blocks[index + 16]]
				blocks27[17] = shadow[255 & this.blocks[index + 17]]
			}

			// Top layer
			blocks27[18] = shadow[255 & this.blocks[index + 239]]
			blocks27[19] = shadow[255 & this.blocks[index + 240]]
			blocks27[20] = shadow[255 & this.blocks[index + 241]]
			blocks27[21] = shadow[255 & this.blocks[index + 255]]
			blocks27[22] = shadow[255 & this.blocks[index + 256]]
			blocks27[23] = shadow[255 & this.blocks[index + 257]]
			blocks27[24] = shadow[255 & this.blocks[index + 271]]
			blocks27[25] = shadow[255 & this.blocks[index + 272]]
			blocks27[26] = shadow[255 & this.blocks[index + 273]]
		}
		else {
			// Lights
			let topLight = this.light[loc + 256]
			lights27[22] = topLight
			if (topLight !== 15 || sides !== 8) {
				// Lights in this chunk
				for (let x = -1, i = 0; x <= 1; x++) {
					for (let z = -1; z <= 1; z++, i++) {
						if (chunkX + x >= 0 && chunkZ + z >= 0 && chunkX + x < 16 && chunkZ + z < 16) {
							const index = loc + x * 16 + z
							lights27[i] = this.light[index - 256]
							lights27[i+9] = this.light[index]
							lights27[i+18] = this.light[index + 256]
						}
					}
				}

				// Lights in the other chunks
				for (let x = -1, i = 0; x <= 1; x++) {
					for (let z = -1; z <= 1; z++, i++) {
						if (chunkX + x < 0 || chunkZ + z < 0 || chunkX + x > 15 || chunkZ + z > 15) {
							let chunk = this.world.getChunk(worldX + x, worldZ + z)
							let index = worldY * 256 + (worldX + x & 15) * 16 + (worldZ + z & 15)
							lights27[i] = chunk.light[index - 256]
							lights27[i+9] = chunk.light[index]
							lights27[i+18] = chunk.light[index + 256]
						}
					}
				}
			}

			// Blocks in this chunk
			for (let x = -1, i = 0; x <= 1; x++) {
				for (let z = -1; z <= 1; z++, i++) {
					if (chunkX + x >= 0 && chunkZ + z >= 0 && chunkX + x < 16 && chunkZ + z < 16) {
						const index = loc + x * 16 + z
						blocks27[i] = shadow[255 & this.blocks[index - 256]]
						blocks27[i+9] = shadow[255 & this.blocks[index]]
						blocks27[i+18] = shadow[255 & this.blocks[index + 256]]
					}
				}
			}

			// Blocks in the other chunks
			for (let x = -1, i = 0; x <= 1; x++) {
				for (let z = -1; z <= 1; z++, i++) {
					if (chunkX + x < 0 || chunkZ + z < 0 || chunkX + x > 15 || chunkZ + z > 15) {
						const chunk = this.world.getChunk(worldX + x, worldZ + z)
						const index = worldY * 256 + (worldX + x & 15) * 16 + (worldZ + z & 15)
						blocks27[i] = shadow[255 & chunk.blocks[index - 256]]
						blocks27[i+9] = shadow[255 & chunk.blocks[index]]
						blocks27[i+18] = shadow[255 & chunk.blocks[index + 256]]
					}
				}
			}
		}
	}
	genMesh(indexBuffer, bigArray) {
		const { glExtensions, gl, glCache, renderLength, renderData } = this
		let index = 0
		if (!this.renderLength) {
			return index
		}
		let verts = null, texVerts = null, texShapeVerts = null,
			tx = 0, ty = 0

		let shadows = [1, 1, 1, 1], slights = [1, 1, 1, 1], blights = [1, 1, 1, 1]
		let blockMasks = Object.values(_blockData_js__WEBPACK_IMPORTED_MODULE_1__.Block)
		const blocks27 = new Uint8Array(27)
		const lights27 = new Uint8Array(27)

		for (let i = 0; i < renderLength; i++) {
			const data = renderData[i]
			const sides = data >> 10 & 0x3f // 6 bit flags indicating which faces should be rendered
			const loc = data >>> 16 // #yyyyxxzz
			const block = _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData[this.blocks[loc]]
			const tex = block.textures
			const chunkX = loc >> 4 & 15
			const chunkY = loc >> 8
			const chunkZ = loc & 15

			const worldX = chunkX + this.x
			const worldY = chunkY
			const worldZ = chunkZ + this.z

			// Preload any blocks that will be used for the shadows/lighting.
			this.getSurroundingBlocks(loc, sides, blocks27, lights27)

			const shapeVerts = block.shape.verts
			const shapeTexVerts = block.shape.texVerts

			let texNum = 0
			for (let n = 0; n < 6; n++) {
				if (sides & blockMasks[n]) {
					shadows = getShadows[n](blocks27)
					slights = getLight[n](lights27, slights, 0x0f, 0)
					blights = getLight[n](lights27, blights, 0xf0, 4)

					let directionalFaces = shapeVerts[n]

					// Add vertices for a single rectangle.
					for (let facei = 0; facei < directionalFaces.length; facei++) {
						verts = directionalFaces[facei]
						texVerts = _texture_js__WEBPACK_IMPORTED_MODULE_2__.textureCoords[_texture_js__WEBPACK_IMPORTED_MODULE_2__.textureMap[tex[texNum]]]
						tx = texVerts[0]
						ty = texVerts[1]
						texShapeVerts = shapeTexVerts[n][facei]

						bigArray[index] = verts[0] + worldX
						bigArray[index+1] = verts[1] + worldY
						bigArray[index+2] = verts[2] + worldZ
						bigArray[index+3] = tx + texShapeVerts[0]
						bigArray[index+4] = ty + texShapeVerts[1]
						bigArray[index+5] = shadows[0]
						bigArray[index+6] = slights[0]
						bigArray[index+7] = blights[0]

						bigArray[index+8] = verts[3] + worldX
						bigArray[index+9] = verts[4] + worldY
						bigArray[index+10] = verts[5] + worldZ
						bigArray[index+11] = tx + texShapeVerts[2]
						bigArray[index+12] = ty + texShapeVerts[3]
						bigArray[index+13] = shadows[1]
						bigArray[index+14] = slights[1]
						bigArray[index+15] = blights[1]

						bigArray[index+16] = verts[6] + worldX
						bigArray[index+17] = verts[7] + worldY
						bigArray[index+18] = verts[8] + worldZ
						bigArray[index+19] = tx + texShapeVerts[4]
						bigArray[index+20] = ty + texShapeVerts[5]
						bigArray[index+21] = shadows[2]
						bigArray[index+22] = slights[2]
						bigArray[index+23] = blights[2]

						bigArray[index+24] = verts[9] + worldX
						bigArray[index+25] = verts[10] + worldY
						bigArray[index+26] = verts[11] + worldZ
						bigArray[index+27] = tx + texShapeVerts[6]
						bigArray[index+28] = ty + texShapeVerts[7]
						bigArray[index+29] = shadows[3]
						bigArray[index+30] = slights[3]
						bigArray[index+31] = blights[3]
						index += 32
					}
				}
				texNum++
			}
		}

		if (!this.buffer) {
			this.buffer = gl.createBuffer()
		}
		let data = new Float32Array(bigArray.buffer, 0, index)

		// let maxY = 0
		// let minY = 255
		// for (let i = 1; i < data.length; i += 6) {
		// 	const y = data[i]
		// 	maxY = y > maxY ? y : maxY
		// 	minY = y < minY ? y : minY
		// }
		// this.maxY = maxY
		// this.minY = minY

		this.faces = data.length / 32
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
		gl.enableVertexAttribArray(glCache.aVertex)
		gl.enableVertexAttribArray(glCache.aTexture)
		gl.enableVertexAttribArray(glCache.aShadow)
		gl.enableVertexAttribArray(glCache.aSkylight)
		gl.enableVertexAttribArray(glCache.aBlocklight)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 32, 0)
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 32, 12)
		gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 32, 20)
		gl.vertexAttribPointer(glCache.aSkylight, 1, gl.FLOAT, false, 32, 24)
		gl.vertexAttribPointer(glCache.aBlocklight, 1, gl.FLOAT, false, 32, 28)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
	}
	tick() {
		if (this.edited) {
			// tick()
		}
	}
	load() {
		if (this.loaded) {
			return
		}
		const { world } = this
		let chunkX = this.x >> 4
		let chunkZ = this.z >> 4
		let str = `${chunkX},${chunkZ}`
		let load = world.loadFrom[str]
		if (load) {
			this.edited = true
			this.originalBlocks = this.blocks.slice()
			let last = 0
			for (let j in load) {
				last = +j
				let block = load[last]
				this.blocks[last] = block
				if (!this.doubleRender && _blockData_js__WEBPACK_IMPORTED_MODULE_1__.blockData[block].semiTrans) {
					this.doubleRender = true
					if (!this.world.doubleRenderChunks.includes(this)) {
						this.world.doubleRenderChunks.push(this)
					}
				}
			}
			if (last >> 8 > this.maxY) this.maxY = last >> 8

			delete world.loadFrom[str]
		}
		this.loaded = true
	}
}



/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _blockData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _shapes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _texture_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _entity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27);
/* harmony import */ var _3Dutils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15);






class Player extends _entity_js__WEBPACK_IMPORTED_MODULE_3__.Entity {
	constructor(x, y, z, vx, vy, vz, blockID, glExtensions, gl, glCache, indexBuffer, world, p) {
		const block = _blockData_js__WEBPACK_IMPORTED_MODULE_0__.blockData[blockID & 255]
		const tex = block.textures
		const shape = _shapes_js__WEBPACK_IMPORTED_MODULE_1__.shapes.cube
		const shapeVerts = shape.verts
		const shapeTexVerts = shape.texVerts
		const size = shape.size
		let texNum = 0
		let texture = []
		let index = 0
		for (let n = 0; n < 6; n++) {
			let directionalFaces = shapeVerts[n]
			for (let facei = 0; facei < directionalFaces.length; facei++) {
				let texVerts = _texture_js__WEBPACK_IMPORTED_MODULE_2__.textureCoords[_texture_js__WEBPACK_IMPORTED_MODULE_2__.textureMap[tex[texNum]]]
				let tx = texVerts[0]
				let ty = texVerts[1]
				let texShapeVerts = shapeTexVerts[n][facei]
				texture[index    ] = tx + texShapeVerts[0]
				texture[index + 1] = ty + texShapeVerts[1]
				texture[index + 2] = tx + texShapeVerts[2]
				texture[index + 3] = ty + texShapeVerts[3]
				texture[index + 4] = tx + texShapeVerts[4]
				texture[index + 5] = ty + texShapeVerts[5]
				texture[index + 6] = tx + texShapeVerts[6]
				texture[index + 7] = ty + texShapeVerts[7]
				index += 8
			}
			texNum++
		}
		super(x, y, z, 0, 0, vx || 0, vy || 0, vz || 0, 0.6, 1.7, 0.6, new Float32Array(shapeVerts.flat(Infinity)), new Float32Array(texture), size, Infinity, glExtensions, gl, glCache, indexBuffer, world, p)
		if (p) this.camera = null
	}
	render() {
		const { gl, glCache, glExtensions, p } = this
		const modelMatrix = new _3Dutils_js__WEBPACK_IMPORTED_MODULE_4__.Matrix()
		modelMatrix.identity()
		modelMatrix.translate(this.x, this.y, this.z)
		modelMatrix.rotX(this.pitch)
		modelMatrix.rotY(this.yaw)
		modelMatrix.scale(this.width, this.height, this.depth)
		const viewMatrix = p.transformation.elements
		const proj = p.projection
		const projectionMatrix = [proj[0], 0, 0, 0, 0, proj[1], 0, 0, 0, 0, proj[2], proj[3], 0, 0, proj[4], 0]
		const modelViewProjectionMatrix = new _3Dutils_js__WEBPACK_IMPORTED_MODULE_4__.Matrix()
		modelViewProjectionMatrix.identity()
		modelViewProjectionMatrix.mult(projectionMatrix)
		modelViewProjectionMatrix.mult(viewMatrix)
		modelViewProjectionMatrix.mult(modelMatrix.elements)
		// row major to column major
		modelViewProjectionMatrix.transpose()

		const lightLevel = 1 // min(max(skyLight, blockLight) * 0.9 + 0.1, 1.0)
		gl.uniform1i(glCache.uSamplerEntity, 0)
		// gl.bindTexture(gl.TEXTURE_2D, textureAtlas)
		gl.uniform1f(glCache.uLightLevelEntity, lightLevel)
		gl.uniformMatrix4fv(glCache.uViewEntity, false, modelViewProjectionMatrix.elements)
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
	}
}



/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Entity": () => (/* binding */ Entity)
/* harmony export */ });
/* harmony import */ var _blockData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var _3Dutils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _texture_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);





const { round, floor, ceil, cos, min, max } = Math

class Contacts {
	constructor() {
		this.array = []
		this.size = 0
	}
	add(x, y, z, block) {
		if (this.size === this.array.length) {
			this.array.push([x, y, z, block])
		}
		else {
			this.array[this.size][0] = x
			this.array[this.size][1] = y
			this.array[this.size][2] = z
			this.array[this.size][3] = block
		}
		this.size++
	}
	clear() {
		this.size = 0
	}
}

class Entity {
	constructor(x, y, z, pitch, yaw, velx, vely, velz, width, height, depth, vertices, texture, faces, despawns, glExtensions, gl, glCache, indexBuffer, world, p) {
		this.x = x
		this.y = y
		this.z = z
		this.previousX = x
		this.previousY = y
		this.previousZ = z
		this.canStepX = true
		this.canStepY = true
		this.pitch = pitch
		this.yaw = yaw
		this.velx = velx
		this.vely = vely
		this.velz = velz
		this.width = width
		this.height = height
		this.depth = depth
		this.contacts = new Contacts()
		this.lastUpdate = performance.now()
		this.onGround = false
		this.despawns = despawns
		this.spawn = this.lastUpdate
		this.canDespawn = false
		this.faces = faces
		this.vao = glExtensions.vertex_array_object.createVertexArrayOES()
		const verticesBuffer = gl.createBuffer()
		const textureBuffer = gl.createBuffer()
		glExtensions.vertex_array_object.bindVertexArrayOES(this.vao)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
		gl.vertexAttribPointer(glCache.aVertexEntity, 3, gl.FLOAT, false, 0, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, texture, gl.STATIC_DRAW)
		gl.vertexAttribPointer(glCache.aTextureEntity, 2, gl.FLOAT, false, 0, 0)

		gl.enableVertexAttribArray(glCache.aVertexEntity)
		gl.enableVertexAttribArray(glCache.aTextureEntity)
		glExtensions.vertex_array_object.bindVertexArrayOES(null)
		this.glExtensions = glExtensions
		this.gl = gl
		this.glCache = glCache
		this.indexBuffer = indexBuffer
		this.world = world
		this.p = p
	}
	updateVelocity(now) {
		let dt = (now - this.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt
		// this.vely += -0.02 * dt
		if (this.vely < -1.5) {
			this.vely = -1.5
		}

		this.velz += (this.velz * 0.9 - this.velz) * dt
		this.velx += (this.velx * 0.9 - this.velx) * dt
		// this.vely += (this.vely * 0.9 - this.vely) * dt
	}
	collided(x, y, z, vx, vy, vz, block) {
		let verts = _blockData_js__WEBPACK_IMPORTED_MODULE_0__.blockData[block].shape.verts
		let px = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.x - this.width / 2 - x)
		let py = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.y - this.height / 2 - y)
		let pz = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.z - this.depth / 2 - z)
		let pxx = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.x + this.width / 2 - x)
		let pyy = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.y + this.height / 2 - y)
		let pzz = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.roundBits)(this.z + this.depth / 2 - z)
		let minX, minY, minZ, maxX, maxY, maxZ, min, max

		//Top and bottom faces
		let faces = verts[0]
		if (vy <= 0) {
			faces = verts[1]
		}
		if (!vx && !vz) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				if (face[1] > py && face[1] < pyy && minX < pxx && maxX > px && minZ < pzz && maxZ > pz) {
					if (vy <= 0) {
						this.onGround = true
						this.y = round((face[1] + y + this.height / 2) * 10000) / 10000
						this.vely = 0
						return false
					}
					else {
						return true
					}
				}
			}
			return false
		}

		//West and East faces
		if (vx < 0) {
			faces = verts[4]
		}
		else if (vx > 0) {
			faces = verts[5]
		}
		if (vx) {
			let col = false
			for (let face of faces) {
				min = face.min
				minZ = min[2]
				minY = min[1]
				max = face.max
				maxZ = max[2]
				maxY = max[1]
				if (face[0] > px && face[0] < pxx && minY < pyy && maxY > py && minZ < pzz && maxZ > pz) {
					if (maxY - py > 0.5) {
						this.canStepX = false
					}
					col = true
				}
			}
			return col
		}

		//South and North faces
		if (vz < 0) {
			faces = verts[2]
		}
		else if (vz > 0) {
			faces = verts[3]
		}
		if (vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				if (face[2] > pz && face[2] < pzz && minY < pyy && maxY > py && minX < pxx && maxX > px) {
					if (maxY - py > 0.5) {
						this.canStepZ = false
					}
					col = true
				}
			}
			return col
		}
	}
	move(now) {
		let dx = this.p.x - this.x
		let dy = this.p.y - this.y
		let dz = this.p.z - this.z
		const dist = this.world.settings.renderDistance * 16 - 32
		if (dx * dx + dy * dy + dz * dz >= dist * dist) return

		const { world } = this
		let pminX = floor(this.x - this.width / 2)
		let pmaxX = ceil(this.x + this.width / 2)
		let pminY = floor(this.y - this.height / 2)
		let pmaxY = ceil(this.y + this.height / 2)
		let pminZ = floor(this.z - this.depth / 2)
		let pmaxZ = ceil(this.z + this.depth / 2)
		let block = null

		for (let x = pminX; x <= pmaxX; x++) {
			for (let y = pminY; y <= pmaxY; y++) {
				for (let z = pminZ; z <= pmaxZ; z++) {
					let block = world.getBlock(x, y, z)
					if (block) {
						this.contacts.add(x, y, z, block)
					}
				}
			}
		}
		let dt = (now - this.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt

		this.previousX = this.x
		this.previousY = this.y
		this.previousZ = this.z

		this.canStepX = false
		this.canStepY = false
		this.onGround = false
		//Check collisions in the Y direction
		this.y += this.vely * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], 0, this.vely, 0, block[3])) {
				this.y = this.previousY
				this.vely = 0
				break
			}
		}

		if (this.y === this.previousY) {
			this.canStepX = true
			this.canStepZ = true
		}

		//Check collisions in the X direction
		this.x += this.velx * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], this.velx, 0, 0, block[3])) {
				if (this.canStepX && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				this.x = this.previousX
				this.velx = 0
				break
			}
		}

		//Check collisions in the Z direction
		this.z += this.velz * dt
		for (let i = 0; i < this.contacts.size; i++) {
			block = this.contacts.array[i]
			if (this.collided(block[0], block[1], block[2], 0, 0, this.velz, block[3])) {
				if (this.canStepZ && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				this.z = this.previousZ
				this.velz = 0
				break
			}
		}

		this.lastUpdate = now
		this.contacts.clear()
	}
	update() {
		let now = performance.now()
		this.updateVelocity(now)
		this.move(now)
		if (now - this.spawn > this.despawns) {
			this.canDespawn = true
		}
	}
}



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shaders_blockVert_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _shaders_blockFrag_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _shaders_blockVertFogless_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _shaders_blockFragFogless_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _shaders_2dVert_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _shaders_2dFrag_glsl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
/* harmony import */ var _shaders_entityVert_glsl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7);
/* harmony import */ var _shaders_entityFrag_glsl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8);
/* harmony import */ var _workers_Caves_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(10);
/* harmony import */ var _js_random_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(14);
/* harmony import */ var _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(15);
/* harmony import */ var _js_utils_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(16);
/* harmony import */ var _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(17);
/* harmony import */ var _js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(18);
/* harmony import */ var _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(19);
/* harmony import */ var _js_glUtils_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(20);
/* harmony import */ var _js_texture_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(21);
/* harmony import */ var _js_sky__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(22);
/* harmony import */ var _js_chunk_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(25);
/* harmony import */ var _js_player_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(26);


// GLSL Shader code
;








// Import Worker code


// import css


// imports










// import { Item } from './js/item.js'


window.blockData = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData
window.canvas = document.getElementById("overlay")
window.ctx = window.canvas.getContext("2d")
window.ctx.suppressWarnings = true
window.savebox = document.getElementById("savebox")
window.boxCenterTop = document.getElementById("boxcentertop")
window.saveDirections = document.getElementById("savedirections")
window.message = document.getElementById("message")
window.worlds = document.getElementById("worlds") // I have too many "worlds" variables. This one uses "window" as its namespace.
window.quota = document.getElementById("quota")
window.hoverbox = document.getElementById("onhover")
window.canvas.width  = window.innerWidth
window.canvas.height = window.innerHeight
window.controlMap = {}
window.sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function MineKhan() {
	// Cache user-defined globals
	const { canvas, savebox, boxCenterTop, saveDirections, message, quota, hoverbox, loadString, controlMap, sleep } = window
	/**
	 * @type {CanvasRenderingContext2D}
	 */
	const ctx = window.ctx

	// cache global objects locally.
	const { Math, performance, Date, document, console } = window
	const { cos, sin, round, floor, ceil, min, max, abs, sqrt } = Math
	const win = window.parent
	const chatOutput = document.getElementById("chat")
	const chatInput = document.getElementById("chatbar")
	let now = Date.now()

	// Shh don't tell anyone I'm overriding native objects
	String.prototype.hashCode = function() {
		var hash = 0, i, chr
		if (this.length === 0) return hash
		for (i = 0; i < this.length; i++) {
			chr   = this.charCodeAt(i)
			hash  = (hash << 5) - hash + chr
			hash |= 0 // Convert to 32bit integer
		}
		return hash
	}
	Uint8Array.prototype.toString = function() {
		let str = ""
		for (let i = 0; i < this.length; i++) {
			str += String.fromCharCode(this[i])
		}
		return btoa(str)
	}

	{
		// I'm throwing stuff in the window scope since I can't be bothered to figure out how all this fancy import export stuff works
		const workerURL = window.URL.createObjectURL(new Blob([_workers_Caves_js__WEBPACK_IMPORTED_MODULE_8__["default"]], { type: "text/javascript" }))
		window.workers = []
		const jobQueue = []
		const workerCount = (navigator.hardwareConcurrency || 4) - 1 || 1
		for (let i = 0; i < workerCount; i++) { // Generate between 1 and (processors - 1) workers.
			let worker = new Worker(workerURL, { name: `Cave Worker ${i + 1}` })
			worker.onmessage = e => {
				if (worker.resolve) worker.resolve(e.data)
				worker.resolve = null
				if (jobQueue.length) {
					let [data, resolve] = jobQueue.shift()
					worker.resolve = resolve
					worker.postMessage(data)
				}
				else window.workers.push(worker)
			}
			window.workers.push(worker)
		}

		window.doWork = (data, resolve) => {
			if (window.workers.length) {
				let worker = window.workers.pop()
				worker.resolve = resolve
				worker.postMessage(data)
			}
			else jobQueue.push([data, resolve])
		}

		// await window.yieldThread() will pause the current task until the event loop is cleared
		const channel = new MessageChannel()
		let res
		channel.port1.onmessage = () => res()
		window.yieldThread = () => {
			return new Promise(resolve => {
				res = resolve
				channel.port2.postMessage("")
			})
		}
	}

	let world, worldSeed

	function setSeed(seed) {
		worldSeed = seed
		;(0,_js_random_js__WEBPACK_IMPORTED_MODULE_10__.seedHash)(seed)
		_js_random_js__WEBPACK_IMPORTED_MODULE_10__.noiseProfile.noiseSeed(seed)
		while(window.workers.length) {
			window.doWork({ seed })
		}
	}

	let fill = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
	}
	let stroke = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
	}
	// function line(x1, y1, x2, y2) {
	// 	ctx.moveTo(x1, y1)
	// 	ctx.lineTo(x2, y2)
	// }
	function text(txt, x, y, h) {
		h = h || 0

		let lines = txt.split("\n")
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + h * i)
		}
	}
	function textSize(size) {
		ctx.font = size + 'px Monospace' // VT323
	}
	let strokeWeight = function(num) {
		ctx.lineWidth = num
	}
	// const ARROW = "arrow"
	const HAND = "pointer"
	// const CROSS = "crosshair"
	let cursor = function(type) {
		canvas.style.cursor = type
	}
	;(0,_js_random_js__WEBPACK_IMPORTED_MODULE_10__.randomSeed)(Math.random() * 10000000 | 0)

	async function save() {
		let saveObj = {
			id: world.id,
			edited: now,
			name: world.name,
			version: version,
			code: world.getSaveString()
		}
		await (0,_js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.saveToDB)(world.id, saveObj).catch(e => console.error(e))
		world.edited = now
		if (location.href.startsWith("https://willard.fun/")) {
			console.log('Saving to server')
			await fetch(`https://willard.fun/minekhan/saves?id=${world.id}&edited=${saveObj.edited}&name=${encodeURIComponent(world.name)}&version=${encodeURIComponent(version)}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream"
				},
				body: saveObj.code.buffer
			})
		}
	}

	// Expose these functions to the global scope for debugging
	win.saveToDB = _js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.saveToDB
	win.loadFromDB = _js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.loadFromDB
	win.createDatabase = _js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.createDatabase
	win.deleteFromDB = _js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.deleteFromDB

	// Globals
	//{
	let version = "Alpha 0.8.0"
	let superflat = false
	let trees = true
	let caves = true

	win.blockData = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData
	win.blockIds = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockIds

	// Configurable and savable settings
	let settings = {
		renderDistance: 4,
		fov: 70, // Field of view in degrees
		mouseSense: 100, // Mouse sensitivity as a percentage of the default
		reach: 5,
		showDebug: 3
	}
	let generatedChunks
	let mouseX, mouseY, mouseDown
	let width = window.innerWidth
	let height = window.innerHeight

	if (height === 400) alert("Canvas is too small. Click the \"Settings\" button to the left of the \"Vote Up\" button under the editor and change the height to 600.")

	let maxHeight = 255
	let blockOutlines = false
	let blockFill = true
	const CUBE     = 0
	const SLAB     = 0x100 // 9th bit
	const STAIR    = 0x200 // 10th bit
	const FLIP     = 0x400 // 11th bit
	// const NORTH    = 0 // 12th and 13th bits for the 4 directions
	const SOUTH    = 0x800
	const EAST     = 0x1000
	const WEST     = 0x1800
	// const ROTATION = 0x1800 // Mask for the direction bits
	let blockMode  = CUBE
	let tex
	let dirtBuffer
	let texCoordsBuffers
	let mainbg, dirtbg // Background images
	let bigArray = win.bigArray || new Float32Array(1000000)
	win.bigArray = bigArray

	// Callback functions for all the screens; will define them further down the page
	let drawScreens = {
		"main menu": () => {},
		"options": () => {},
		"play": () => {},
		"pause": () => {},
		"creation menu": () => {},
		"inventory": () => {},
		"multiplayer menu": () => {},
		"comingsoon menu": () => {},
		"loadsave menu": () => {},
		"chat": () => {}
	}
	let html = {
		pause: {
			enter: [window.message],
			exit: [window.savebox, window.saveDirections, window.message]
		},
		"loadsave menu": {
			enter: [window.worlds, window.boxCenterTop, quota],
			exit: [window.worlds, window.boxCenterTop, quota],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter Save String (Optional)"
				if (navigator && navigator.storage && navigator.storage.estimate) {
					navigator.storage.estimate().then(data => {
						quota.innerText = `${data.usage.toLocaleString()} / ${data.quota.toLocaleString()} bytes (${(100 * data.usage / data.quota).toLocaleString(undefined, { maximumSignificantDigits: 2 })}%) of your quota used`
					}).catch(console.error)
				}
				window.boxCenterTop.onmousedown = () => {
					let elem = document.getElementsByClassName("selected")
					if (elem && elem[0]) {
						elem[0].classList.remove("selected")
					}
					selectedWorld = 0
					Button.draw()
				}
			},
			onexit: () => {
				window.boxCenterTop.onmousedown = null
			}
		},
		"creation menu": {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		},
		loading: {
			enter: [document.getElementById("loading-text")],
			exit: [document.getElementById("loading-text")],
			onenter: startLoad
		},
		editworld: {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		},
		"multiplayer menu": {
			enter: [window.worlds],
			exit: [window.worlds]
		},
		chat: {
			enter: [chatInput, chatOutput],
			exit: [chatInput, chatOutput],
			onenter: () => {
				chatInput.focus()
				releasePointer()
				chatOutput.scroll(0, 10000000)
			}
		},
	}

	let screen = "main menu"
	let previousScreen = screen
	function changeScene(newScene) {
		document.getElementById('background-text').classList.add('hidden')
		if (screen === "options") {
			(0,_js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.saveToDB)("settings", settings).catch(e => console.error(e))
		}

		if (html[screen] && html[screen].exit) {
			for (let element of html[screen].exit) {
				element.classList.add("hidden")
			}
		}

		if (html[newScene] && html[newScene].enter) {
			for (let element of html[newScene].enter) {
				element.classList.remove("hidden")
			}
		}

		if (html[newScene] && html[newScene].onenter) {
			html[newScene].onenter()
		}
		if (html[screen] && html[screen].onexit) {
			html[screen].onexit()
		}

		previousScreen = screen
		screen = newScene
		mouseDown = false
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}
	let hitBox = {}
	let holding = 0
	let Key = {}
	let modelView = win.modelView || new Float32Array(16)
	win.modelView = modelView
	let glCache
	let worlds, selectedWorld = 0
	let freezeFrame = 0
	let p
	let vec1 = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.PVector(), vec2 = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.PVector(), vec3 = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.PVector()
	let move = {
		x: 0,
		y: 0,
		z: 0,
		ang: Math.sqrt(0.5),
	}
	let p2 = {
		x: 0,
		y: 0,
		z: 0,
	}
	let inventory = {
		hotbar: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		main: [],
		hotbarSlot: 0,
		size: 40 * min(width, height) / 600,
		holding: 0,
	}

	function setControl(name, key, shift = false, ctrl = false, alt = false) {
		controlMap[name] = {
			key,
			shift,
			ctrl,
			alt,
			get pressed() {
				return Boolean(Key[this.key]
					&& (!this.shift || Key.ShiftLeft || Key.ShiftRight)
					&& (!this.ctrl || Key.ControlLeft || Key.ControlRight)
					&& (!this.alt || Key.AltLeft || Key.AltRight))
			},
			// Check to see if all of an event's data matches this key map
			event(e) {
				return Boolean(e.code === this.key
					&& (!this.shift || e.shiftKey)
					&& (!this.ctrl || e.ctrlKey)
					&& (!this.alt || e.altKey))
			}
		}
	}
	setControl("jump", "Space")
	setControl("walkForwards", "KeyW")
	setControl("strafeLeft", "KeyA")
	setControl("walkBackwards", "KeyS")
	setControl("strafeRight", "KeyD")
	setControl("sprint", "KeyQ")
	setControl("openInventory", "KeyE")
	setControl("openChat", "KeyT")
	setControl("pause", "KeyP")
	setControl("hyperBuilder", "KeyH")
	setControl("superBreaker", "KeyB")
	setControl("toggleSpectator", "KeyL")
	setControl("zoom", "KeyZ")
	setControl("cycleBlockShapes", "Enter")
	setControl("sneak", "ShiftLeft")
	setControl("dropItem", "Backspace")
	setControl("breakBlock", "leftMouse")
	setControl("placeBlock", "rightMouse")
	setControl("pickBlock", "middleMouse")
	//}

	function play() {
		canvas.onblur()
		p.lastBreak = now
		holding = inventory.hotbar[inventory.hotbarSlot]
		use3d()
		getPointer()
		fill(255, 255, 255)
		textSize(10)
		canvas.focus()
		changeScene("play")

		ctx.clearRect(0, 0, width, height)

		crosshair()
		hud(true)
		hotbar()

	}

	/**
	 * @type {WebGLRenderingContext}*/
	let gl
	/**
	 * @type {{vertex_array_object: OES_vertex_array_object}}*/
	let glExtensions

	/**
	 * @type {(time: Number, view: Matrix) => {}}
	 */
	let skybox

	function getPointer() {
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock()
		}
	}
	function releasePointer() {
		if (document.exitPointerLock) {
			document.exitPointerLock()
		}
	}

	let program3D, program2D, programEntity, program3DFogless

	win.shapes = _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes

	function initShapes() {
		function mapCoords(rect, face) {
			let x = rect.x
			let y = rect.y
			let z = rect.z
			let w = rect.w
			let h = rect.h
			let tx = rect.tx
			let ty = rect.ty
			let tex = [tx+w,ty, tx,ty, tx,ty+h, tx+w,ty+h]
			let pos = null
			switch(face) {
				case 0: // Bottom
					pos = [x,y,z, x+w,y,z, x+w,y,z+h, x,y,z+h]
					break
				case 1: // Top
					pos = [x,y,z, x+w,y,z, x+w,y,z-h, x,y,z-h]
					break
				case 2: // North
					pos = [x,y,z, x-w,y,z, x-w,y-h,z, x,y-h,z]
					break
				case 3: // South
					pos = [x,y,z, x+w,y,z, x+w,y-h,z, x,y-h,z]
					break
				case 4: // East
					pos = [x,y,z, x,y,z+w, x,y-h,z+w, x,y-h,z]
					break
				case 5: // West
					pos = [x,y,z, x,y,z-w, x,y-h,z-w, x,y-h,z]
					break
			}
			pos = pos.map(c => c / 16 - 0.5)
			let minmax = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.compareArr)(pos, [])
			pos.max = minmax.splice(3, 3)
			pos.min = minmax
			tex = tex.map(c => c / 16 / 16)

			return {
				pos: pos,
				tex: tex
			}
		}

		// 90 degree clockwise rotation; returns a new shape object
		function rotate(shape) {
			let verts = shape.verts
			let texVerts = shape.texVerts
			let cull = shape.cull
			let pos = []
			tex = []
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				pos[i] = []
				tex[i] = []
				for (let j = 0; j < side.length; j++) {
					let face = side[j]
					let c = []
					pos[i][j] = c
					for (let k = 0; k < face.length; k += 3) {
						c[k] = face[k + 2]
						c[k + 1] = face[k + 1]
						c[k + 2] = -face[k]
					}

					tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
					if (i === 0) {
						// Bottom
						c.push(...c.splice(0, 3))
						tex[i][j].push(...tex[i][j].splice(0, 2))
					}
					if (i === 1) {
						// Top
						c.unshift(...c.splice(-3, 3))
						tex[i][j].unshift(...tex[i][j].splice(-2, 2))
					}

					let minmax = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.compareArr)(c, [])
					c.max = minmax.splice(3, 3)
					c.min = minmax
				}
			}
			let temp = tex[2] // North
			tex[2] = tex[5] // North = West
			tex[5] = tex[3] // West = South
			tex[3] = tex[4] // South = East
			tex[4] = temp // East = North

			temp = pos[2] // North
			pos[2] = pos[5] // North = West
			pos[5] = pos[3] // West = South
			pos[3] = pos[4] // South = East
			pos[4] = temp // East = North

			let cull2 = {
				top: cull.top,
				bottom: cull.bottom,
				north: cull.west,
				west: cull.south,
				south: cull.east,
				east: cull.north
			}

			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

			return {
				verts: pos,
				texVerts: tex,
				cull: cull2,
				rotate: true,
				flip: shape.flip,
				buffer: buffer,
				size: shape.size,
				varients: shape.varients
			}
		}

		// Reflect over the y plane; returns a new shape object
		function flip(shape) {
			let verts = shape.verts
			let texVerts = shape.texVerts
			let cull = shape.cull
			let pos = []
			tex = []
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				pos[i] = []
				tex[i] = []
				for (let j = 0; j < side.length; j++) {
					let face = side[j].slice().reverse()
					let c = []
					pos[i][j] = c
					for (let k = 0; k < face.length; k += 3) {
						c[k] = face[k + 2]
						c[k + 1] = -face[k + 1]
						c[k + 2] = face[k]
					}
					let minmax = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.compareArr)(c, [])
					c.max = minmax.splice(3, 3)
					c.min = minmax

					tex[i][j] = texVerts[i][j].slice() // Copy texture verts exactly
				}
			}
			let temp = pos[0] // Bottom
			pos[0] = pos[1] // Bottom = Top
			pos[1] = temp // Top = Bottom

			temp = tex[0] // Bottom
			tex[0] = tex[1] // Bottom = Top
			tex[1] = temp // Top = Bottom

			let cull2 = {
				top: cull.bottom,
				bottom: cull.top,
				north: (cull.north & 1) << 1 | (cull.north & 2) >> 1,
				west: (cull.west & 1) << 1 | (cull.west & 2) >> 1,
				south: (cull.south & 1) << 1 | (cull.south & 2) >> 1,
				east: (cull.east & 1) << 1 | (cull.east & 2) >> 1
			}

			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos.flat(2)), gl.STATIC_DRAW)

			return {
				verts: pos,
				texVerts: tex,
				cull: cull2,
				rotate: shape.rotate,
				flip: shape.flip,
				buffer: buffer,
				size: shape.size,
				varients: shape.varients
			}
		}

		for (let shape in _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes) {
			let obj = _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes[shape]
			let verts = obj.verts

			// Populate the vertex coordinates
			for (let i = 0; i < verts.length; i++) {
				let side = verts[i]
				let texArr = []
				obj.texVerts.push(texArr)
				for (let j = 0; j < side.length; j++) {
					let face = side[j]
					let mapped = mapCoords(face, i)
					side[j] = mapped.pos
					texArr.push(mapped.tex)
				}
			}

			if (obj.rotate) {
				let v = obj.varients
				let east = rotate(obj)
				let south = rotate(east)
				let west = rotate(south)
				v[0] = obj
				v[2] = south
				v[4] = east
				v[6] = west
			}
			if (obj.flip) {
				let v = obj.varients
				v[1] = flip(obj)
				if (obj.rotate) {
					v[3] = flip(v[2])
					v[5] = flip(v[4])
					v[7] = flip(v[6])
				}
			}

			obj.buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts.flat(2)), gl.STATIC_DRAW)
		}

		for (let i = 0; i < _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT; i++) {
			let baseBlock = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i]
			let slabBlock = Object.create(baseBlock)
			slabBlock.transparent = true
			let stairBlock = Object.create(baseBlock)
			stairBlock.transparent = true
			slabBlock.shape = _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes.slab
			baseBlock.shape = _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes.cube
			stairBlock.shape = _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes.stair
			_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i | SLAB] = slabBlock
			_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i | STAIR] = stairBlock
			let v = slabBlock.shape.varients
			for (let j = 0; j < v.length; j++) {
				if (v[j]) {
					let block = Object.create(baseBlock)
					block.transparent = true
					block.shape = v[j]
					_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i | SLAB | j << 10] = block
				}
			}
			v = stairBlock.shape.varients
			for (let j = 0; j < v.length; j++) {
				if (v[j]) {
					let block = Object.create(baseBlock)
					block.transparent = true
					block.shape = v[j]
					_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i | STAIR | j << 10] = block
				}
			}
		}
	}
	let indexOrder = new Uint32Array(bigArray.length / 6 | 0)
	for (let i = 0, j = 0; i < indexOrder.length; i += 6, j += 4) {
		indexOrder[i + 0] = 0 + j
		indexOrder[i + 1] = 1 + j
		indexOrder[i + 2] = 2 + j
		indexOrder[i + 3] = 0 + j
		indexOrder[i + 4] = 2 + j
		indexOrder[i + 5] = 3 + j
	}

	let hexagonVerts
	let slabIconVerts
	let stairIconVerts
	let blockIcons
	{
		let s = Math.sqrt(3) / 2
		let q = s / 2

		hexagonVerts = new Float32Array([
			0, 1, s, 0.5, 0, 0, -s, 0.5,
			-s, 0.5, 0, 0, 0, -1, -s, -0.5,
			0, 0, s, 0.5, s, -0.5, 0, -1,
		])

		slabIconVerts = new Float32Array([
			0,  0.5, s,  0,   0, -0.5, -s,  0,
			-s, 0,   0, -0.5, 0, -1,   -s, -0.5,
			0, -0.5, s,  0,   s, -0.5,  0, -1,
		])

		stairIconVerts = [
			-s,0.5,0,0,1,         0,1,1,0,1,         q,0.75,1,0.5,1,    -q,0.25,0,0.5,1,    // top of the top step
			-q,-0.25,0,0,1,       q,0.25,1,0,1,      s,0,1,0.5,1,        0,-0.5,0,0.5,1,    // top of the bottom step
			-q,0.25,0,0,0.6,      q,0.75,1,0,0.6,    q,0.25,1,0.5,0.6,  -q,-0.25,0,0.5,0.6, // front of the top step
			0,-0.5,0,0,0.6,       s,0,1,0,0.6,       s,-0.5,1,0.5,0.6,   0,-1,0,0.5,0.6,    // front of the bottom step
			-s,0.5,0,0,0.8,      -q,0.25,0.5,0,0.8, -q,-0.75,0.5,1,0.8, -s,-0.5,0,1,0.8,    // side of the top step
			-q,-0.25,0.5,0.5,0.8, 0,-0.5,1,0.5,0.8,  0,-1,1,1,0.8,      -q,-0.75,0.5,1,0.8, // side of the bottom step
		]
	}

	/**
	 * Draws the block icon for the given ID
	 * @param {*} x X coordinate in pixels
	 * @param {*} y Y coordinate in pixels (from the top)
	 * @param {*} id Block ID for the icon to draw
	 * @returns {void}
	 */
	let drawIcon = (x, y, id) => ctx.putImageData(blockIcons[id], x, y)
	function renderIcon(x, y, id) {
		x = x * 2 / width - 1
		y = y * 2 / height - 1
		gl.uniform2f(glCache.uOffset, x, y)

		let buffer = blockIcons[id]
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

		gl.vertexAttribPointer(glCache.aVertex2, 2, gl.FLOAT, false, 20, 0)
		gl.vertexAttribPointer(glCache.aTexture2, 2, gl.FLOAT, false, 20, 8)
		gl.vertexAttribPointer(glCache.aShadow2, 1, gl.FLOAT, false, 20, 16)
		gl.drawArrays(gl.TRIANGLES, 0, blockIcons.lengths[id])
	}
	function genIcons() {
		let firstTime = false
		if (!blockIcons) firstTime = true

		blockIcons = [null]
		blockIcons.lengths = [0]
		let texOrder = [1, 2, 3]
		let shadows = [1, 0.4, 0.7]
		let scaleY = inventory.size / height
		let scaleX = inventory.size / width
		for (let i = 1; i < _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT; i++) {
			let data = []
			let block = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[i]

			// Square icon
			if (block.icon) {
				let tex = _js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[block.icon]]
				data.push(scaleX * 0.9, -scaleY * 0.9, tex[4], tex[5], 1) // 3
				data.push(scaleX * 0.9, scaleY * 0.9, tex[2], tex[3], 1) // 2
				data.push(-scaleX * 0.9, scaleY * 0.9, tex[0], tex[1], 1) // 1

				data.push(-scaleX * 0.9, scaleY * 0.9, tex[0], tex[1], 1) // 1
				data.push(-scaleX * 0.9, -scaleY * 0.9, tex[6], tex[7], 1) // 4
				data.push(scaleX * 0.9, -scaleY * 0.9, tex[4], tex[5], 1) // 3

				let buffer = gl.createBuffer()
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
				blockIcons[i] = buffer
				blockIcons.lengths[i] = 6
				blockIcons[i | SLAB] = buffer
				blockIcons.lengths[i | SLAB] = 6
				blockIcons[i | STAIR] = buffer
				blockIcons.lengths[i | STAIR] = 6
				continue
			}

			// Cube icon
			for (let j = 0; j <= 11; j++) {
				data.push(-hexagonVerts[j * 2 + 0] * scaleX)
				data.push(hexagonVerts[j * 2 + 1] * scaleY)
				data.push(_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[block.textures[texOrder[floor(j / 4)]]]][(j * 2 + 0) % 8])
				data.push(_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[block.textures[texOrder[floor(j / 4)]]]][(j * 2 + 1) % 8])
				data.push(shadows[floor(j / 4)])

				if (j % 4 === 2) data.push(...data.slice(-5))
				if (j % 4 === 3) data.push(...data.slice(-25, -20))
			}
			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i] = buffer
			blockIcons.lengths[i] = 6 * 3

			// Slab icon
			data = []
			for (let j = 0; j <= 11; j++) {
				let tex = _js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[block.textures[texOrder[floor(j / 4)]]]]

				data.push(-slabIconVerts[j * 2 + 0] * scaleX)
				data.push(slabIconVerts[j * 2 + 1] * scaleY)
				data.push(tex[(j * 2 + 0) % 8])
				data.push(tex[(j * 2 + 1) % 8])
				data.push(shadows[floor(j / 4)])
				if (j % 4 === 2) data.push(...data.slice(-5))
				if (j % 4 === 3) data.push(...data.slice(-25, -20))
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | SLAB] = buffer
			blockIcons.lengths[i | SLAB] = 6 * 3

			// Stair icon
			data = []
			let v = stairIconVerts
			for (let j = 0; j <= 23; j++) {
				let num = floor(j / 8)
				let tex = _js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[block.textures[texOrder[num]]]]
				let tx = tex[0]
				let ty = tex[1]
				data.push(-v[j * 5 + 0] * scaleX)
				data.push(v[j * 5 + 1] * scaleY)
				// data.push(0.1666666)
				data.push(tx + v[j * 5 + 2] / 16)
				data.push(ty + v[j * 5 + 3] / 16)
				data.push(shadows[num])
				if (j % 4 === 2) data.push(...data.slice(-5))
				if (j % 4 === 3) data.push(...data.slice(-25, -20))
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | STAIR] = buffer
			blockIcons.lengths[i | STAIR] = 6 * 6
		}

		// You know... I totally could've just used 4 vertex/shadow buffers, then swapped the texture buffers... Oh well.
		// Now we draw them all on the canvas at once.
		gl.useProgram(program2D)
		gl.uniform1i(glCache.uSampler2, 0)
		gl.disableVertexAttribArray(3)
		gl.disableVertexAttribArray(4)
		gl.enableVertexAttribArray(0)
		gl.enableVertexAttribArray(1)
		gl.enableVertexAttribArray(2)

		const s = inventory.size | 0
		const limitX = gl.canvas.width / s | 0
		const limitY = gl.canvas.height / s | 0
		const limit = limitX * limitY
		const total = (_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT - 1) * 3
		const pages = Math.ceil(total / limit)
		const blocksPerPage = (limit / 3 | 0) * 3
		const imageIcons = []

		let masks = [CUBE, SLAB, STAIR]
		let drawn = 1 // 0 = air

		let start = Date.now()
		for (let i = 0; i < pages; i++) {
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
			let pageStart = drawn
			for (let j = 0; j < blocksPerPage; j += 3) {
				for (let k = 0; k < 3; k++) {
					let x = (j + k) % limitX
					let y = (j + k) / limitX | 0
					renderIcon(x * s + s/2, height - y * s - s/2, drawn | masks[k])
				}
				drawn++
				if (drawn === _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT) break
			}

			// Page is full, now copy it onto the 2D canvas
			ctx.clearRect(0, 0, width, height)
			ctx.drawImage(gl.canvas, 0, 0)

			// Now load all the icons off the canvas.
			for (let j = 0; j < blocksPerPage; j += 3) {
				for (let k = 0; k < 3; k++) {
					let x = (j + k) % limitX
					let y = (j + k) / limitX | 0
					let id = pageStart + j/3 | masks[k]
					imageIcons[id] = ctx.getImageData(x * s, y * s, s, s)
				}
			}
		}
		if (firstTime) console.log("Ignore that warning ^ on Chrome. It's a lie. Setting willReadFrequently to true made it 10x slower.")
		console.log("Block icons drawn and extracted in:", Date.now() - start, "ms")

		// Yeet the buffers
		delete blockIcons.lengths
		for (let i in blockIcons) if (blockIcons[i]) gl.deleteBuffer(blockIcons[i])
		blockIcons = imageIcons
	}

	//Generate buffers for every block face and store them
	let sideEdgeBuffers
	let indexBuffer

	let matrix = new Float32Array(16) // A temperary matrix that may store random data.
	let projection = new Float32Array(16)
	let defaultModelView = new Float32Array([-10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1])

	let defaultTransformation = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.Matrix([-10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1])
	class Camera {
		constructor() {
			this.x = 0
			this.y = 0
			this.z = 0
			this.px = 0
			this.py = 0
			this.pz = 0

			this.rx = 0 // Pitch
			this.ry = 0 // Yaw
			this.prx = 0 // Pitch
			this.pry = 0 // Yaw

			this.currentFov = 0
			this.defaultFov = settings.fov
			this.targetFov = settings.fov
			this.step = 0
			this.lastStep = 0
			this.projection = new Float32Array(5)
			this.transformation = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.Matrix()
			this.direction = { x: 1, y: 0, z: 0 } // Normalized direction vector
			this.frustum = [] // The 5 planes of the viewing frustum (there's no far plane)
			for (let i = 0; i < 5; i++) {
				this.frustum.push(new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.Plane(1, 0, 0))
			}
		}
		FOV(fov, time) {
			if (fov === this.currentFov) return

			if (!fov) {
				fov = this.currentFov + this.step * (now - this.lastStep)
				this.lastStep = now
				if (Math.sign(this.targetFov - this.currentFov) !== Math.sign(this.targetFov - fov)) {
					fov = this.targetFov
				}
			}
			else if (time) {
				this.targetFov = fov
				this.step = (fov - this.currentFov) / time
				this.lastStep = now
				return
			}
			else {
				this.targetFov = fov
			}

			const tang = Math.tan(fov * Math.PI / 360)
			const scale = 1 / tang
			const near = 1
			const far = 1000000
			this.currentFov = fov // Store the state of the projection matrix
			this.nearH = near * tang // This is needed for frustum culling

			this.projection[0] = scale / width * height
			this.projection[1] = scale
			this.projection[2] = -far / (far - near)
			this.projection[3] = -1
			this.projection[4] = -far * near / (far - near)
		}
		transform() {
			let diff = (performance.now() - this.lastUpdate) / 50
			if (diff > 1) diff = 1
			let x = (this.x - this.px) * diff + this.px
			let y = (this.y - this.py) * diff + this.py
			let z = (this.z - this.pz) * diff + this.pz
			this.transformation.copyMatrix(defaultTransformation)
			this.transformation.rotX(this.rx)
			this.transformation.rotY(this.ry)
			this.transformation.translate(-x, -y, -z)
		}
		getMatrix() {
			let proj = this.projection
			let view = this.transformation.elements
			matrix[0]  = proj[0] * view[0]
			matrix[1]  = proj[1] * view[4]
			matrix[2]  = proj[2] * view[8] + proj[3] * view[12]
			matrix[3]  = proj[4] * view[8]
			matrix[4]  = proj[0] * view[1]
			matrix[5]  = proj[1] * view[5]
			matrix[6]  = proj[2] * view[9] + proj[3] * view[13]
			matrix[7]  = proj[4] * view[9]
			matrix[8]  = proj[0] * view[2]
			matrix[9]  = proj[1] * view[6]
			matrix[10] = proj[2] * view[10] + proj[3] * view[14]
			matrix[11] = proj[4] * view[10]
			matrix[12] = proj[0] * view[3]
			matrix[13] = proj[1] * view[7]
			matrix[14] = proj[2] * view[11] + proj[3] * view[15]
			matrix[15] = proj[4] * view[11]
			return matrix
		}
		setDirection() {
			if (this.targetFov !== this.currentFov) {
				this.FOV()
			}
			this.direction.x = -sin(this.ry) * cos(this.rx)
			this.direction.y = sin(this.rx)
			this.direction.z = cos(this.ry) * cos(this.rx)
			this.computeFrustum()
		}
		computeFrustum() {
			let X = vec1
			let dir = this.direction
			X.x = dir.z
			X.y = 0
			X.z = -dir.x
			X.normalize()

			let Y = vec2
			Y.set(dir)
			Y.mult(-1)
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.cross)(Y, X, Y)

			// Near plane
			this.frustum[0].set(dir.x, dir.y, dir.z)

			let aux = vec3
			aux.set(Y)
			aux.mult(this.nearH)
			aux.add(dir)
			aux.normalize()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.cross)(aux, X, aux)
			this.frustum[1].set(aux.x, aux.y, aux.z)

			aux.set(Y)
			aux.mult(-this.nearH)
			aux.add(dir)
			aux.normalize()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.cross)(X, aux, aux)
			this.frustum[2].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(-this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.cross)(aux, Y, aux)
			this.frustum[3].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.cross)(Y, aux, aux)
			this.frustum[4].set(aux.x, aux.y, aux.z)
		}
		canSee(x, y, z, maxY) {
			// If it's inside the viewing frustum
			x -= 0.5
			y -= 0.5
			z -= 0.5
			maxY += 0.5

			// Player's position is only updated once per tick (20 TPS), but the camera is interpolated between ticks.
			// Add the velocity here to make sure the chunks don't become invisible in those interpolated areas.
			let cx = p.x - p.velocity.x, cy = p.y - p.velocity.y, cz = p.z - p.velocity.z
			for (let i = 0; i < 5; i++) {
				let plane = this.frustum[i]
				let px = x + plane.dx
				let py = plane.dy ? maxY : y
				let pz = z + plane.dz
				if ((px - cx) * plane.nx + (py - cy) * plane.ny + (pz - cz) * plane.nz < 0) {
					return false
				}
			}

			return true

			// If it's within the range of the fog
			// const dx = x - this.x
			// const dy = this.y < maxY ? 0 : maxY - this.y
			// const dz = z - this.z
			// const d = settings.renderDistance * 16 + 24
			// return dx * dx + dy * dy + dz * dz < d * d
		}
	}

	function matMult() {
		// Multiply the projection matrix by the view matrix; this is optimized specifically for these matrices by removing terms that are always 0.
		let proj = projection
		let view = modelView
		matrix[0] = proj[0] * view[0]
		matrix[1] = proj[0] * view[1]
		matrix[2] = proj[0] * view[2]
		matrix[3] = proj[0] * view[3]
		matrix[4] = proj[5] * view[4]
		matrix[5] = proj[5] * view[5]
		matrix[6] = proj[5] * view[6]
		matrix[7] = proj[5] * view[7]
		matrix[8] = proj[10] * view[8] + proj[11] * view[12]
		matrix[9] = proj[10] * view[9] + proj[11] * view[13]
		matrix[10] = proj[10] * view[10] + proj[11] * view[14]
		matrix[11] = proj[10] * view[11] + proj[11] * view[15]
		matrix[12] = proj[14] * view[8]
		matrix[13] = proj[14] * view[9]
		matrix[14] = proj[14] * view[10]
		matrix[15] = proj[14] * view[11]
	}

	function FOV(fov) {
		let tang = Math.tan(fov * 0.5 * Math.PI / 180)
		let scale = 1 / tang
		let near = 1
		let far = 1000000

		projection[0] = scale / width * height
		projection[5] = scale
		projection[10] = -far / (far - near)
		projection[11] = -1
		projection[14] = -far * near / (far - near)
	}

	function initModelView(camera, x, y, z, rx, ry) {
		if (camera) {
			// Inside the game
			camera.transform()
			camera.getMatrix()

			gl.useProgram(program3DFogless)
			gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)

			gl.useProgram(program3D)
			gl.uniformMatrix4fv(glCache.uView, false, matrix)
		}
		else {
			// On the home screen
			(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.copyArr)(defaultModelView, modelView)
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.rotX)(modelView, rx)
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.rotY)(modelView, ry)
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.trans)(modelView, -x, -y, -z)
			matMult()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.transpose)(matrix)

			gl.useProgram(program3DFogless)
			gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)

			gl.useProgram(program3D)
			gl.uniformMatrix4fv(glCache.uView, false, matrix)
		}
	}

	function rayTrace(x, y, z, shape) {
		let cf, cd = 1e9 // Closest face and distance
		let m // Absolute distance to intersection point
		let ix, iy, iz // Intersection coords
		let minX, minY, minZ, maxX, maxY, maxZ, min, max //Bounds of face coordinates
		let east = p.direction.x < 0
		let top = p.direction.y < 0
		let north = p.direction.z < 0
		let verts = shape.verts
		let faces = verts[0]

		// Top and bottom faces

		if (top) {
			faces = verts[1]
		}
		if (p.direction.y) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				m = (y + face[1] - p.y) / p.direction.y
				ix = m * p.direction.x + p.x
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iz >= z + minZ && iz <= z + maxZ) {
					cd = m // Ray crosses bottom face
					cf = top ? "top" : "bottom"
				}
			}
		}

		// West and East faces
		if (east) {
			faces = verts[4]
		}
		else {
			faces = verts[5]
		}
		if (p.direction.x) {
			for (let face of faces) {
				min = face.min
				minY = min[1]
				minZ = min[2]
				max = face.max
				maxY = max[1]
				maxZ = max[2]
				m = (x + face[0] - p.x) / p.direction.x
				iy = m * p.direction.y + p.y
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && iy >= y + minY && iy <= y + maxY && iz >= z + minZ && iz <= z + maxZ) {
					cd = m
					cf = east ? "east" : "west"
				}
			}
		}

		// South and North faces
		if (north) {
			faces = verts[2]
		}
		else {
			faces = verts[3]
		}
		if (p.direction.z) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				m = (z + face[2] - p.z) / p.direction.z
				ix = m * p.direction.x + p.x
				iy = m * p.direction.y + p.y
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iy >= y + minY && iy <= y + maxY) {
					cd = m
					cf = north ? "north" : "south"
				}
			}
		}
		return [cd, cf]
	}
	function runRayTrace(x, y, z) {
		let block = world.getBlock(x, y, z)
		if (block) {
			let rt = rayTrace(x, y, z, _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[block].shape)

			if (rt[1] && rt[0] < hitBox.closest) {
				hitBox.closest = rt[0]
				hitBox.face = rt[1]
				hitBox.pos = [x, y, z]
				hitBox.shape = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[block].shape
			}
		}
	}
	function lookingAt() {
		// Checks blocks in front of the player to see which one they're looking at
		hitBox.pos = null
		hitBox.closest = 1e9

		if (p.spectator) {
			return
		}
		let blockState = world.getBlock(p2.x, p2.y, p2.z)
		if (blockState) {
			hitBox.pos = [p2.x, p2.y, p2.z]
			hitBox.closest = 0
			hitBox.shape = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[blockState].shape
			return
		}

		let pd = p.direction

		let minX = p2.x
		let maxX = 0
		let minY = p2.y
		let maxY = 0
		let minZ = p2.z
		let maxZ = 0

		for (let i = 0; i < settings.reach + 1; i++) {
			if (i > settings.reach) {
				i = settings.reach
			}
			maxX = round(p.x + pd.x * i)
			maxY = round(p.y + pd.y * i)
			maxZ = round(p.z + pd.z * i)
			if (maxX === minX && maxY === minY && maxZ === minZ) {
				continue
			}
			if (minX !== maxX) {
				if (minY !== maxY) {
					if (minZ !== maxZ) {
						runRayTrace(maxX, maxY, maxZ)
					}
					runRayTrace(maxX, maxY, minZ)
				}
				if (minZ !== maxZ) {
					runRayTrace(maxX, minY, maxZ)
				}
				runRayTrace(maxX, minY, minZ)
			}
			if (minY !== maxY) {
				if (minZ !== maxZ) {
					runRayTrace(minX, maxY, maxZ)
				}
				runRayTrace(minX, maxY, minZ)
			}
			if (minZ !== maxZ) {
				runRayTrace(minX, minY, maxZ)
			}
			if (hitBox.pos) {
				return // The ray has collided; it can't possibly find a closer collision now
			}
			minZ = maxZ
			minY = maxY
			minX = maxX
		}
	}
	let inBox = function(x, y, z, w, h, d) {
		let iy = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(y - h/2 - p.topH)
		let ih = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(h + p.bottomH + p.topH)
		let ix = x - w/2 - p.w
		let iw = w + p.w*2
		let iz = z - d/2 - p.w
		let id = d + p.w*2
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y < (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(iy + ih) && p.z < iz + id
	}
	let onBox = function(x, y, z, w, h, d) {
		let iy = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(y - h/2 - p.topH)
		let ih = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(h + p.bottomH + p.topH)
		let ix = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(x - w/2 - p.w)
		let iw = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(w + p.w*2)
		let iz = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(z - d/2 - p.w)
		let id = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(d + p.w*2)
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y <= iy + ih && p.z < iz + id
	}
	function collided(x, y, z, vx, vy, vz, block) {
		if(p.spectator && block !== _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockIds.bedrock) {
			return false
		}
		let verts = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[block].shape.verts
		let px = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.x - p.w - x)
		let py = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.y - p.bottomH - y)
		let pz = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.z - p.w - z)
		let pxx = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.x + p.w - x)
		let pyy = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.y + p.topH - y)
		let pzz = (0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.roundBits)(p.z + p.w - z)
		let minX, minY, minZ, maxX, maxY, maxZ, min, max

		// Top and bottom faces
		let faces = verts[0]
		if (vy <= 0) {
			faces = verts[1]
		}
		if (!vx && !vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				if (face[1] > py && face[1] < pyy && minX < pxx && maxX > px && minZ < pzz && maxZ > pz) {
					col = true
					if (vy <= 0) {
						p.onGround = true
						p.y = round((face[1] + y + p.bottomH) * 10000) / 10000
						p.velocity.y = 0
					}
					else {
						p.y = face[1] + y - p.topH - 0.01
					}
				}
			}
			return col
		}

		// West and East faces
		if (vx < 0) {
			faces = verts[4]
		}
		else if (vx > 0) {
			faces = verts[5]
		}
		if (vx) {
			let col = false
			for (let face of faces) {
				min = face.min
				minZ = min[2]
				minY = min[1]
				max = face.max
				maxZ = max[2]
				maxY = max[1]
				if (face[0] > px && face[0] < pxx && minY < pyy && maxY > py && minZ < pzz && maxZ > pz) {
					if (maxY - py > 0.5 || !p.onGround) {
						p.canStepX = false
						p.x = x + face[0] + (vx < 0 ? p.w : -p.w) * 1.001
					}
					col = true
				}
			}
			return col
		}

		// South and North faces
		if (vz < 0) {
			faces = verts[2]
		}
		else if (vz > 0) {
			faces = verts[3]
		}
		if (vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				if (face[2] > pz && face[2] < pzz && minY < pyy && maxY > py && minX < pxx && maxX > px) {
					if (maxY - py > 0.5 || !p.onGround) {
						p.canStepZ = false
						p.z = z + face[2] + (vz < 0 ? p.w : -p.w) * 1.001
					}
					col = true
				}
			}
			return col
		}
		throw "Test"
	}
	let contacts = {
		array: [],
		size: 0,
		add: function(x, y, z, block) {
			if (this.size === this.array.length) {
				this.array.push([x, y, z, block])
			}
			else {
				this.array[this.size][0] = x
				this.array[this.size][1] = y
				this.array[this.size][2] = z
				this.array[this.size][3] = block
			}
			this.size++
		},
		clear: function() {
			this.size = 0
		},
	}
	let resolveContactsAndUpdatePosition = function() {
		if (p.y < 0) p.y = 70
		let mag = p.velocity.mag()
		let steps = Math.ceil(mag / p.w)
		const VX = p.velocity.x / steps
		const VY = p.velocity.y / steps
		const VZ = p.velocity.z / steps

		let pminX = floor(0.5 + p.x - p.w + (p.velocity.x < 0 ? p.velocity.x : 0))
		let pmaxX = ceil(-0.5 + p.x + p.w + (p.velocity.x > 0 ? p.velocity.x : 0))
		let pminY = max(floor(0.5 + p.y - p.bottomH + (p.velocity.y < 0 ? p.velocity.y : 0)), 0)
		let pmaxY = min(ceil(-0.5 + p.y + p.topH + (p.velocity.y > 0 ? p.velocity.y : 0)), 255)
		let pminZ = floor(0.5 + p.z - p.w + (p.velocity.z < 0 ? p.velocity.z : 0))
		let pmaxZ = ceil(-0.5 + p.z + p.w + (p.velocity.z > 0 ? p.velocity.z : 0))

		for (let y = pmaxY; y >= pminY; y--) {
			for (let x = pminX; x <= pmaxX; x++) {
				for (let z = pminZ; z <= pmaxZ; z++) {
					let block = world.getBlock(x, y, z)
					if (_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[block].solid) {
						contacts.add(x, y, z, block)
					}
				}
			}
		}

		// let hasCollided = false
		p.px = p.x
		p.py = p.y
		p.pz = p.z
		for (let j = 1; j <= steps; j++) {
			let px = p.x
			let pz = p.z

			// Check collisions in the Y direction
			p.onGround = false
			p.canStepX = false
			p.canStepZ = false
			p.y += VY
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, 0, VY, 0, block)) {
					p.velocity.y = 0
					// hasCollided = true
					// It doesn't matter that it checked the top blocks first.
					// Slabs are technically level with cubes, but they're shorter.
					// So if it checks a slab before checking a cube, exiting early
					// could prevent the player from colliding with the cube.
					// break <-- In other words, don't do this.
				}
			}

			// Stepping works by letting you walk inside short hitboxes that you collide with in the x or z directions.
			// Since collisions in the Y direction are checked first, you won't step until the next frame.
			if (p.onGround) {
				p.canStepX = true
				p.canStepZ = true
			}

			var sneakLock = false, sneakSafe = false
			if (p.sneaking) {
				for (let i = 0; i < contacts.size; i++) {
					let [x, y, z] = contacts.array[i]
					if (onBox(x, y, z, 1, 1, 1)) {
						sneakLock = true
						break
					}
				}
			}

			// Check collisions in the X direction
			p.x += VX
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, VX, 0, 0, block)) {
					if (p.canStepX && !world.getBlock(x, y + 1, z) && !world.getBlock(x, y + 2, z)) {
						continue
					}
					if (p.canStepX) p.x -= VX // Wasn't handled in `collided` since it thought it could step.
					p.velocity.x = 0
					// hasCollided = true
					break
				}
				if (sneakLock && onBox(x, y, z, 1, 1, 1)) {
					sneakSafe = true
				}
			}

			if (sneakLock && !sneakSafe) {
				p.x = px
				p.velocity.x = 0
				// hasCollided = true
			}
			sneakSafe = false

			// Check collisions in the Z direction
			p.z += VZ
			for (let i = 0; i < contacts.size; i++) {
				let [x, y, z, block] = contacts.array[i]
				if (collided(x, y, z, 0, 0, VZ, block)) {
					if (p.canStepZ && !world.getBlock(x, y + 1, z) && !world.getBlock(x, y + 2, z)) {
						continue
					}
					// p.z = p.pz
					if (p.canStepZ) p.z -= VZ // Wasn't handled in `collided` since it thought it could step.
					p.velocity.z = 0
					// hasCollided = true
					break
				}
				if (sneakLock && onBox(x, y, z, 1, 1, 1)) {
					sneakSafe = true
				}
			}

			if (sneakLock && !sneakSafe) {
				p.z = pz
				p.velocity.z = 0
				// hasCollided = true
			}
		}


		if (!p.flying) {
			let drag = p.onGround ? 0.5 : 0.85
			p.velocity.z += p.velocity.z * drag - p.velocity.z
			p.velocity.x += p.velocity.x * drag - p.velocity.x
		}
		else {
			let drag = 0.9
			p.velocity.z += p.velocity.z * drag - p.velocity.z
			p.velocity.x += p.velocity.x * drag - p.velocity.x
			p.velocity.y += p.velocity.y * 0.8 - p.velocity.y
			if (p.onGround && !p.spectator) {
				p.flying = false
			}
		}

		p.lastUpdate = performance.now()
		contacts.clear()
		lookingAt()
	}
	let runGravity = function() {
		if (p.flying) {
			return
		}

		p.velocity.y += p.gravityStrength
		if(p.velocity.y < -p.maxYVelocity) {
			p.velocity.y = -p.maxYVelocity
		}
		if(p.onGround) {
			if(controlMap.jump.pressed) {
				p.velocity.y = p.jumpSpeed
				p.onGround = false
			}
		}
	}

	function box2(sides, tex) {
		if (blockFill) {
			let i = 0
			for (let side in _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.Block) {
				if (sides & _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.Block[side]) {
					gl.bindBuffer(gl.ARRAY_BUFFER, sideEdgeBuffers[i])
					gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 0, 0)

					gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffers[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap[tex[i]]])
					gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 0, 0)

					// vertexAttribPointer(gl, glCache, "aVertex", program3D, "aVertex", 3, sideEdgeBuffers[i])
					// vertexAttribPointer(gl, glCache, "aTexture", program3D, "aTexture", 2, texCoordsBuffers[textureMap[tex[i]]])
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0)
				}
				i++
			}
		}
		if (blockOutlines) {
			// vertexAttribPointer(gl, glCache, "aVertex", program3D, "aVertex", 3, hitBox.shape.buffer)
			// vertexAttribPointer(gl, glCache, "aTexture", program3D, "aTexture", 2, texCoordsBuffers[textureMap.hitbox])

			gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffers[_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureMap.hitbox])
			gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 0, 0)

			gl.bindBuffer(gl.ARRAY_BUFFER, hitBox.shape.buffer)
			gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 0, 0)

			for (let i = 0; i < hitBox.shape.size; i++) {
				gl.drawArrays(gl.LINE_LOOP, i * 4, 4)
			}
		}
	}
	function block2(x, y, z, t, camera) {
		if (camera) {
			camera.transformation.translate(x, y, z)
			camera.getMatrix()
			gl.useProgram(program3DFogless)
			gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)

			// gl.useProgram(program3D)
			// gl.uniformMatrix4fv(glCache.uView, false, matrix)
			camera.transformation.translate(-x, -y, -z)
		}
		else {
			(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.trans)(modelView, x, y, z)
			matMult()
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.trans)(modelView, -x, -y, -z)
			;(0,_js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.transpose)(matrix)
			// gl.useProgram(program3DFogless)
			// gl.uniformMatrix4fv(glCache.uViewFogless, false, matrix)

			gl.useProgram(program3D)
			gl.uniformMatrix4fv(glCache.uView, false, matrix)
		}
		box2(0xff, _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[t].textures)
	}

	function changeWorldBlock(t) {
		let pos = hitBox.pos
		if(pos && pos[1] > 0 && pos[1] < maxHeight) {
			let shape = t && _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[t].shape
			if (t && shape.rotate) {
				let pi = Math.PI / 4
				if (p.ry > pi) { // If not north
					if (p.ry < 3 * pi) {
						t |= WEST
					}
					else if (p.ry < 5 * pi) {
						t |= SOUTH
					}
					else if (p.ry < 7 * pi) {
						t |= EAST
					}
				}
			}

			if (t && shape.flip && hitBox.face !== "top" && (hitBox.face === "bottom" || (p.direction.y * hitBox.closest + p.y) % 1 < 0.5)) {
				t |= FLIP
			}

			world.setBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], t, 0)
			if (t) {
				p.lastPlace = now
			}
			else {
				p.lastBreak = now
			}
		}
	}
	function newWorldBlock() {
		if(!hitBox.pos || !holding) return
		let pos = hitBox.pos, x= pos[0], y = pos[1], z = pos[2]
		switch(hitBox.face) {
			case "top":
				y += 1
				break
			case "bottom":
				y -= 1
				break
			case "south":
				z -= 1
				break
			case "north":
				z += 1
				break
			case "west":
				x -= 1
				break
			case "east":
				x += 1
				break
		}
		if (!inBox(x, y, z, 1, 1, 1) && !world.getBlock(x, y, z)) {
			pos[0] = x
			pos[1] = y
			pos[2] = z
			changeWorldBlock(holding < 0xff ? holding | blockMode : holding)
		}
	}

	let renderedChunks = 0

	let analytics = {
		totalTickTime: 0,
		worstFrameTime: 0,
		totalRenderTime: 0,
		totalFrameTime: 0,
		lastUpdate: 0,
		frames: 1,
		displayedTickTime: "0",
		displayedRenderTime: "0",
		displayedFrameTime: "0",
		displayedwFrameTime: "0",
		displayedwFps: 0,
		fps: 0,
		worstFps: 60,
	}
	function chunkDist(c) {
		let dx = p.x - c.x
		let dz = p.z - c.z
		if (dx > 16) {
			dx -= 16
		}
		else if (dx > 0) {
			dx = 0
		}
		if (dz > 16) {
			dz -= 16
		}
		else if (dz > 0) {
			dz = 0
		}
		return Math.sqrt(dx * dx + dz * dz)
	}
	function sortChunks(c1, c2) { // Sort the list of chunks based on distance from the player
		let dx1 = p.x - c1.x - 8
		let dy1 = p.z - c1.z - 8
		let dx2 = p.x - c2.x - 8
		let dy2 = p.z - c2.z - 8
		return dx1 * dx1 + dy1 * dy1 - (dx2 * dx2 + dy2 * dy2)
	}
	function fillReqs(x, z) {
		// Chunks must all be loaded first.
		let done = true
		for (let i = x - 3; i <= x + 3; i++) {
			for (let j = z - 3; j <= z + 3; j++) {
				let chunk = world.loaded[(i + world.offsetX) * world.lwidth + j + world.offsetZ]
				if (!chunk.generated) {
					world.generateQueue.push(chunk)
					done = false
				}

				if (!chunk.populated && i >= x - 2 && i <= x + 2 && j >= z - 2 && j <= z + 2) {
					world.populateQueue.push(chunk)
					done = false
				}

				if (!chunk.lit && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					world.lightingQueue.push(chunk)
					done = false
				}
			}
		}

		return done
	}
	function renderFilter(chunk) {
		const d = settings.renderDistance + Math.SQRT1_2
		return chunk.distSq <= d * d
	}

	function debug(message) {
		let ellapsed = performance.now() - debug.start
		if (ellapsed > 30) {
			console.log(message, ellapsed.toFixed(2), "milliseconds")
		}
	}

	let alerts = []
	function chatAlert(msg) {
		if (screen !== "play") return
		alerts.push({
			msg: msg.substr(0, 50),
			created: now,
			rendered: false
		})
		if (alerts.length > 5) alerts.shift()
		renderChatAlerts()
	}
	let charWidth = 6
	{
		// Determine the width of the user's system monospace font.
		let span = document.createElement('span')
		span.style.fontFamily = "monospace"
		span.style.fontSize = "20px"
		span.textContent = "a"
		document.body.append(span)
		charWidth = span.offsetWidth
		span.remove()
	}
	function renderChatAlerts() {
		if (!alerts.length || screen !== "play") return
		let y = height - 150
		if (now - alerts[0].created > 10000 || !alerts.at(-1).rendered) {
			// Clear old alerts
			let x = 50
			let y2 = y - 50 * (alerts.length - 1) - 20
			let w = charWidth * alerts.reduce((mx, al) => max(mx, al.msg.length), 0)
			let h = 50 * (alerts.length - 1) + 24
			ctx.clearRect(x, y2, w, h)
		}
		else return
		while(alerts.length && now - alerts[0].created > 10000) {
			alerts.shift()
		}
		textSize(20)
		for (let i = alerts.length - 1; i >= 0; i--) {
			let alert = alerts[i]
			text(alert.msg, 50, y)
			y -= 50
		}
	}

	function chat(msg, color, author) {
		let lockScroll = false
		if (chatOutput.scrollTop + chatOutput.clientHeight + 50 > chatOutput.scrollHeight) {
			lockScroll = true
		}
		let div = document.createElement("div")
		div.className = "message"

		let content = document.createElement('span')
		if (color) content.style.color = color
		content.textContent = msg

		if (author) {
			let name = document.createElement('span')
			name.textContent = author + ": "
			if (author === "Willard") {
				name.style.color = "cyan"
			}
			div.append(name)
			msg = `${author}: ${msg}` // For the chatAlert
		}

		div.append(content)

		chatOutput.append(div)
		chatAlert(msg)
		if (lockScroll) {
			chatOutput.scroll(0, 10000000)
		}
	}

	function sendChat(msg) {
		if (multiplayer) {
			multiplayer.send(JSON.stringify({
				type: "chat",
				data: msg
			}))
		}
		chat(`${currentUser.username}: ${msg}`, "lightgray")
	}

	let currentUser = { username: "Player" }
	let blockLog = { Player: [] }
	let commands = new Map()
	let autocompleteList = []
	let commandList = []
	var multiplayer = null
	let playerPositions = {}
	let playerEntities = {}
	let playerDistances = []
	function setAutocomplete(list) {
		if (list === autocompleteList) return
		if (list.length === autocompleteList.length) {
			let i = 0
			for (; i < list.length; i++) {
				if (list[i] !== autocompleteList[i]) break
			}
			if (i === list.length) return
		}

		let element = document.getElementById("commands")
		while (element.childElementCount) element.removeChild(element.lastChild)

		for (let string of list) {
			let option = document.createElement("option")
			option.value = string
			element.append(option)
		}
		autocompleteList = list
	}
	function addCommand(name, callback, usage, description, autocomplete) {
		if (!autocomplete) autocomplete = () => {}
		commands.set(name, {
			name,
			callback,
			usage,
			description,
			autocomplete
		})
		commandList.push("/" + name)
	}
	addCommand("help", args => {
		let commandName = args[0]
		if (commands.has(commandName)) {
			const command = commands.get(commandName)
			chat(`Usage: ${command.usage}\nDescription: ${command.description}`, "lime")
		}
		else chat(`/help shows command usage with /help <command name>. Syntax is like "/commandName <required> [optional=default]". So for example "/undo [username=yourself] <count>" means you can do "/undo 12" to undo your own last 12 block edits, or "/undo 1337 griefer 5000" to undo 1337 griefer's last 5000 block edits.\n\nPro tip: you can delete random autocomplete suggestions by `)
	}, "/help <command name>", "Shows how to use a command", () => {
		setAutocomplete(commandList.map(command => `/help ${command.slice(1)}`))
	})
	addCommand("ban", args => {
		let username = args.join(" ")
		if (!username) {
			chat("Please provide a username. Like /ban Willard", "tomato")
			return
		}
		if (!window.ban) {
			chat("This is a singleplayer world. There's nobody to ban.", "tomato")
			return
		}
		window.ban(username)
	}, "/ban <username>", "IP ban a player from your world until you close it.", () => {
		setAutocomplete(Object.keys(playerPositions).map(player => `/ban ${player}`))
	})
	addCommand("online", () => {
		if (window.online && multiplayer) {
			window.online()
		}
		else {
			chat("You're all alone. Sorry.", "tomato")
		}
	}, "/online", "Lists online players")
	addCommand("history", args => {
		let dist = +args[0] || 20
		dist *= dist
		let lines = []
		for (let name in blockLog) {
			let list = blockLog[name]
			let oldest = 0
			let newest = 0
			let broken = 0
			let placed = 0
			for (let i = 0; i < list.length; i++) {
				let block = list[i]
				let dx = block[0] - p.x
				let dy = block[1] - p.y
				let dz = block[2] - p.z
				if (dx * dx + dy * dy + dz * dz <= dist) {
					if (block[3]) placed++
					else broken++
					newest = block[5]
					if (!oldest) oldest = block[5]
				}
			}
			if (oldest) {
				lines.push(`${name}: ${broken} blocks broken and ${placed} blocks placed between ${(0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.timeString)(now-oldest)} and ${(0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.timeString)(now-newest)}.`)
			}
		}
		if (lines.length) {
			let ul = document.createElement("ul")
			for (let line of lines) {
				let li = document.createElement("li")
				li.textContent = line
				ul.append(li)
			}
			chatOutput.append(ul)
			// chat(`Within ${Math.sqrt(dist)} blocks of your position:\n` + lines.join("\n"), "lime")
		}
		else chat(`No blocks edited within ${Math.sqrt(dist)} blocks within this world session.`, "tomato")
	}, "/history [dist=20]", "Shows a list of block edits within a specified range from your current world session.")
	addCommand("undo", async args => {
		if (multiplayer && !multiplayer.host) {
			chat("Only the world's host may use this command.", "tomato")
			return
		}
		let count = +args.pop()
		if (isNaN(count)) {
			chat("Please provide a count of the number of blocks to undo. Like /undo Willard 4000", "tomato")
			return
		}
		let name = currentUser.username
		if (args.length) name = args.join(" ")
		let list = blockLog[name]
		if (!list) {
			chat("You provided a name that didn't match any users with a block history. Names are case-sensitive.", "tomato")
			return
		}

		if (count > list.length) count = list.length
		chat(`Undoing the last ${count} block edits from ${name}`, "lime")
		for (let i = 0; i < count; i++) {
			let [x, y, z, newBlock, oldBlock] = list.pop()
			if (multiplayer) await sleep(50)
			world.setBlock(x, y, z, oldBlock, false, false, true)
		}
		chat(`${count} block edits undone.`, "lime")
	}, "/undo [username=Player] <blockCount>", "Undoes the last <blockCount> block edits made by [username]", () => {
		setAutocomplete(Object.keys(blockLog).map(name => `/undo ${name} ${blockLog[name].length}`))
	})

	function sendCommand(msg) {
		msg = msg.substr(1)
		let parts = msg.split(" ")
		let cmd = parts.shift()
		if (commands.has(cmd)) commands.get(cmd).callback(parts)
		setAutocomplete(commandList)
	}

	async function loggedIn() {
		let exists = await fetch("https://willard.fun/profile").then(res => res.text()).catch(() => "401")
		if (!exists || exists === "401") {
			if (location.href.startsWith("https://willard.fun")) {
				alert("You're not logged in. Head over to https://willard.fun/login to login or register before connecting to the server.")
			}
			else {
				alert("Multiplayer is currently only available on https://willard.fun/login => https://willard.fun/minekhan")
			}
			return false
		}
		currentUser = JSON.parse(exists)
		if (blockLog.Player) {
			blockLog[currentUser.username] = blockLog.Player
			delete blockLog.Player
		}
		return true
	}

	async function initMultiplayer(target) {
		if (multiplayer) return
		let logged = await loggedIn()
		if (!logged) return

		let host = false
		if (!target) {
			target = world.id
			host = true
		}
		multiplayer = new WebSocket("wss://willard.fun/ws?target=" + target)
		multiplayer.host = host
		multiplayer.binaryType = "arraybuffer"
		multiplayer.onopen = () => {
			let password = ""
			if (!host && !worlds[target].public) password = prompt(`What's the password for ${worlds[target].name}?`) || ""
			multiplayer.send(JSON.stringify({
				type: "connect",
				password
			}))
			if (host) {
				let password = prompt("Enter a password to make this a private world, or leave it blank for a public world.") || ""
				multiplayer.send(JSON.stringify({
					type: "init",
					name: world.name,
					version,
					password
				}))
			}
			multiplayer.pos = setInterval(() => multiplayer.send(JSON.stringify({
				type: "pos",
				data: { x: p.x, y: p.y, z: p.z, vx: p.velocity.x, vy: p.velocity.y, vz: p.velocity.z }
			})), 500)
		}
		let multiplayerError = ""
		multiplayer.onmessage = msg => {
			if (msg.data === "ping") {
				multiplayer.send("pong")
				return
			}
			if (typeof msg.data !== "string" && screen === "multiplayer menu") {
				world = new World(true)
				world.loadSave(new Uint8Array(msg.data))
				changeScene("loading")
				return
			}
			let packet = JSON.parse(msg.data)
			if (packet.type === "setBlock") {
				let a = packet.data

				if (!a[4]) {
					// If it's not an "Undo" packet, log it.
					let old = world.getBlock(a[0], a[1], a[2])
					a.push(old, now)
					if (!blockLog[packet.author]) blockLog[packet.author] = []
					blockLog[packet.author].push(a)
				}

				world.setBlock(a[0], a[1], a[2], a[3], false, true)
			}
			else if (packet.type === "genChunk") {
				// TO-DO: generate chunks
			}
			else if (packet.type === "connect") {
				if (host) {
					multiplayer.send(world.getSaveString())
				}
				chat(`${packet.author} has joined.`, "#6F6FFB")
			}
			else if (packet.type === "users") {
				chat(packet.data.join(", "), "lightgreen")
			}
			else if (packet.type === "ban") {
				chat(packet.data, "lightgreen")
			}
			else if (packet.type === "pos") {
				let pos = packet.data
				let name = packet.author
				playerPositions[name] = pos
				if (!playerEntities[name]) playerEntities[name] = new _js_player_js__WEBPACK_IMPORTED_MODULE_20__.Player(pos.x, pos.y, pos.z, pos.vx, pos.vy, pos.vz, abs(name.hashCode()) % 80 + 1, glExtensions, gl, glCache, indexBuffer, world, p)
				let ent = playerEntities[name]
				ent.x = pos.x
				ent.y = pos.y
				ent.z = pos.z
				ent.velx = pos.vx || 0
				ent.vely = pos.vy || 0
				ent.velz = pos.vz || 0
				packet.data.time = now
			}
			else if (packet.type === "error") {
				multiplayerError = packet.data
			}
			else if (packet.type === "debug") {
				chat(packet.data, "pink", "Server")
			}
			else if (packet.type === "dc") {
				chat(`${packet.author} has disconnected.`, "tomato")
				delete playerPositions[packet.author]
				delete playerEntities[packet.author]
			}
			else if (packet.type === "eval") { // Blocked server-side; Can only be sent directly from the server for announcements and live patches
				try {
					eval(packet.data)
				}
				catch(e) {
					// Do nothing
				}
			}
			else if (packet.type === "chat") {
				chat(packet.data, "white", packet.author)
			}
		}

		multiplayer.onclose = () => {
			if (!host) {
				if (screen !== "main menu") alert(`Connection lost! ${multiplayerError}`)
				changeScene("main menu")
			}
			else if (screen !== "main menu") {
				alert(`Connection lost! ${multiplayerError || "You can re-open your world from the pause menu."}`)
			}
			clearInterval(multiplayer.pos)
			multiplayer = null
			playerEntities = {}
			playerPositions = {}
			playerDistances.length = 0
		}
		multiplayer.onerror = multiplayer.onclose

		window.online = function() {
			multiplayer.send("fetchUsers")
		}

		window.ban = function(username) {
			if (!multiplayer) {
				chat("Not in a multiplayer world.", "tomato")
				return
			}
			if (!host) {
				chat("You don't have permission to do that.", "tomato")
				return
			}
			if (username.trim().toLowerCase() === "willard") {
				chat("You cannot ban Willard. He created this game and is paying for this server.", "tomato")
				return
			}
			multiplayer.send(JSON.stringify({
				type: "ban",
				data: username || ""
			}))
		}

		window.dists = () => {
			console.log(playerPositions)
			console.log(playerDistances)
			return playerEntities
		}
	}

	async function getWorlds() {
		let logged = await loggedIn()
		if (!logged) return []

		return await fetch("https://willard.fun/minekhan/worlds").then(res => res.json())
	}

	let fogDist = 16

	// const wasm = await WebAssembly.instantiateStreaming("/world.wasm", {})
	// const { memory } = wasm.instance.exports

	class World {
		constructor(empty) {
			if (!empty) {
				setSeed(Math.random() * 2000000000 | 0)
			}

			generatedChunks = 0
			fogDist = 16

			// Initialize the world's arrays
			this.chunks = []
			this.loaded = []
			this.sortedChunks = []
			this.doubleRenderChunks = []
			this.offsetX = 0
			this.offsetZ = 0
			this.lwidth = 0
			this.chunkGenQueue = []
			this.populateQueue = []
			this.generateQueue = []
			this.lightingQueue = []
			this.meshQueue = []
			this.loadFrom = {}
			this.loadKeys = []
			this.loading = false
			this.entities = []
			this.eventQueue = []
			this.lastChunk = ","
			this.caves = caves
			this.initTime = Date.now()
			this.tickCount = 0
			this.settings = settings
			this.lastTick = performance.now()
			// this.memory = memory
			// this.freeMemory = []
		}
		initMemory() {
			// Reserve first 256 bytes for settings or whatever
			this.pointers = new Uint32Array(this.memory.buffer, 256, 71*71)
		}
		updateBlock(x, y, z) {
			let chunk = this.chunks[x >> 4] && this.chunks[x >> 4][z >> 4]
			if (chunk && chunk.buffer) {
				chunk.updateBlock(x & 15, y, z & 15, this)
			}
		}
		getChunk(x, z) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			return this.loaded[X * this.lwidth + Z]
		}
		getWorldBlock(x, y, z) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				return _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockIds.air
			}
			return this.chunks[x >> 4][z >> 4].getBlock(x & 15, y, z & 15)
		}
		getBlock(x, y, z) {
			// let X = (x >> 4) + this.offsetX
			// let Z = (z >> 4) + this.offsetZ
			if (y > maxHeight) {
				// debugger
				return 0
			}
			// else if (y < 0) {
			// 	debugger
			// 	return blockIds.bedrock
			// }
			// else if (X < 0 || X >= this.lwidth || Z < 0 || Z >= this.lwidth) {
			// 	debugger
			// 	return this.getWorldBlock(x, y, z)
			// }
			return this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].getBlock(x & 15, y, z & 15)
		}
		setWorldBlock(x, y, z, blockID) {
			this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ].setBlock(x & 15, y, z & 15, blockID, false)
		}
		setBlock(x, y, z, blockID, lazy, remote, doNotLog) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				this.eventQueue.push([x, y, z, blockID])
				return
			}
			let chunk = this.chunks[x >> 4][z >> 4]
			if (!chunk.buffer && remote) {
				this.eventQueue.push([x, y, z, blockID])
				return
			}

			let xm = x & 15
			let zm = z & 15

			if (!remote && !doNotLog) {
				// Log your own blocks
				let oldBlock = chunk.getBlock(xm, y, zm)
				blockLog[currentUser.username].push([x, y, z, blockID, oldBlock, now])
			}
			if (blockID) {
				chunk.setBlock(xm, y, zm, blockID, !lazy)
				let data = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[blockID]
				if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
					this.updateLight(x, y, z, true, data.lightLevel)
				}
			}
			else {
				let data = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[chunk.getBlock(xm, y, zm)]
				chunk.deleteBlock(xm, y, zm, !lazy)
				if (!lazy && chunk.buffer && (!data.transparent || data.lightLevel) && screen !== "loading") {
					this.updateLight(x, y, z, false, data.lightLevel)
				}
			}

			if (lazy) {
				return
			}

			if (multiplayer && !remote) {
				let data = [x, y, z, blockID]
				if (doNotLog) data.push(1)
				multiplayer.send(JSON.stringify({
					type: "setBlock",
					data: data
				}))
			}

			// Update the 6 adjacent blocks and 1 changed block
			if (xm && xm !== 15 && zm && zm !== 15) {
				chunk.updateBlock(xm - 1, y, zm, this)
				chunk.updateBlock(xm, y - 1, zm, this)
				chunk.updateBlock(xm + 1, y, zm, this)
				chunk.updateBlock(xm, y + 1, zm, this)
				chunk.updateBlock(xm, y, zm - 1, this)
				chunk.updateBlock(xm, y, zm + 1, this)
			}
			else {
				this.updateBlock(x - 1, y, z)
				this.updateBlock(x + 1, y, z)
				this.updateBlock(x, y - 1, z)
				this.updateBlock(x, y + 1, z)
				this.updateBlock(x, y, z - 1)
				this.updateBlock(x, y, z + 1)
			}

			chunk.updateBlock(xm, y, zm, this)

			// Update the corner chunks so shadows in adjacent chunks update correctly
			if (xm | zm === 0) {
				this.updateBlock(x - 1, y, z - 1)
			}
			if (xm === 15 && zm === 0) {
				this.updateBlock(x + 1, y, z - 1)
			}
			if (xm === 0 && zm === 15) {
				this.updateBlock(x - 1, y, z + 1)
			}
			if (xm & zm === 15) {
				this.updateBlock(x + 1, y, z + 1)
			}
		}
		getLight(x, y, z, blockLight) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			// if (X < 0 || X >= this.lwidth || Z < 0 || Z >= this.lwidth) {
			// 	debugger
			// 	if (y < 0 || y > 255) debugger
			// 	if (blockLight === 1) return this.chunks[x >> 4][z >> 4].getBlockLight(x & 15, y, z & 15)
			// 	else if (blockLight === 0) return this.chunks[x >> 4][z >> 4].getSkyLight(x & 15, y, z & 15)
			// 	else return this.chunks[x >> 4][z >> 4].getLight(x & 15, y, z & 15)
			// }
			if (blockLight === 1) return this.loaded[X * this.lwidth + Z].getBlockLight(x & 15, y, z & 15)
			else if (blockLight === 0) return this.loaded[X * this.lwidth + Z].getSkyLight(x & 15, y, z & 15)
			else return this.loaded[X * this.lwidth + Z].getLight(x & 15, y, z & 15)
		}
		setLight(x, y, z, level, blockLight) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ

			if (this.loaded[X * this.lwidth + Z]) {
				if (blockLight === 1) this.loaded[X * this.lwidth + Z].setBlockLight(x & 15, y, z & 15, level)
				else if (blockLight === 0) this.loaded[X * this.lwidth + Z].setSkyLight(x & 15, y, z & 15, level)
				else this.loaded[X * this.lwidth + Z].setLight(x & 15, y, z & 15, level)
			}
		}
		updateLight(x, y, z, place, blockLight = 0) {
			let chunk = this.getChunk(x, z)
			if (!chunk) return
			let cx = x & 15
			let cz = z & 15
			let center = chunk.getSkyLight(cx, y, cz)
			let blight = chunk.getBlockLight(cx, y, cz)
			let up = this.getLight(x, y+1, z, 0)
			let down = this.getLight(x, y-1, z, 0)
			let north = this.getLight(x, y, z+1, 0)
			let south = this.getLight(x, y, z-1, 0)
			let east = this.getLight(x+1, y, z, 0)
			let west = this.getLight(x-1, y, z, 0)

			let spread = []
			if (!place) { // Block was removed; increase light levels
				if (up === 15) { // Removed block was under direct sunlight; fill light downward
					for (let i = y; i > 0; i--) {
						if (_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[chunk.getBlock(cx, i, cz)].transparent) {
							chunk.setSkyLight(cx, i, cz, 15)
							spread.push(x, i, z)
						}
						else {
							break
						}
					}
					chunk.spreadLight(spread, 14, true, 0)
				}
				else { // Block wasn't in direct skylight; subtract 1 from the brightest neighboring tile and use that as the new light level
					center = max(up, down, north, south, east, west)
					if (center > 0) center -= 1
					this.setLight(x, y, z, center, 0)
					if (center > 1) {
						spread.push(x, y, z)
						chunk.spreadLight(spread, center - 1, true, 0)
					}
				}

				// Block light levels
				if (!blockLight || blockLight < blight) {
					spread.length = 0
					up = this.getLight(x, y+1, z, 1)
					down = this.getLight(x, y-1, z, 1)
					north = this.getLight(x, y, z+1, 1)
					south = this.getLight(x, y, z-1, 1)
					east = this.getLight(x+1, y, z, 1)
					west = this.getLight(x-1, y, z, 1)
					blight = max(up, down, north, south, east, west)
					if (blight > 0) blight -= 1
					this.setLight(x, y, z, blight, 1)
					if (blight > 1) {
						spread.push(x, y, z)
						chunk.spreadLight(spread, blight - 1, true, 1)
					}
				}
			}
			else if (place && (center !== 0 || blight !== 0)) { // Block was placed; decrease light levels
				let respread = []
				for (let i = 0; i <= 15; i++) respread[i] = []
				chunk.setLight(cx, y, cz, 0) // Set both skylight and blocklight to 0
				spread.push(x, y, z)

				// Sky light
				if (center === 15) {
					for (let i = y-1; i > 0; i--) {
						if (_js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[chunk.getBlock(cx, i, cz)].transparent) {
							chunk.setSkyLight(cx, i, cz, 0)
							spread.push(x, i, z)
						}
						else {
							break
						}
					}
				}
				chunk.unSpreadLight(spread, center - 1, respread, 0)
				chunk.reSpreadLight(respread, 0)

				// Block light
				if (blight) {
					respread.length = 0
					// for (let i = 0; i <= blight + 1; i++) respread[i] = []
					for (let i = 0; i <= 15; i++) respread[i] = []
					spread.length = 0
					spread.push(x, y, z)
					chunk.unSpreadLight(spread, blight - 1, respread, 1)
					chunk.reSpreadLight(respread, 1)
				}
			}
			if (place && blockLight) { // Light block was placed
				chunk.setBlockLight(cx, y, cz, blockLight)
				spread.length = 0
				spread.push(x, y, z)
				chunk.spreadLight(spread, blockLight - 1, true, 1)
			}
			else if (!place && blockLight) { // Light block was removed
				chunk.setBlockLight(cx, y, cz, 0)
				spread.push(x, y, z)
				let respread = []
				for (let i = 0; i <= blockLight + 1; i++) respread[i] = []
				chunk.unSpreadLight(spread, blockLight - 1, respread, 1)
				chunk.reSpreadLight(respread, 1)
			}
		}
		spawnBlock(x, y, z, blockID) {
			// Sets a block anywhere without causing block updates around it. Only to be used in world gen.
			// Currently only used in chunk.populate()

			let chunk = this.loaded[((x >> 4) + this.offsetX) * this.lwidth + (z >> 4) + this.offsetZ]

			x &= 15
			z &= 15
			if (!chunk.getBlock(x, y, z)) {
				chunk.setBlock(x, y, z, blockID)
				// let i = x * 16 + z
				// if (y > chunk.tops[i]) chunk.tops[i] = y
				if (y > chunk.maxY) chunk.maxY = y
			}
		}
		async tick() {
			this.lastTick = performance.now()
			this.tickCount++
			if (this.tickCount & 1) {
				hud() // Update the HUD at 10 TPS
				renderChatAlerts()
			}

			let maxChunkX = (p.x >> 4) + settings.renderDistance
			let maxChunkZ = (p.z >> 4) + settings.renderDistance
			let chunk = maxChunkX + "," + maxChunkZ
			if (chunk !== this.lastChunk) {
				this.lastChunk = chunk
				this.loadChunks()
				this.chunkGenQueue.sort(sortChunks)
			}

			if (controlMap.breakBlock.pressed && (p.lastBreak < now - 250 || p.autoBreak) && screen === "play") {
				changeWorldBlock(0)
			}

			for (let i = 0; i < this.sortedChunks.length; i++) {
				this.sortedChunks[i].tick()
			}

			for (let i = this.entities.length - 1; i >= 0; i--) {
				const entity = this.entities[i]
				entity.update()
				if (entity.canDespawn) {
					this.entities.splice(i, 1)
				}
			}

			// Make sure there's only 1 "world gen" loop running at a time
			if (this.ticking) return
			this.ticking = true

			let doneWork = true
			while (doneWork && (screen === "play" || screen === "loading")) {
				doneWork = false
				debug.start = performance.now()
				if (this.meshQueue.length) {
					// Update all chunk meshes.
					do {
						this.meshQueue.pop().genMesh(indexBuffer, bigArray)
					} while(this.meshQueue.length)
					doneWork = true
					debug("Meshes")
				}

				if (this.generateQueue.length && !doneWork) {
					let chunk = this.generateQueue.pop()
					chunk.generate()
					doneWork = true
				}

				// Carve caves, then place trees
				if (this.populateQueue.length && !doneWork) {
					let chunk = this.populateQueue[this.populateQueue.length - 1]
					if (!chunk.caves) await chunk.carveCaves()
					else {
						chunk.populate(trees)
						this.populateQueue.pop()
					}
					doneWork = true
				}

				// All saved chunks are loaded, so spread light
				if (!doneWork && this.lightingQueue.length) {
					let chunk = this.lightingQueue.pop()
					chunk.fillLight()
					doneWork = true
				}

				if (!doneWork && this.chunkGenQueue.length && !this.lightingQueue.length) {
					let chunk = this.chunkGenQueue[0]
					if (!fillReqs(chunk.x >> 4, chunk.z >> 4)) {
						// The requirements haven't been filled yet; don't do anything else.
					}
					else if (!chunk.optimized) {
						chunk.optimize(screen)
						debug("Optimize")
					}
					else if (!chunk.buffer) {
						chunk.genMesh(indexBuffer, bigArray)
						debug("Initial mesh")
					}
					else {
						this.chunkGenQueue.shift()
						generatedChunks++
						if (generatedChunks === 3000) {
							let ms = Date.now() - this.initTime
							console.log("3000 chunk seconds:", ms/1000, "\nms per chunk:", ms / 3000, "\nChunks per second:", 3000000 / ms)
						}
					}
					doneWork = true
				}

				// Yield the main thread to render passes
				if (doneWork/* && screen !== "loading"*/) await window.yieldThread()
			}
			this.ticking = false
		}
		async load() {
			if (this.loading || !this.loadKeys.length) return
			this.loading = true

			do {
				let [cx, cz] = this.loadKeys.pop().split(",")
				cx = +cx
				cz = +cz

				this.loadChunks(cx, cz, false, 4)

				// Fill chunks with blocks
				for (let x = cx - 2; x <= cx + 2; x++) {
					for (let z = cz - 2; z <= cz + 2; z++) {
						let chunk = this.chunks[x][z]
						if (!chunk.generated) chunk.generate()
					}
				}

				// Fill them with caves
				if (caves) {
					let promises = []
					for (let x = cx - 1; x <= cx + 1; x++) {
						for (let z = cz - 1; z <= cz + 1; z++) {
							let chunk = this.chunks[x][z]
							if (!chunk.caves) promises.push(chunk.carveCaves())
						}
					}
					await Promise.all(promises)
				}
				else if (this.loadKeys % 50 === 0) await window.yieldThread() // Let the loading screen render if it needs to

				// Fill them with trees and ores
				for (let x = cx - 1; x <= cx + 1; x++) {
					for (let z = cz - 1; z <= cz + 1; z++) {
						let chunk = this.chunks[x][z]
						if (!chunk.populated) chunk.populate(trees)
					}
				}

				// Load blocks
				this.chunks[cx][cz].load()
			} while(this.loadKeys.length)
			this.loading = false
		}
		render() {
			// Was in tick(); moved here just for joseph lol
			if (controlMap.placeBlock.pressed && (p.lastPlace < now - 250 || p.autoBuild)) {
				lookingAt()
				newWorldBlock()
			}

			initModelView(p)
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			let time = 0
			if (multiplayer) time = Date.now()
			else time = this.tickCount * 50 + (performance.now() - this.lastTick) % 50

			p2.x = round(p.x)
			p2.y = round(p.y)
			p2.z = round(p.z)

			renderedChunks = 0

			let dist = Math.max(settings.renderDistance * 16 - 8, 16)
			if (this.chunkGenQueue.length) {
				let chunk = this.chunkGenQueue[0]
				dist = min(dist, chunkDist(chunk))
			}
			if (dist !== fogDist) {
				if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 30
				else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
				else fogDist = dist
			}

			gl.uniform3f(glCache.uPos, p.x, p.y, p.z)
			gl.uniform1f(glCache.uDist, fogDist)

			gl.useProgram(program3DFogless)
			gl.uniform3f(glCache.uPosFogless, p.x, p.y, p.z)

			let c = this.sortedChunks
			let glob = { renderedChunks }
			let fog = false
			for (let i = 0; i < c.length; i++) {
				if (!fog && fogDist < chunkDist(c[i]) + 24) {
					gl.useProgram(program3D)
					fog = true
				}
				c[i].render(p, glob)
			}

			skybox(time / 1000 + 150, matrix)
			use3d()
			gl.useProgram(program3DFogless)
			fog = false
			if (this.doubleRenderChunks.length) {
				gl.depthMask(false)
				gl.uniform1i(glCache.uTransFogless, 1)
				for (let chunk of this.doubleRenderChunks) {
					if (!fog && fogDist < chunkDist(chunk) + 24) {
						gl.uniform1i(glCache.uTransFogless, 0)
						gl.useProgram(program3D)
						gl.uniform1i(glCache.uTrans, 1)
						fog = true
					}
					chunk.render(p, glob)
				}
				if (!fog) gl.uniform1i(glCache.uTransFogless, 0)
				else gl.uniform1i(glCache.uTrans, 0)
				gl.depthMask(true)
			}

			renderedChunks = glob.renderedChunks

			gl.disableVertexAttribArray(glCache.aSkylight)
			gl.disableVertexAttribArray(glCache.aBlocklight)
			gl.disableVertexAttribArray(glCache.aShadow)
			// gl.uniform3f(glCache.uPos, 0, 0, 0)
			if (hitBox.pos) {
				blockOutlines = true
				blockFill = false
				block2(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], 0, p)
				blockOutlines = false
				blockFill = true
			}

			// Render entities
			gl.useProgram(programEntity)
			for (let i = this.entities.length - 1; i >= 0; i--) {
				const entity = this.entities[i]
				entity.render()
			}

			// Render players
			if (multiplayer) {
				for (let name in playerEntities) {
					const entity = playerEntities[name]
					// entity.update()
					entity.render()
				}
			}

			// gl.useProgram(program3D)
		}
		loadChunks(cx, cz, sort = true, renderDistance = settings.renderDistance + 3) {
			// let renderDistance = settings.renderDistance + 3
			cx ??= p.x >> 4
			cz ??= p.z >> 4
			p.cx = cx
			p.cz = cz
			let minChunkX = cx - renderDistance
			let maxChunkX = cx + renderDistance
			let minChunkZ = cz - renderDistance
			let maxChunkZ = cz + renderDistance

			this.offsetX = -minChunkX
			this.offsetZ = -minChunkZ
			this.lwidth = renderDistance * 2 + 1
			this.chunkGenQueue.length = 0
			this.lightingQueue.length = 0
			this.populateQueue.length = 0
			this.generateQueue.length = 0

			if (this.loaded.length > this.lwidth * this.lwidth) {
				this.loaded.length = this.lwidth * this.lwidth
			}

			let i = 0
			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let z = minChunkZ; z <= maxChunkZ; z++) {
					let chunk
					if (!this.chunks[x]) {
						this.chunks[x] = []
					}
					if (!this.chunks[x][z]) {
						this.chunks[x][z] = new _js_chunk_js__WEBPACK_IMPORTED_MODULE_19__.Chunk(x * 16, z * 16, this, glExtensions, gl, glCache, superflat, caves, trees)
					}
					chunk = this.chunks[x][z]
					const cdx = (chunk.x >> 4) - cx
					const cdz = (chunk.z >> 4) - cz
					chunk.distSq = cdx * cdx + cdz * cdz
					if (!chunk.buffer && renderFilter(chunk)) {
						this.chunkGenQueue.push(chunk)
					}
					this.loaded[i++] = chunk
				}
			}

			if (sort) {
				this.sortedChunks = this.loaded.filter(renderFilter)
				this.sortedChunks.sort(sortChunks)
				this.doubleRenderChunks = this.sortedChunks.filter(chunk => chunk.doubleRender)
			}
		}
		getSaveString() {
			let edited = []
			for (let x in this.chunks) {
				for (let z in this.chunks[x]) {
					let chunk = this.chunks[x][z]
					if (chunk.edited) {
						edited.push(chunk)
					}
				}
			}

			let blockSet = new Set()
			let sectionMap = {}
			for (let chunk of edited) {
				let changes = false
				let blocks = chunk.blocks
				let original = chunk.originalBlocks
				for (let i = 0; i < blocks.length; i++) {
					if (blocks[i] !== original[i]) {
						blockSet.add(blocks[i])
						changes = true
						let y = i >> 8
						let x = (i >> 4 & 15) + chunk.x
						let z = (i & 15) + chunk.z
						let str = `${x>>3},${y>>3},${z>>3}` // 8x8x8 sections
						if (!sectionMap[str]) {
							sectionMap[str] = []
							for (let i = 0; i < 6; i++) sectionMap[str].push(new Int16Array(8*8*8).fill(-1))
						}

						// 6 copies of the chunk, all oriented in different directions so we can see which one compresses the most
						sectionMap[str][0][(y & 7) << 6 | (x & 7) << 3 | z & 7] = blocks[i]
						sectionMap[str][1][(y & 7) << 6 | (z & 7) << 3 | x & 7] = blocks[i]
						sectionMap[str][2][(x & 7) << 6 | (y & 7) << 3 | z & 7] = blocks[i]
						sectionMap[str][3][(x & 7) << 6 | (z & 7) << 3 | y & 7] = blocks[i]
						sectionMap[str][4][(z & 7) << 6 | (x & 7) << 3 | y & 7] = blocks[i]
						sectionMap[str][5][(z & 7) << 6 | (y & 7) << 3 | x & 7] = blocks[i]
					}
				}
				if (!changes) {
					chunk.edited = false
				}
			}

			let blocks = Array.from(blockSet)
			let palette = {}
			blocks.forEach((block, index) => palette[block] = index)
			let paletteBits = _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayBuilder.bits(blocks.length)

			let ver = version.split(" ")[1].split(".").map(Number)

			let bab = new _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayBuilder()
			bab.add(this.name.length, 8)
			for (let c of this.name) bab.add(c.charCodeAt(0), 8)
			bab.add(worldSeed, 32)
			bab.add(this.tickCount, 32)
			bab.add(round(p.x), 20).add(Math.min(round(p.y), 255), 8).add(round(p.z), 20)
			bab.add(p.rx * 100, 11).add(p.ry * 100, 11)
			for (let block of inventory.hotbar) bab.add(block, 16)
			bab.add(inventory.hotbarSlot, 4)
			bab.add(p.flying, 1).add(p.spectator, 1)
			bab.add(superflat, 1).add(caves, 1).add(trees, 1)
			bab.add(ver[0], 8).add(ver[1], 8).add(ver[2], 8)
			bab.add(blocks.length, 16)
			for (let block of blocks) bab.add(block, 16)

			let sections = Object.entries(sectionMap)
			bab.add(sections.length, 32)
			for (let [coords, section] of sections) {
				let [sx, sy, sz] = coords.split(",").map(Number)
				bab.add(sx, 16).add(sy, 5).add(sz, 16)

				// Determine the most compact orientation by checking all 6!
				let bestBAB = null
				for (let i = 0; i < 6; i++) {
					let bab = new _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayBuilder()

					let blocks = section[i]
					bab.add(i, 3)

					let run = null
					let runs = []
					let singles = []
					for (let i = 0; i < blocks.length; i++) {
						const block = blocks[i]
						if (block >= 0) {
							if (!run && i < blocks.length - 2 && blocks[i + 1] >= 0 && blocks[i + 2] >= 0) {
								run = [i, []]
								runs.push(run)
							}
							if (run) {
								if (run[1].length && block === run[1].at(-1)[1]) run[1].at(-1)[0]++
								else run[1].push([1, block])
							}
							else singles.push([i, blocks[i]])
						}
						else run = null
					}

					bab.add(runs.length, 8)
					bab.add(singles.length, 9)
					for (let [start, blocks] of runs) {
						// Determine the number of bits needed to store the lengths of each block type
						let maxBlocks = 0
						for (let block of blocks) maxBlocks = Math.max(maxBlocks, block[0])
						let lenBits = _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayBuilder.bits(maxBlocks)

						bab.add(start, 9).add(blocks.length, 9).add(lenBits, 4)
						for (let [count, block] of blocks) bab.add(count - 1, lenBits).add(palette[block], paletteBits)
					}
					for (let [index, block] of singles) {
						bab.add(index, 9).add(palette[block], paletteBits)
					}
					if (!bestBAB || bab.bitLength < bestBAB.bitLength) {
						bestBAB = bab
					}
				}
				bab.append(bestBAB)
			}
			return bab.array
		}
		loadSave(data) {
			if (typeof data === "string") {
				if (data.includes("Alpha")) {
					try {
						return this.loadOldSave(data)
					}
					catch(e) {
						alert("Unable to load save string.")
					}
				}
				try {
					let bytes = atob(data)
					let arr = new Uint8Array(bytes.length)
					for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
					data = arr
				}
				catch(e) {
					alert("Malformatted save string. Unable to load")
					throw e
				}
			}

			let reader = new _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayReader(data)

			let nameLen = reader.read(8)
			this.name = ""
			for (let i = 0; i < nameLen; i++) this.name += String.fromCharCode(reader.read(8))
			setSeed(reader.read(32))
			this.tickCount = reader.read(32)

			p.x = reader.read(20, true)
			p.y = reader.read(8)
			p.z = reader.read(20, true)
			p.rx = reader.read(11, true) / 100
			p.ry = reader.read(11, true) / 100
			for (let i = 0; i < 9; i++) inventory.hotbar[i] = reader.read(16)
			inventory.hotbarSlot = reader.read(4)
			p.flying = reader.read(1)
			p.spectator = reader.read(1)

			superflat = reader.read(1)
			caves = reader.read(1)
			trees = reader.read(1)
			this.version = "Alpha " + [reader.read(8), reader.read(8), reader.read(8)].join(".")

			let paletteLen = reader.read(16)
			let palette = []
			let paletteBits = _js_utils_js__WEBPACK_IMPORTED_MODULE_12__.BitArrayBuilder.bits(paletteLen)
			for (let i = 0; i < paletteLen; i++) palette.push(reader.read(16))

			// sectionMap[str][0][(y & 7) << 6 | (x & 7) << 3 | z & 7] = blocks[i]
			// sectionMap[str][1][(y & 7) << 6 | (z & 7) << 3 | x & 7] = blocks[i]
			// sectionMap[str][2][(x & 7) << 6 | (y & 7) << 3 | z & 7] = blocks[i]
			// sectionMap[str][3][(x & 7) << 6 | (z & 7) << 3 | y & 7] = blocks[i]
			// sectionMap[str][4][(z & 7) << 6 | (x & 7) << 3 | y & 7] = blocks[i]
			// sectionMap[str][5][(z & 7) << 6 | (y & 7) << 3 | x & 7] = blocks[i]
			const getIndex = [
				(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 0 & 7),
				(index, x, y, z) => (y + (index >> 6 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 3 & 7),
				(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 0 & 7),
				(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 6 & 7))*16 + z + (index >> 3 & 7),
				(index, x, y, z) => (y + (index >> 0 & 7))*256 + (x + (index >> 3 & 7))*16 + z + (index >> 6 & 7),
				(index, x, y, z) => (y + (index >> 3 & 7))*256 + (x + (index >> 0 & 7))*16 + z + (index >> 6 & 7)
			]

			let sectionCount = reader.read(32)
			let chunks = {}
			for (let i = 0; i < sectionCount; i++) {
				let x = reader.read(16, true) * 8
				let y = reader.read(5, false) * 8
				let z = reader.read(16, true) * 8
				let orientation = reader.read(3)

				let cx = x >> 4
				let cz = z >> 4

				// Make them into local chunk coords
				x = x !== cx * 16 ? 8 : 0
				z = z !== cz * 16 ? 8 : 0

				let ckey = `${cx},${cz}`
				let chunk = chunks[ckey]
				if (!chunk) {
					chunk = []// new Int16Array(16*256*16).fill(-1)
					chunks[ckey] = chunk
				}
				let runs = reader.read(8)
				let singles = reader.read(9)
				for (let j = 0; j < runs; j++) {
					let index = reader.read(9)
					let types = reader.read(9)
					let lenSize = reader.read(4)
					for (let k = 0; k < types; k++) {
						let chain = reader.read(lenSize) + 1
						let block = reader.read(paletteBits)
						for (let l = 0; l < chain; l++) {
							chunk[getIndex[orientation](index, x, y, z)] = palette[block]
							index++
						}
					}
				}
				for (let j = 0; j < singles; j++) {
					let index = reader.read(9)
					let block = reader.read(paletteBits)
					chunk[getIndex[orientation](index, x, y, z)] = palette[block]
				}
			}

			this.loadFrom = chunks
			this.loadKeys = Object.keys(chunks)
			// for (let pos in chunks) {
			// 	let [x, z] = pos.split(",")
			// 	this.loadFrom.push({
			// 		x: +x,
			// 		y: 0,
			// 		z: +z,
			// 		blocks: chunks[pos]
			// 	})
			// }
		}
		loadOldSave(str) {
			let data = str.split(";")

			this.name = data.shift()
			setSeed(parseInt(data.shift(), 36))

			let playerData = data.shift().split(",")
			p.x = parseInt(playerData[0], 36)
			p.y = parseInt(playerData[1], 36)
			p.z = parseInt(playerData[2], 36)
			p.rx = parseInt(playerData[3], 36) / 100
			p.ry = parseInt(playerData[4], 36) / 100
			let options = parseInt(playerData[5], 36)
			p.flying = options & 1
			p.spectator = options >> 2 & 1
			superflat = options >> 1 & 1
			caves = options >> 3 & 1
			trees = options >> 4 & 1

			let version = data.shift()
			this.version = version

			let palette = data.shift().split(",").map(n => parseInt(n, 36))
			let chunks = {}

			for (let i = 0; data.length; i++) {
				let blocks = data.shift().split(",")
				let cx = parseInt(blocks.shift(), 36)
				let cy = parseInt(blocks.shift(), 36)
				let cz = parseInt(blocks.shift(), 36)
				let str = `${cx},${cz}`
				if (!chunks[str]) chunks[str] = []
				let chunk = chunks[str]
				for (let j = 0; j < blocks.length; j++) {
					let block = parseInt(blocks[j], 36)
					// Old index was 0xXYZ, new index is 0xYYXZ
					let x = block >> 8 & 15
					let y = block >> 4 & 15
					let z = block & 15
					let index = (cy * 16 + y) * 256 + x * 16 + z
					let pid = block >> 12

					chunk[index] = palette[pid]
				}
			}

			this.loadFrom = chunks
			this.loadKeys = Object.keys(chunks)
		}
	}

	let controls = function() {
		move.x = 0
		move.z = 0

		if(controlMap.walkForwards.pressed) move.z += p.speed
		if(controlMap.walkBackwards.pressed) move.z -= p.speed
		if(controlMap.strafeLeft.pressed) move.x += p.speed
		if(controlMap.strafeRight.pressed) move.x -= p.speed
		if (p.flying) {
			if(controlMap.jump.pressed) p.velocity.y += 0.1
			if(controlMap.sneak.pressed) p.velocity.y -= 0.1
		}
		if(Key.ArrowLeft) p.ry -= 0.15
		if(Key.ArrowRight) p.ry += 0.15
		if(Key.ArrowUp) p.rx += 0.15
		if(Key.ArrowDown) p.rx -= 0.15

		if (!p.sprinting && controlMap.sprint.pressed && !p.sneaking && controlMap.walkForwards.pressed) {
			p.FOV(settings.fov + 10, 250)
			p.sprinting = true
		}

		if(p.sprinting) {
			move.x *= p.sprintSpeed
			move.z *= p.sprintSpeed
		}
		if(p.flying) {
			move.x *= p.flySpeed
			move.z *= p.flySpeed
		}
		if (!move.x && !move.z) {
			if (p.sprinting) {
				p.FOV(settings.fov, 100)
			}
			p.sprinting = false
		}
		else if(abs(move.x) > 0 && abs(move.z) > 0) {
			move.x *= move.ang
			move.z *= move.ang
		}

		// Update the velocity, rather than the position.
		let co = cos(p.ry)
		let si = sin(p.ry)
		let friction = p.onGround ? 1 : 0.3
		p.velocity.x += (co * move.x - si * move.z) * friction
		p.velocity.z += (si * move.x + co * move.z) * friction

		const TAU = Math.PI * 2
		const PI1_2 = Math.PI / 2
		while(p.ry > TAU) p.ry -= TAU
		while(p.ry < 0)   p.ry += TAU
		if(p.rx > PI1_2)  p.rx = PI1_2
		if(p.rx < -PI1_2) p.rx = -PI1_2
	}

	class Slider {
		constructor(x, y, w, h, scenes, label, min, max, settingName, callback) {
			this.x = x
			this.y = y
			this.h = h
			this.w = Math.max(w, 350)
			this.name = settingName
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.label = label
			this.min = min
			this.max = max
			this.sliding = false
			this.callback = callback
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let current = (settings[this.name] - this.min) / (this.max - this.min)

			// Outline
			ctx.beginPath()
			strokeWeight(2)
			stroke(0)
			fill(85)
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			// Slider bar
			let value = round(settings[this.name])
			ctx.beginPath()
			fill(130)
			let x = this.x - (this.w - 10) / 2 + (this.w - 10) * current - 5
			ctx.fillRect(x, this.y - this.h / 2, 10, this.h)

			// Label
			fill(255, 255, 255)
			textSize(16)
			ctx.textAlign = 'center'
			text(`${this.label}: ${value}`, this.x, this.y + this.h / 8)
		}
		click() {
			if (!mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
				let current = (mouseX - this.x + this.w / 2) / this.w
				if (current < 0) current = 0
				if (current > 1) current = 1
				this.sliding = true
				settings[this.name] = current * (this.max - this.min) + this.min
				this.callback(current * (this.max - this.min) + this.min)
				this.draw()
			}
		}
		drag() {
			if (!this.sliding || !this.scenes.includes(screen)) {
				return false
			}

			let current = (mouseX - this.x + this.w / 2) / this.w
			if (current < 0) current = 0
			if (current > 1) current = 1
			settings[this.name] = current * (this.max - this.min) + this.min
			this.callback(current * (this.max - this.min) + this.min)
		}
		release() {
			this.sliding = false
		}

		static draw() {
			for (let slider of Slider.all) {
				slider.draw()
			}
		}
		static click() {
			for (let slider of Slider.all) {
				slider.click()
			}
		}
		static release() {
			for (let slider of Slider.all) {
				slider.release()
			}
		}
		static drag() {
			if (mouseDown) {
				for (let slider of Slider.all) {
					slider.drag()
				}
			}
		}
		static add(x, y, w, h, scenes, label, min, max, defaut, callback) {
			Slider.all.push(new Slider(x, y, w, h, scenes, label, min, max, defaut, callback))
		}
	}
	Slider.all = []
	class Button {
		constructor(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			this.x = x
			this.y = y
			this.h = h
			this.w = w
			this.index = 0
			this.disabled = disabled || (() => false)
			this.hoverText = !hoverText || typeof hoverText === "string" ? () => hoverText : hoverText
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.labels = Array.isArray(labels) ? labels : [labels]
			this.callback = callback
		}

		mouseIsOver() {
			return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let hovering = this.mouseIsOver()
			let disabled = this.disabled()
			let hoverText = this.hoverText()

			// Outline
			ctx.beginPath()
			if (hovering && !disabled) {
				strokeWeight(7)
				stroke(255)
				cursor(HAND)
			}
			else {
				strokeWeight(3)
				stroke(0)
			}
			if (disabled) {
				fill(60)
			}
			else {
				fill(120)
			}
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			// Label
			fill(255)
			textSize(16)
			ctx.textAlign = 'center'
			text(this.labels[this.index], this.x, this.y + this.h / 8)

			if (hovering && hoverText) {
				hoverbox.innerText = hoverText
				hoverbox.classList.remove("hidden")
				if (mouseY < height / 2) {
					hoverbox.style.bottom = ""
					hoverbox.style.top = mouseY + 10 + "px"
				}
				else {
					hoverbox.style.top = ""
					hoverbox.style.bottom = height - mouseY + 10 + "px"
				}
				if (mouseX < width / 2) {
					hoverbox.style.right = ""
					hoverbox.style.left = mouseX + 10 + "px"
				}
				else {
					hoverbox.style.left = ""
					hoverbox.style.right = width - mouseX + 10 + "px"
				}
			}
		}
		click() {
			if (this.disabled() || !mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (this.mouseIsOver()) {
				this.index = (this.index + 1) % this.labels.length
				this.callback(this.labels[this.index])
				return true
			}
		}

		static draw() {
			hoverbox.classList.add("hidden")
			for (let button of Button.all) {
				button.draw()
			}
		}
		static click() {
			for (let button of Button.all) {
				if (button.click()) {
					Button.draw()
					break
				}
			}
		}
		static add(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			Button.all.push(new Button(x, y, w, h, labels, scenes, callback, disabled, hoverText))
		}
	}
	Button.all = []

	function initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true
		let survival = false

		// Main menu buttons
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "main menu", () => {
			initWorldsMenu()
			changeScene("loadsave menu")
		})
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "main menu", () => {
			initMultiplayerMenu()
			changeScene("multiplayer menu")
		}, () => !location.href.startsWith("https://willard.fun"), "Please visit https://willard.fun/login to enjoy multiplayer.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "main menu", () => changeScene("options"))

		// Creation menu buttons
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creation menu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Trees: On", "Trees: Off"], "creation menu", r => trees = r === "Trees: On", function() {
			if (superflat) {
				this.index = 1
				trees = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creation menu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		Button.add(width / 2, 285, 300, 40, ["Game Mode: Creative", "Game Mode: Survival"], "creation menu", r => survival = r === "Game Mode: Survival")
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creation menu", nothing, always, "Coming soon\n\nPlease stop asking for mobs. Adding them will take a very long time. I know a lot of people want them, so just be patient.")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creation menu", () => {
			if (survival) {
				window.open("https://www.minecraft.net/en-us/store/minecraft-java-edition", "_blank")
				return
			}
			world = new World()
			world.id = "" + now + (Math.random() * 1000000 | 0)
			let name = boxCenterTop.value || "World"
			let number = ""
			let naming = true
			while(naming) {
				let match = false
				for (let id in worlds) {
					if (worlds[id].name === name + number) {
						match = true
						break
					}
				}
				if (match) {
					number = number ? number + 1 : 1
				}
				else {
					name = name + number
					naming = false
				}
			}
			world.name = name
			win.world = world
			world.loadChunks()
			world.chunkGenQueue.sort(sortChunks)
			changeScene("loading")
		})
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creation menu", () => changeScene(previousScreen))

		// Loadsave menu buttons
		const selected = () => !selectedWorld || !worlds[selectedWorld]
		let w4 = min(width / 4 - 10, 220)
		let x4 = w4 / 2 + 5
		let w2 = min(width / 2 - 10, 450)
		let x2 = w2 / 2 + 5
		let mid = width / 2
		Button.add(mid - 3 * x4, height - 30, w4, 40, "Edit", "loadsave menu", () => changeScene("editworld"), () => selected() || !worlds[selectedWorld].edited)
		Button.add(mid - x4, height - 30, w4, 40, "Delete", "loadsave menu", () => {
			if (worlds[selectedWorld] && confirm(`Are you sure you want to delete ${worlds[selectedWorld].name}? This will also delete it from the cloud.`)) {
				(0,_js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.deleteFromDB)(selectedWorld)
				window.worlds.removeChild(document.getElementById(selectedWorld))
				delete worlds[selectedWorld]
				if (location.href.startsWith("https://willard.fun/")) fetch(`https://willard.fun/minekhan/saves/${selectedWorld}`, { method: "DELETE" })
				selectedWorld = 0
			}
		}, () => selected() || !worlds[selectedWorld].edited, "Delete the world forever.")
		Button.add(mid + x4, height - 30, w4, 40, "Export", "loadsave menu", () => {
			boxCenterTop.value = worlds[selectedWorld].code
		}, selected, "Export the save code into the text box above for copy/paste.")
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "loadsave menu", () => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "loadsave menu", async () => {
			world = new World(true)
			win.world = world

			let code
			if (!selectedWorld) {
				code = boxCenterTop.value
			}
			else {
				let data = worlds[selectedWorld]
				if (data) {
					world.id = data.id
					world.edited = data.edited
					if (data.code) code = data.code
					else {
						let cloudWorld = await fetch(`https://willard.fun/minekhan/saves/${selectedWorld}`).then(res => {
							if (res.headers.get("content-type") === "application/octet-stream") return res.arrayBuffer().then(a => new Uint8Array(a))
							else return res.text()
						})
						code = cloudWorld
					}
				}
			}

			if (code) {
				try {
					world.loadSave(code)
					world.id = world.id || "" + now + (Math.random() * 1000000 | 0)
				}
				catch(e) {
					alert("Unable to load save")
					return
				}
				changeScene("loading")
			}
		}, () => !(!selectedWorld && boxCenterTop.value) && !worlds[selectedWorld])
		Button.add(mid + x2, height - 75, w2, 40, "Create New World", "loadsave menu", () => changeScene("creation menu"))

		Button.add(mid, height / 2, w2, 40, "Save", "editworld", () => {
			let w = worlds[selectedWorld]
			if (typeof w.code === "string") {
				// Legacy world saves
				w.name = boxCenterTop.value.replace(/;/g, "\u037e")
				let split = w.code.split(";")
				split[0] = w.name
				w.code = split.join(";")
			}
			else {
				let oldLength = w.name.length
				w.name = boxCenterTop.value.slice(0, 256)
				let newLength = w.name.length
				let newCode = new Uint8Array(w.code.length + newLength - oldLength)
				newCode[0] = newLength
				for (let i = 0; i < newLength; i++) newCode[i + 1] = w.name.charCodeAt(i) & 255
				let newIndex = newLength + 1
				let oldIndex = oldLength + 1
				while (newIndex < newCode.length) {
					newCode[newIndex++] = w.code[oldIndex++]
				}
				w.code = newCode
			}

			(0,_js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.saveToDB)(w.id, w).then(() => {
				initWorldsMenu()
				changeScene("loadsave menu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", () => changeScene(previousScreen))

		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", () => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, nothing, () => `Save the world to your browser + account. Doesn't work in incognito.\n\nLast saved ${(0,_js_utils_js__WEBPACK_IMPORTED_MODULE_12__.timeString)(now - world.edited)}.`)
		Button.add(width / 2, 375, 300, 40, "Get Save Code", "pause", () => {
			savebox.classList.remove("hidden")
			saveDirections.classList.remove("hidden")
			savebox.value = world.getSaveString()
		})
		Button.add(width / 2, 425, 300, 40, "Open World To Public", "pause", () => {
			initMultiplayer()
		}, () => !!multiplayer || !location.href.startsWith("https://willard.fun"))
		Button.add(width / 2, 475, 300, 40, "Exit Without Saving", "pause", () => {
			// savebox.value = world.getSaveString()
			if (multiplayer) {
				multiplayer.close()
			}
			initWorldsMenu()
			changeScene("main menu")
			world = null
		})

		// Options buttons
		Button.add(width / 2, 500, width / 3, 40, "Back", "options", () => changeScene(previousScreen))

		// Comingsoon menu buttons
		Button.add(width / 2, 395, width / 3, 40, "Back", "comingsoon menu", () => changeScene(previousScreen))

		// Multiplayer buttons
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "multiplayer menu", () => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "multiplayer menu", () => {
			world = new World()
			win.world = world

			if (selectedWorld) {
				initMultiplayer(selectedWorld)
			}
		}, () => !selectedWorld)

		// Settings Sliders
		Slider.add(width/2, 245, width / 3, 40, "options", "Render Distance", 1, 32, "renderDistance", val => settings.renderDistance = round(val))
		Slider.add(width/2, 305, width / 3, 40, "options", "FOV", 30, 110, "fov", val => {
			p.FOV(val)
			if (world) {
				p.setDirection()
				world.render()
			}
		})
		Slider.add(width/2, 365, width / 3, 40, "options", "Mouse Sensitivity", 30, 400, "mouseSense", val => settings.mouseSense = val)
		Slider.add(width/2, 425, width / 3, 40, "options", "Reach", 5, 100, "reach", val => settings.reach = val)
	}

	function hotbar(highlight = inventory.hotbarSlot) {
		if (p.spectator || screen !== "play" && screen !== "inventory") return
		// If the hotbar needs to be rendered, then the selected block may have changed
		{
			let heldLight = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[inventory.hotbar[inventory.hotbarSlot]].lightLevel / 15 || 0
			gl.useProgram(program3D)
			gl.uniform1f(glCache.uLantern, heldLight)
			gl.useProgram(program3DFogless)
			gl.uniform1f(glCache.uLanternFogless, heldLight)
		}


		let s = inventory.size
		let x = width / 2 - 9 / 2 * s + 0.5 + 25
		let y = height - s * 1.5 + 0.5

		ctx.clearRect(x - 2, y - 2, 9 * s + 4, s + 4)
		for(let i = 0; i < inventory.hotbar.length; i ++) {
			if (inventory.hotbar[i]) {
				drawIcon(x + i * s, y, inventory.hotbar[i])
			}
		}

		ctx.strokeStyle = "black"
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + s * 9, y)
		ctx.moveTo(x, y + s)
		ctx.lineTo(x + s * 9, y + s)
		for(let i = 0; i <= 9; i++) {
			ctx.moveTo(x + i * s, y)
			ctx.lineTo(x + i * s, y + s)
		}
		ctx.stroke()

		ctx.strokeStyle = "white"
		ctx.lineWidth = 2
		ctx.beginPath()

		if (highlight >= 0) ctx.strokeRect(width / 2 - 9 / 2 * s + highlight * s + 25, height - s * 1.5, s, s)
	}

	function crosshair() {
		if (p.spectator) return
		let x = width / 2 + 0.5
		let y = height / 2 + 0.5
		ctx.lineWidth = 1
		ctx.strokeStyle = "white"
		ctx.beginPath()
		ctx.moveTo(x - 10, y)
		ctx.lineTo(x + 10, y)
		ctx.moveTo(x, y - 10)
		ctx.lineTo(x, y + 10)
		ctx.stroke()
	}

	let debugLines = []
	let newDebugLines = []
	function hud(clear) {
		if (p.spectator || screen !== "play") return
		if (clear) debugLines.length = 0

		textSize(20)
		let x = 5
		let lineHeight = 24
		let y = lineHeight + 3
		let heightOffset = floor(lineHeight / 5)

		let lines = 0
		if (settings.showDebug === 3) {
			newDebugLines[0] = "Press F3 to cycle debug info."
			lines = 1
		}
		else {
			if (settings.showDebug >= 1) {
				newDebugLines[lines++] = analytics.fps + "/" + analytics.displayedwFps + "fps, C: " + renderedChunks.toLocaleString()
				newDebugLines[lines++] = "XYZ: " + p2.x + ", " + p2.y + ", " + p2.z
			}
			if (settings.showDebug >= 2) {
				newDebugLines[lines++] = "Average Frame Time: " + analytics.displayedFrameTime + "ms"
				newDebugLines[lines++] = "Worst Frame Time: " + analytics.displayedwFrameTime + "ms"
				newDebugLines[lines++] = "Render Time: " + analytics.displayedRenderTime + "ms"
				newDebugLines[lines++] = "Tick Time: " + analytics.displayedTickTime + "ms"
				newDebugLines[lines++] = "Generated Chunks: " + generatedChunks.toLocaleString()
			}
		}
		if (p.autoBreak) newDebugLines[lines++] = "Super breaker enabled"
		if (p.autoBuild) newDebugLines[lines++] = "Hyper builder enabled"
		if (multiplayer) {
			playerDistances.length = 0
			let closest = Infinity
			let cname = "Yourself"
			for (let name in playerPositions) {
				let pos = playerPositions[name]
				let distance = sqrt((pos.x - p2.x)*(pos.x - p2.x) + (pos.y - p2.y)*(pos.y - p2.y) + (pos.z - p2.z)*(pos.z - p2.z))
				playerDistances.push({
					name,
					distance
				})
				if (distance < closest) {
					closest = distance
					cname = name
				}
			}
			newDebugLines[lines++] = `Closest player: ${cname} (${round(closest)} blocks away)`
		}

		// Draw updated text
		ctx.textAlign = 'left'
		for (let i = 0; i < lines; i++) {
			if (debugLines[i] !== newDebugLines[i]) {
				let start = 0
				if (debugLines[i]) {
					for (let j = 0; j < debugLines[i].length; j++) {
						if (debugLines[i][j] !== newDebugLines[i][j]) {
							start = j
							break
						}
					}
					ctx.clearRect(x + start * charWidth, y + lineHeight * (i - 1) + heightOffset, (debugLines[i].length - start) * charWidth, lineHeight)
				}
				ctx.fillStyle = "rgba(50, 50, 50, 0.4)"
				ctx.fillRect(x + start * charWidth, y + lineHeight * (i-1) + heightOffset, (newDebugLines[i].length - start) * charWidth, lineHeight)
				ctx.fillStyle = "#fff"
				ctx.fillText(newDebugLines[i].slice(start), x + start*charWidth, y + lineHeight * i)
				debugLines[i] = newDebugLines[i]
			}
		}

		// Remove extra lines
		if (lines < debugLines.length) {
			let maxWidth = 0
			for (let i = lines; i < debugLines.length; i++) {
				maxWidth = Math.max(maxWidth, debugLines[i].length)
			}
			ctx.clearRect(x, y + (lines - 1) * lineHeight + heightOffset, maxWidth * charWidth, lineHeight * (debugLines.length - lines))
			debugLines.length = lines
		}

		// "Block light (head): " + world.getLight(p2.x, p2.y, p2.z, 1) + "\n"
		// + "Sky light (head): " + world.getLight(p2.x, p2.y, p2.z, 0) + "\n"

		// let str = "Average Frame Time: " + analytics.displayedFrameTime + "ms\n"
		// + "Worst Frame Time: " + analytics.displayedwFrameTime + "ms\n"
		// + "Render Time: " + analytics.displayedRenderTime + "ms\n"
		// + "Tick Time: " + analytics.displayedTickTime + "ms\n"
		// + "Rendered Chunks: " + renderedChunks.toLocaleString() + " / " + world.sortedChunks.length + "\n"
		// + "Generated Chunks: " + generatedChunks.toLocaleString() + "\n"
		// + "FPS: " + analytics.fps

		// if (p.autoBreak) {
		// 	text("Super breaker enabled", 5, height - 89, 12)
		// }
		// if (p.autoBuild) {
		// 	text("Hyper builder enabled", 5, height - 101, 12)
		// }

		// ctx.textAlign = 'right'
		// text(p2.x + ", " + p2.y + ", " + p2.z, width - 10, 15, 0)
		// ctx.textAlign = 'left'
		// text(str, 5, height - 77, 12)
	}
	function drawInv() {
		let x = 0
		let y = 0
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13

		ctx.fillStyle = "rgba(127, 127, 127, 0.4)"
		ctx.clearRect(0, 0, width, height)
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		// Draw the blocks
		for (let i = 1; i < _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT; i++) {
			x = (i - 1) % perRow * s + 51
			y = ((i - 1) / perRow | 0) * s + 51
			drawIcon(x - s2, y - s2, i)
		}

		// Draw the grid
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.beginPath()
		for (y = 0; y < 10; y++) {
			ctx.moveTo(50.5 - s2, 50.5 - s2 + y * s)
			ctx.lineTo(50.5 - s2 + s * perRow, 50.5 - s2 + y * s)
		}
		y--
		for (x = 0; x < perRow + 1; x++) {
			ctx.moveTo(50.5 - s2 + s * x, 50.5 - s2)
			ctx.lineTo(50.5 - s2 + s * x, 50.5 - s2 + y * s)
		}
		ctx.stroke()

		// Hotbar
		x = width / 2 - 9 / 2 * s + 0.5 + 25
		y = height - s * 1.5 + 0.5
		let drawName = false
		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			drawName = true
			hotbar(overHot)
		}
		else hotbar(-1)

		// Box highlight in inv
		let overInv = round((mouseY - 50) / s) * perRow + round((mouseX - 50) / s)
		if (overInv >= 0 && overInv < _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			drawName = true
			x = overInv % perRow * s + 50 - s2
			y = (overInv / perRow | 0) * s + 50 - s2
			ctx.lineWidth = 2
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.strokeRect(x, y, s, s)
		}
		else overInv = inventory.hotbar[overHot] - 1

		// Item you're dragging
		if (inventory.holding) {
			drawIcon(mouseX - s2, mouseY - s2, inventory.holding)
		}

		// Tooltip for the item you're hovering over
		if (drawName) {
			let name = _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.blockData[overInv + 1].name.replace(/[A-Z]/g, " $&").replace(/./, c => c.toUpperCase())
			ctx.fillStyle = "black"
			ctx.fillRect(mouseX - 3, mouseY - 20, name.length * 6 + 6, 15)
			ctx.fillStyle = "white"
			ctx.fillText(name, mouseX, mouseY - 10)
		}
	}
	function clickInv() {
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13
		let over = round((mouseY - 50) / s) * perRow + round((mouseX - 50) / s)
		let x = width / 2 - 9 / 2 * s + 25
		let y = height - s * 1.5
		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			let temp = inventory.hotbar[overHot]
			inventory.hotbar[overHot] = inventory.holding
			inventory.holding = temp
		}
		else if (over >= 0 && over < _js_blockData_js__WEBPACK_IMPORTED_MODULE_13__.BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			inventory.holding = over + 1
		}
		else {
			inventory.holding = 0
		}

		drawScreens.inventory()
	}

	let unpauseDelay = 0
	function mmoved(e) {
		let mouseS = settings.mouseSense / 30000
		p.rx -= e.movementY * mouseS
		p.ry += e.movementX * mouseS

		while(p.ry > Math.PI*2) {
			p.ry -= Math.PI*2
		}
		while(p.ry < 0) {
			p.ry += Math.PI*2
		}
		if(p.rx > Math.PI / 2) {
			p.rx = Math.PI / 2
		}
		if(p.rx < -Math.PI / 2) {
			p.rx = -Math.PI / 2
		}
	}
	function trackMouse(e) {
		if (screen !== "play") {
			cursor("")
			mouseX = e.x
			mouseY = e.y
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
			Slider.drag()
		}
	}

	// For user controls that react immediately in the event handlers.
	function controlEvent(name, event) {
		if (name === controlMap.cycleBlockShapes.key) {
			blockMode = blockMode === CUBE ? SLAB : blockMode === SLAB ? STAIR : CUBE
			hotbar()
		}

		if(screen === "play") {
			if (document.pointerLockElement !== canvas) {
				getPointer()
				p.lastBreak = now
			}
			else {
				if (name === controlMap.breakBlock.key) {
					changeWorldBlock(0)
				}

				// holding = inventory.hotbar[inventory.hotbarSlot]
				if(name === controlMap.placeBlock.key && holding) {
					newWorldBlock()
				}

				if (name === controlMap.pickBlock.key && hitBox.pos) {
					let block = world.getBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2]) & 0x3ff
					let index = inventory.hotbar.indexOf(block)
					if (index >= 0) {
						inventory.hotbarSlot = index
					}
					else {
						inventory.hotbar[inventory.hotbarSlot] = block
					}
					holding = inventory.hotbar[inventory.hotbarSlot]
					hotbar()
				}

				if(name === controlMap.pause.key) {
					releasePointer()
					changeScene("pause")
				}

				if (name === controlMap.openChat.key) {
					event.preventDefault()
					changeScene("chat")
				}
				if (name === "Slash") {
					changeScene("chat")
					chatInput.value = "/"
				}

				if(name === controlMap.superBreaker.key) {
					p.autoBreak = !p.autoBreak
					hud()
				}

				if(name === controlMap.hyperBuilder.key) {
					p.autoBuild = !p.autoBuild
					hud()
				}

				if (name === controlMap.jump.key && !p.spectator) {
					if (now < p.lastJump + 400) {
						p.flying = !p.flying
					}
					else {
						p.lastJump = now
					}
				}

				if (name === controlMap.zoom.key) {
					p.FOV(10, 300)
				}

				if (name === controlMap.sneak.key && !p.flying) {
					p.sneaking = true
					if (p.sprinting) {
						p.FOV(settings.fov, 100)
					}
					p.sprinting = false
					p.speed = 0.05
					p.bottomH = 1.32
				}

				if (name === controlMap.toggleSpectator.key) {
					p.spectator = !p.spectator
					p.flying = true
					p.onGround = false
					if (!p.spectator) {
						hotbar()
						crosshair()
						hud(true)
					}
					else {
						ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
					}
				}

				if (name === controlMap.openInventory.key) {
					changeScene("inventory")
					releasePointer()
				}

				if (name === "Semicolon") {
					releasePointer()
					freezeFrame = now + 500
				}

				if (name === "F3") {
					settings.showDebug = (settings.showDebug + 1) % 3
					hud()
				}

				// Drop held item; this just crashes since I broke Item entities.
				// if (name === controlMap.dropItem.key) {
				// 	let d = p.direction
				// 	world.entities.push(new Item(p.x, p.y, p.z, d.x/4, d.y/4, d.z/4, holding || inventory.hotbar[inventory.hotbarSlot], glExtensions, gl, glCache, indexBuffer, world, p))
				// }
			}
		}
		else if (screen === "pause" && name === controlMap.pause.key) {
			play()
		}
		else if (screen === "inventory") {
			if (name === "leftMouse") {
				clickInv()
			}
			if (name === controlMap.openInventory.key) {
				play()
			}
			if (name === controlMap.cycleBlockShapes.key) {
				drawScreens.inventory()
			}
		}
	}
	document.onmousemove = trackMouse
	document.onpointerlockchange = function() {
		if (document.pointerLockElement === canvas) {
			document.onmousemove = mmoved
		}
		else {
			document.onmousemove = trackMouse
			if (screen === "play" && now > freezeFrame) {
				changeScene("pause")
				unpauseDelay = now + 500
			}
		}
		for (let key in Key) {
			Key[key] = false
		}
	}
	canvas.onmousedown = function(e) {
		mouseX = e.x
		mouseY = e.y
		mouseDown = true
		let name
		switch(e.button) {
			case 0:
				if (Key.ControlRight || Key.ControlLeft) name = "rightMouse"
				else name = "leftMouse"
				break
			case 1:
				name = "middleMouse"
				break
			case 2:
				name = "rightMouse"
				break
		}
		Key[name] = true
		controlEvent(name)

		Button.click()
		Slider.click()
	}
	canvas.onmouseup = function(e) {
		let name
		switch(e.button) {
			case 0:
				if (Key.ControlRight || Key.ControlLeft) name = "rightMouse"
				else name = "leftMouse"
				break
			case 1:
				name = "middleMouse"
				break
			case 2:
				name = "rightMouse"
				break
		}
		Key[name] = false
		mouseDown = false
		Slider.release()
	}
	canvas.onkeydown = function(e) {
		let code = e.code
		// code === "Space" || code === "ArrowDown" || code === "ArrowUp" || code === "F3") {
		if (!Key.ControlLeft && !Key.ControlRight && code !== "F12" && code !== "F11") {
			e.preventDefault()
		}
		if (e.repeat || Key[code]) {
			return
		}
		Key[code] = true

		controlEvent(code, e)

		if (screen === "play" && Number(e.key)) {
			inventory.hotbarSlot = e.key - 1
			holding = inventory.hotbar[inventory.hotbarSlot]
			hotbar()
		}
	}
	canvas.onkeyup = function(e) {
		Key[e.code] = false
		if(e.code === "Escape" && (screen === "chat" || screen === "pause" || screen === "inventory" || screen === "options" && previousScreen === "pause") && now > unpauseDelay) {
			play()
		}
		if (screen === "play") {
			if (e.code === controlMap.zoom.key) {
				p.FOV(settings.fov, 300)
			}

			if (e.code === controlMap.sneak.key && p.sneaking) {
				p.sneaking = false
				p.speed = 0.11
				p.bottomH = 1.62
			}
		}
	}
	canvas.onblur = function() {
		for (let key in Key) {
			Key[key] = false
		}
		mouseDown = false
		Slider.release()
	}
	canvas.oncontextmenu = function(e) {
		e.preventDefault()
	}
	window.onbeforeunload = e => {
		if (screen === "play" && Key.control) {
			releasePointer()
			e.preventDefault()
			e.returnValue = "Q is the sprint button; Ctrl + W closes the page."
			return true
		}
	}
	canvas.onwheel = e => {
		e.preventDefault()
		e.stopPropagation()
		if (e.deltaY > 0) {
			inventory.hotbarSlot++
		}
		else if (e.deltaY < 0) {
			inventory.hotbarSlot--
		}
		if (inventory.hotbarSlot > 8) {
			inventory.hotbarSlot = 0
		}
		else if (inventory.hotbarSlot < 0) {
			inventory.hotbarSlot = 8
		}

		holding = inventory.hotbar[inventory.hotbarSlot]
		hotbar()
	}
	document.onwheel = () => {} // Shouldn't do anything, but it helps with a Khan Academy bug somewhat
	window.onresize = () => {
		width = window.innerWidth
		height = window.innerHeight
		canvas.height = height
		canvas.width = width
		gl.canvas.height = height
		gl.canvas.width = width
		gl.viewport(0, 0, width, height)
		initButtons()
		initBackgrounds()
		let oldSize = inventory.size
		inventory.size = 40 * min(width, height) / 600
		if (oldSize !== inventory.size) genIcons()
		use3d()
		p.FOV(p.currentFov + 0.0001)

		if (screen === "play") {
			play()
		}
		else {
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
		}
	}
	chatInput.oninput = () => {
		if (chatInput.value.length > 512) chatInput.value = chatInput.value.slice(0, 512)
	}
	chatInput.onkeyup = e => {
		if (e.key === "Enter") {
			let msg = chatInput.value.trim()
			if (msg) {
				e.preventDefault()
				e.stopPropagation()
				if (msg.startsWith("/")) {
					sendCommand(msg)
				}
				else {
					sendChat(msg)
				}
				chatInput.value = ""
			}
			else {
				play()
			}
		}
		else {
			let msg = chatInput.value
			if (msg.startsWith("/")) {
				let words = msg.split(" ")
				if (words.length > 1) {
					let cmd = words[0].slice(1)
					if (commands.has(cmd)) commands.get(cmd).autocomplete(msg)
				}
				else {
					let possible = commandList.filter(name => name.startsWith(msg))
					if (possible.length === 1) commands.get(possible[0].slice(1)).autocomplete(msg)
					else setAutocomplete(commandList)
				}
			}
		}
	}
	document.onkeyup = e => {
		if (e.key === "Escape" && screen === "chat") {
			e.preventDefault()
			e.stopPropagation()
			chatInput.value = ""
			play()
		}
		else if (screen === "chat" && !chatInput.hasFocus) chatInput.focus()
	}

	function use2d() {
		gl.disableVertexAttribArray(glCache.aSkylight)
		gl.disableVertexAttribArray(glCache.aBlocklight)
		gl.useProgram(program2D)
		gl.uniform2f(glCache.uOffset, 0, 0) // Remove offset
		// gl.depthFunc(gl.ALWAYS)
	}
	function use3d() {
		gl.useProgram(program3D)
		gl.enableVertexAttribArray(glCache.aVertex)
		gl.enableVertexAttribArray(glCache.aTexture)
		gl.enableVertexAttribArray(glCache.aShadow)
		gl.enableVertexAttribArray(glCache.aSkylight)
		gl.enableVertexAttribArray(glCache.aBlocklight)
		// gl.depthFunc(gl.LESS)
	}

	let maxLoad = 1
	function startLoad() {
		ctx.putImageData(dirtbg, 0, 0)
		maxLoad = world.loadKeys.length + 9
	}
	function initWebgl() {
		if (!win.gl) {
			let canv = document.createElement('canvas')
			canv.width = ctx.canvas.width
			canv.height = ctx.canvas.height
			canv.style.position = "absolute"
			canv.style.zIndex = -1
			canv.style.top = "0px"
			canv.style.left = "0px"
			gl = canv.getContext("webgl", { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false })
			if (!gl) {
				alert("Error: WebGL not detected. Please enable WebGL and/or \"hardware acceleration\" in your browser settings.")
				throw "Error: Cannot play a WebGL game without WebGL."
			}
			glExtensions = {
				"vertex_array_object": gl.getExtension("OES_vertex_array_object"),
				"element_index_uint": gl.getExtension("OES_element_index_uint")
			}
			if (!glExtensions.element_index_uint || !glExtensions.vertex_array_object) {
				alert("Unable to load WebGL extension. Please use a supported browser, or update your current browser.")
			}
			gl.viewport(0, 0, canv.width, canv.height)
			gl.enable(gl.DEPTH_TEST)
			gl.enable(gl.BLEND)
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
			win.gl = gl

			// const availableExtensions = gl.getSupportedExtensions()
			// for (let i = 0; i < availableExtensions.length; i++) {
			// 	const extensionName = availableExtensions[i]
			// 	glExtensions[extensionName.replace(/[A-Z]+_/g, "")] = gl.getExtension(extensionName)
			// }
		}
		else {
			gl = win.gl
		}

		if (!document.body.contains(gl.canvas)) {
			document.body.append(gl.canvas)
		}

		modelView = new Float32Array(16)
		glCache = {}
		win.glCache = glCache
		program3D = (0,_js_glUtils_js__WEBPACK_IMPORTED_MODULE_16__.createProgramObject)(gl, _shaders_blockVert_glsl__WEBPACK_IMPORTED_MODULE_0__["default"], _shaders_blockFrag_glsl__WEBPACK_IMPORTED_MODULE_1__["default"])
		program3DFogless = (0,_js_glUtils_js__WEBPACK_IMPORTED_MODULE_16__.createProgramObject)(gl, _shaders_blockVertFogless_glsl__WEBPACK_IMPORTED_MODULE_2__["default"], _shaders_blockFragFogless_glsl__WEBPACK_IMPORTED_MODULE_3__["default"])
		program2D = (0,_js_glUtils_js__WEBPACK_IMPORTED_MODULE_16__.createProgramObject)(gl, _shaders_2dVert_glsl__WEBPACK_IMPORTED_MODULE_4__["default"], _shaders_2dFrag_glsl__WEBPACK_IMPORTED_MODULE_5__["default"])
		programEntity = (0,_js_glUtils_js__WEBPACK_IMPORTED_MODULE_16__.createProgramObject)(gl, _shaders_entityVert_glsl__WEBPACK_IMPORTED_MODULE_6__["default"], _shaders_entityFrag_glsl__WEBPACK_IMPORTED_MODULE_7__["default"])
		skybox = (0,_js_sky__WEBPACK_IMPORTED_MODULE_18__.getSkybox)(gl, glCache, program3D, program3DFogless)

		gl.useProgram(program2D)
		glCache.uOffset = gl.getUniformLocation(program2D, "uOffset")
		glCache.uSampler2 = gl.getUniformLocation(program2D, "uSampler")
		glCache.aTexture2 = gl.getAttribLocation(program2D, "aTexture")
		glCache.aVertex2 = gl.getAttribLocation(program2D, "aVertex")
		glCache.aShadow2 = gl.getAttribLocation(program2D, "aShadow")

		gl.useProgram(programEntity)
		glCache.uSamplerEntity = gl.getUniformLocation(programEntity, "uSampler")
		glCache.uLightLevelEntity = gl.getUniformLocation(programEntity, "uLightLevel")
		glCache.uViewEntity = gl.getUniformLocation(programEntity, "uView")
		glCache.aTextureEntity = gl.getAttribLocation(programEntity, "aTexture")
		glCache.aVertexEntity = gl.getAttribLocation(programEntity, "aVertex")

		gl.useProgram(program3DFogless)
		glCache.uViewFogless = gl.getUniformLocation(program3DFogless, "uView")
		glCache.uSamplerFogless = gl.getUniformLocation(program3DFogless, "uSampler")
		glCache.uPosFogless = gl.getUniformLocation(program3DFogless, "uPos")
		glCache.uTimeFogless = gl.getUniformLocation(program3DFogless, "uTime")
		glCache.uTransFogless = gl.getUniformLocation(program3DFogless, "uTrans")
		glCache.uLanternFogless = gl.getUniformLocation(program3DFogless, "uLantern")

		gl.useProgram(program3D)
		glCache.uView = gl.getUniformLocation(program3D, "uView")
		glCache.uSampler = gl.getUniformLocation(program3D, "uSampler")
		glCache.uPos = gl.getUniformLocation(program3D, "uPos")
		glCache.uDist = gl.getUniformLocation(program3D, "uDist")
		glCache.uTime = gl.getUniformLocation(program3D, "uTime")
		glCache.uSky = gl.getUniformLocation(program3D, "uSky")
		glCache.uSun = gl.getUniformLocation(program3D, "uSun")
		glCache.uTrans = gl.getUniformLocation(program3D, "uTrans")
		glCache.uLantern = gl.getUniformLocation(program3D, "uLantern")
		glCache.aShadow = gl.getAttribLocation(program3D, "aShadow")
		glCache.aSkylight = gl.getAttribLocation(program3D, "aSkylight")
		glCache.aBlocklight = gl.getAttribLocation(program3D, "aBlocklight")
		glCache.aTexture = gl.getAttribLocation(program3D, "aTexture")
		glCache.aVertex = gl.getAttribLocation(program3D, "aVertex")

		gl.uniform1f(glCache.uDist, 1000)
		gl.uniform1i(glCache.uTrans, 0)

		// Send the block textures to the GPU
		;(0,_js_texture_js__WEBPACK_IMPORTED_MODULE_17__.initTextures)(gl, glCache)
		initShapes()

		// These buffers are only used for drawing the main menu blocks
		sideEdgeBuffers = {}
		for (let side in _js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes.cube.verts) {
			let edgeBuffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_js_shapes_js__WEBPACK_IMPORTED_MODULE_15__.shapes.cube.verts[side][0]), gl.STATIC_DRAW)
			sideEdgeBuffers[side] = edgeBuffer
		}
		texCoordsBuffers = []
		for (let t in _js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords) {
			let buff = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buff)
			gl.bufferData(gl.ARRAY_BUFFER, _js_texture_js__WEBPACK_IMPORTED_MODULE_17__.textureCoords[t], gl.STATIC_DRAW)
			texCoordsBuffers.push(buff)
		}

		// Bind the Vertex Array Object (VAO) that will be used to draw everything
		indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexOrder, gl.STATIC_DRAW)

		// Tell it not to render the insides of blocks
		gl.enable(gl.CULL_FACE)
		gl.cullFace(gl.BACK)

		gl.lineWidth(2)
		blockOutlines = false
		gl.enable(gl.POLYGON_OFFSET_FILL)
		gl.polygonOffset(1, 1)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
	}
	function initBackgrounds() {
		// Home screen background
		use3d()
		gl.clearColor(0.25, 0.45, 0.7, 1.0)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		FOV(100)
		const HALF_PI = Math.PI / 2
		initModelView(null, 0, 0.5, 0, -HALF_PI / 25, -HALF_PI / 3)
		gl.disableVertexAttribArray(glCache.aShadow)
		gl.disableVertexAttribArray(glCache.aSkylight)
		gl.disableVertexAttribArray(glCache.aBlocklight)
		gl.vertexAttrib1f(glCache.aShadow, 1.0)
		gl.vertexAttrib1f(glCache.aSkylight, 1.0)
		gl.vertexAttrib1f(glCache.aBlocklight, 1.0)

		{
			const blocks = Int8Array.of(
				7, 4, 1, 7,
				7, 4, 2, 7,
				7, 4, 3, 7,
				7, 4, 4, 7,
				7, 5, 1, 7,
				7, 5, 2, 7,
				7, 5, 3, 7,
				6, 4, 0, 7,
				6, 4, 1, 7,
				6, 4, 2, 7,
				6, 4, 3, 7,
				6, 4, 4, 7,
				6, 5, 0, 7,
				6, 5, 1, 7,
				6, 5, 2, 7,
				6, 5, 3, 7,
				6, 5, 4, 7,
				6, 6, 3, 7,
				6, 6, 4, 7,
				6, 7, 3, 7,
				5, 0, -1, 1,
				5, 0, 0, 1,
				5, 0, 1, 1,
				5, 0, 2, 1,
				5, 1, 2, 29,
				5, 2, 2, 29,
				5, 3, 2, 29,
				5, 4, 2, 29,
				5, 5, 2, 29,
				5, 6, 2, 29,
				5, 4, 0, 7,
				5, 4, 1, 7,
				5, 4, 3, 7,
				5, 4, 4, 7,
				5, 5, 0, 7,
				5, 5, 1, 7,
				5, 5, 3, 7,
				5, 5, 4, 7,
				5, 6, 1, 7,
				5, 6, 3, 7,
				5, 7, 1, 7,
				5, 7, 2, 7,
				5, 7, 3, 7,
				4, -1, -1, 1,
				4, -1, 0, 1,
				4, -1, 1, 1,
				4, -1, 2, 1,
				4, 0, 3, 1,
				4, 0, 4, 1,
				4, 0, 5, 1,
				4, 0, 6, 1,
				4, 0, 7, 1,
				4, 0, 8, 1,
				4, 0, 9, 1,
				4, 0, 10, 1,
				4, 4, 0, 7,
				4, 4, 1, 7,
				4, 4, 2, 7,
				4, 4, 3, 7,
				4, 4, 4, 7,
				4, 5, 0, 7,
				4, 5, 1, 7,
				4, 5, 2, 7,
				4, 5, 3, 7,
				4, 5, 4, 7,
				4, 6, 1, 7,
				4, 6, 2, 7,
				4, 6, 3, 7,
				4, 7, 4, 7,
				3, -1, -1, 1,
				3, -1, 0, 1,
				3, -1, 1, 1,
				3, -1, 2, 1,
				3, -1, 3, 1,
				3, -1, 4, 1,
				3, 0, 5, 1,
				3, 0, 6, 1,
				3, 0, 7, 1,
				3, 0, 8, 1,
				3, 0, 9, 1,
				3, 0, 10, 1,
				3, 4, 1, 7,
				3, 4, 2, 7,
				3, 4, 3, 7,
				3, 4, 4, 7,
				3, 5, 1, 7,
				3, 5, 2, 7,
				3, 5, 3, 7,
				2, -1, -1, 1,
				2, -1, 0, 1,
				2, -1, 1, 1,
				2, -1, 2, 1,
				2, -1, 3, 1,
				2, -1, 4, 1,
				2, -1, 5, 1,
				2, -1, 6, 1,
				2, -1, 7, 1,
				2, 0, 8, 1,
				2, 0, 9, 1,
				2, 0, 10, 1,
				1, -2, -1, 1,
				1, -2, 0, 1,
				1, -2, 1, 1,
				1, -2, 2, 1,
				1, -2, 3, 1,
				1, -1, 4, 1,
				1, -1, 5, 1,
				1, -1, 6, 1,
				1, -1, 7, 1,
				1, -1, 8, 1,
				1, -1, 9, 1,
				1, -1, 10, 1,
				0, -2, -1, 1,
				0, -2, 0, 1,
				0, -2, 1, 1,
				0, -2, 2, 1,
				0, -2, 3, 1,
				0, -2, 4, 1,
				0, -2, 5, 1,
				0, -1, 6, 1,
				0, -1, 7, 1,
				0, -1, 8, 1,
				0, -1, 9, 1,
				0, -1, 10, 1,
				-1, -2, -1, 1,
				-1, -2, 0, 1,
				-1, -2, 1, 1,
				-1, -2, 2, 1,
				-1, -2, 3, 1,
				-1, -2, 4, 1,
				-1, -2, 5, 1,
				-1, -2, 6, 1,
				-1, -2, 7, 1,
				-1, -1, 8, 1,
				-1, -1, 9, 1,
				-1, -1, 10, 1,
				-2, -2, -1, 1,
				-2, -2, 0, 1,
				-2, -2, 1, 1,
				-2, -2, 2, 1,
				-2, -2, 3, 1,
				-2, -2, 4, 1,
				-2, -2, 5, 1,
				-2, -2, 6, 1,
				-2, -2, 7, 1,
				-2, -2, 8, 1,
				-2, -2, 9, 1,
				-2, -1, 10, 1,
				-3, -2, -1, 1,
				-3, -2, 0, 1,
				-3, -2, 1, 1,
				-3, -2, 2, 1,
				-3, -2, 3, 1,
				-3, -2, 4, 1,
				-3, -2, 5, 1,
				-3, -2, 6, 1,
				-3, -2, 7, 1,
				-3, -2, 8, 1,
				-3, -2, 9, 1,
				-3, -2, 10, 1,
				-3, -2, 11, 1,
				-3, -2, 12, 1,
				-4, -2, -1, 1,
				-4, -2, 0, 1,
				-4, -2, 1, 1,
				-4, -2, 2, 1,
				-4, -2, 3, 1,
				-4, -2, 4, 1,
				-4, -2, 5, 1,
				-4, -2, 6, 1,
				-4, -2, 7, 1,
				-4, -2, 8, 1,
				-4, -2, 9, 1,
				-4, -2, 10, 1,
				-4, -2, 11, 1,
				-4, -2, 12, 1,
				-5, -2, -1, 1,
				-5, -2, 0, 1,
				-5, -2, 1, 1,
				-5, -2, 2, 1,
				-5, -2, 3, 1,
				-5, -2, 4, 1,
				-5, -2, 5, 1,
				-5, -2, 6, 1,
				-5, -2, 7, 1,
				-5, -2, 8, 1,
				-5, -2, 9, 1,
				-5, -2, 10, 1,
				-5, -2, 11, 1,
				-5, -2, 12, 1,
				-6, -2, -1, 1,
				-6, -2, 0, 1,
				-6, -2, 1, 1,
				-6, -2, 2, 1,
				-6, -2, 3, 1,
				-6, -2, 4, 1,
				-6, -2, 5, 1,
				-6, -2, 6, 1,
				-6, -2, 7, 1,
				-6, -2, 8, 1,
				-6, -2, 9, 1,
				-6, -2, 10, 1,
				-6, -2, 11, 1,
				-7, -2, 3, 1,
				-7, -2, 4, 1,
				-7, -2, 5, 1,
				-7, -2, 6, 1,
				-7, -2, 7, 1,
				-7, -2, 8, 1,
				-7, -2, 9, 1,
				-8, -2, 2, 1,
				-8, -2, 3, 1,
				-8, -2, 4, 1,
				-8, -2, 5, 1,
				-8, -2, 6, 1,
				-8, -2, 7, 1,
				-8, -2, 8, 1,
			)

			for (let i = 0; i < blocks.length; i += 4) {
				block2(blocks[i + 0], blocks[i + 1], blocks[i + 2], blocks[i + 3])
			}
		}

		gl.enableVertexAttribArray(glCache.aShadow)
		gl.enableVertexAttribArray(glCache.aSkylight)
		gl.enableVertexAttribArray(glCache.aBlocklight)

		ctx.drawImage(gl.canvas, 0, 0)
		mainbg = ctx.getImageData(0, 0, width, height)

		// Dirt background
		use2d()
		let aspect = width / height
		let stack = height / 96
		let bright = 0.4
		if (dirtBuffer) {
			gl.deleteBuffer(dirtBuffer)
		}
		dirtBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, dirtBuffer)
		let bgCoords = new Float32Array([
			-1, -1, 0, stack, bright,
			1, -1, stack * aspect, stack, bright,
			1, 1, stack * aspect, 0, bright,
			-1, 1, 0, 0, bright
		])
		gl.bufferData(gl.ARRAY_BUFFER, bgCoords, gl.STATIC_DRAW)
		gl.uniform1i(glCache.uSampler2, 1)
		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		gl.vertexAttribPointer(glCache.aVertex2, 2, gl.FLOAT, false, 20, 0)
		gl.vertexAttribPointer(glCache.aTexture2, 2, gl.FLOAT, false, 20, 8)
		gl.vertexAttribPointer(glCache.aShadow2, 1, gl.FLOAT, false, 20, 16)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
		// pixels = new Uint8Array(width * height * 4)
		// gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		// dirtbg = ctx.createImageData(width, height)
		// dirtbg.data.set(pixels)
		ctx.drawImage(gl.canvas, 0, 0)
		dirtbg = ctx.getImageData(0, 0, width, height)
	}
	function initPlayer() {
		p = new Camera()
		p.speed = 0.11
		p.velocity = new _js_3Dutils_js__WEBPACK_IMPORTED_MODULE_11__.PVector(0, 0, 0)
		p.pos = new Float32Array(3)
		p.sprintSpeed = 1.5
		p.flySpeed = 3.75
		p.x = 8
		p.y = 0
		p.z = 8
		p.w = 3 / 8
		p.bottomH = 1.62
		p.topH = 0.18
		p.onGround = false
		p.jumpSpeed = 0.45
		p.sprinting = false
		p.maxYVelocity = 4.5
		p.gravityStrength = -0.091
		p.lastUpdate = performance.now()
		p.lastBreak = now
		p.lastPlace = now
		p.lastJump = now
		p.autoBreak = false
		p.autoBuild = false
		p.flying = false
		p.sneaking = false
		p.spectator = false

		win.player = p
		win.p2 = p2
	}

	function sanitize(text) {
		const el = document.createElement('div')
		el.textContent = text
		return el.innerHTML
	}

	function initWorldsMenu() {
		while (window.worlds.firstChild) {
			window.worlds.removeChild(window.worlds.firstChild)
		}
		selectedWorld = 0
		window.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		function addWorld(name, version, size, id, edited, cloud) {
			let div = document.createElement("div")
			div.className = "world"
			div.onclick = () => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + sanitize(name) + "</strong>" + br

			if (edited){
				let str = new Date(edited).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit"
				})
				div.innerHTML += str + br
			}
			div.innerHTML += version + br
			if (cloud) div.innerHTML += `Cloud Save (${size.toLocaleString()} bytes)`
			else div.innerHTML += `${size.toLocaleString()} bytes used`

			window.worlds.appendChild(div)
		}

		worlds = {}
		if (loadString) {
			try {
				let tempWorld = new World(true)
				tempWorld.loadSave(loadString)
				addWorld(`${tempWorld.name} (Pre-loaded)`, tempWorld.version, loadString.length, now)
				worlds[now] = {
					code: loadString,
					id: now
				}
			}
			catch(e) {
				console.log("Unable to load hardcoded save.")
				console.error(e)
			}
		}
		(0,_js_indexDB_js__WEBPACK_IMPORTED_MODULE_14__.loadFromDB)().then(async res => {
			if(res && res.length) {
				let index = res.findIndex(obj => obj.id === "settings")
				if (index >= 0) {
					Object.assign(settings, res[index].data) // Stored data overrides any hardcoded settings
					p.FOV(settings.fov)
					res.splice(index, 1)
				}
			}

			if (res && res.length) {
				res = res.map(d => d.data).filter(d => d && d.code).sort((a, b) => b.edited - a.edited)
				for (let data of res) {
					addWorld(data.name, data.version, data.code.length + 60, data.id, data.edited, false)
					data.cloud = false
					worlds[data.id] = data
				}
			}

			if (location.href.startsWith("https://willard.fun/")) {
				let cloudSaves = await fetch('https://willard.fun/minekhan/saves').then(res => res.json())
				if (Array.isArray(cloudSaves) && cloudSaves.length) {
					for (let data of cloudSaves) {
						if (worlds[data.id] && worlds[data.id].edited >= data.edited) continue

						addWorld(data.name, data.version, data.size + 60, data.id, data.edited, true)
						data.cloud = true
						worlds[data.id] = data
					}
				}
			}

			window.worlds.onclick = Button.draw
			window.boxCenterTop.onkeyup = Button.draw
		}).catch(e => console.error(e))

		superflat = false
		trees = true
		caves = true
	}

	async function initMultiplayerMenu() {
		while (window.worlds.firstChild) {
			window.worlds.removeChild(window.worlds.firstChild)
		}
		selectedWorld = 0
		window.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		let servers = await getWorlds()

		function addWorld(name, host, online, id, version, password) {
			let div = document.createElement("div")
			div.className = "world"
			div.onclick = () => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + sanitize(name) + "</strong>" + br

			div.innerHTML += "Hosted by " + sanitize(host) + br
			div.innerHTML += online + " players online" + br
			div.innerHTML += version + br
			if (password) div.innerHTML += "Password-protected" + br

			window.worlds.appendChild(div)
		}

		worlds = {}

		for (let data of servers) {
			addWorld(data.name, data.host, data.online, data.target, data.version, !data.public)
			worlds[data.target] = data
		}
		window.worlds.onclick = Button.draw
		window.boxCenterTop.onkeyup = Button.draw
	}

	function initEverything() {
		console.log("Initializing world.")

		generatedChunks = 0

		initPlayer()
		initWebgl()

		if (win.location.origin === "https://www.kasandbox.org" && (loadString || MineKhan.toString().length !== 183240)) {
			// This is only for KA, since forks that make it onto the hotlist get a lot of hate for "not giving credit".
			// If you're making significant changes and want to remove this, then you can.
			// If publishing this on another website, I'd encourage giving credit somewhere to avoid being accused of plagiarism.
			message.innerHTML = '.oot lanigiro eht tuo kcehc ot>rb<erus eb ,siht ekil uoy fI>rb<.dralliW yb >a/<nahKeniM>"wen_"=tegrat "8676731005517465/cm/sc/gro.ymedacanahk.www//:sptth"=ferh a< fo>rb<ffo-nips a si margorp sihT'.split("").reverse().join("")
		}

		initBackgrounds()

		drawScreens[screen]()
		Button.draw()
		Slider.draw()

		p.FOV(settings.fov)
		initWorldsMenu()
		initButtons()

		// Generate all the block icons
		genIcons()
		ctx.putImageData(mainbg, 0, 0) // prevent block flash

		// See if a user followed a link here.
		var urlParams = new URLSearchParams(window.location.search)
		if (urlParams.has("target")) {
			changeScene("multiplayer menu")
			initMultiplayer(urlParams.get("target"))
		}

		if (window.parent.tickid) window.clearTimeout(window.parent.tickid)
		tickLoop()
	}

	// Define all the scene draw functions
	(function() {
		function title() {
			let title = "MINEKHAN"
			let subtext = "JAVASCRIPT EDITION"
			let font = "VT323,monospace"
			strokeWeight(1)
			ctx.textAlign = 'center'

			ctx.font = "bold 120px " + font
			fill(30)
			text(title, width / 2, 158)
			fill(40)
			text(title, width / 2, 155)
			ctx.font = "bold 121px " + font
			fill(50)
			text(title, width / 2, 152)
			fill(70)
			text(title, width / 2, 150)
			fill(90)
			ctx.font = "bold 122px " + font
			text(title, width / 2, 148)
			fill(110)
			text(title, width / 2, 145)

			ctx.font = "bold 32px " + font
			fill(50)
			text(subtext, width / 2-1, 180)
			text(subtext, width / 2+1, 180)
			text(subtext, width / 2, 179)
			text(subtext, width / 2, 181)
			ctx.font = "bold 32px " + font
			fill(150)
			text(subtext, width / 2, 180)
		}
		const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height)
		const dirt = () => ctx.putImageData(dirtbg, 0, 0)

		drawScreens["main menu"] = () => {
			ctx.putImageData(mainbg, 0, 0)
			title()
			fill(220)
			ctx.font = "20px VT323"
			ctx.textAlign = 'left'
			text("Minecraft " + version, width - (width - 2), height - 2)
		}

		drawScreens.play = () => {
			let renderStart = performance.now()
			p.setDirection()
			world.render()
			analytics.totalRenderTime += performance.now() - renderStart
		}

		drawScreens.loading = () => {
			// This is really stupid, but it basically works by teleporting the player around to each chunk I'd like to load.
			// If chunks loaded from a save aren't generated, they're deleted from the save, so this loads them all.

			let sub = maxLoad - world.loadKeys.length - 9
			let standing = true

			let cx = p.x >> 4
			let cz = p.z >> 4

			for (let x = cx - 1; x <= cx + 1; x++) {
				for (let z = cz - 1; z <= cz + 1; z++) {
					if (!world.chunks[x] || !world.chunks[x][z] || !world.chunks[x][z].buffer) {
						standing = false
					}
					else {
						sub++
					}
				}
			}
			if (world.loadKeys.length || world.loading) {
				world.load()
				standing = false
			}
			else if (!standing) {
				world.tick()
			}

			if (standing) {
				play()
				if (maxLoad === 9 && p.y === 0 && !p.flying && !p.spectator) {
					p.y = world.chunks[cx][cz].tops[(p.x & 15) * 16 + (p.z & 15)] + 2
				}
				return
			}

			let progress = round(100 * sub / maxLoad)
			document.getElementById("loading-text").textContent = `Loading... ${progress}% complete (${sub} / ${maxLoad})`
			// ctx.putImageData(dirtbg, 0, 0)
			// fill(255)
			// textSize(30)
			// ctx.textAlign = "center"
			// text(`Loading... ${progress}% complete (${sub} / ${maxLoad})`, width / 2, height / 2)
		}

		drawScreens.inventory = drawInv

		drawScreens.pause = () => {
			strokeWeight(1)
			clear()
			ctx.drawImage(gl.canvas, 0, 0)

			textSize(60)
			fill(0, 0, 0)
			ctx.textAlign = 'center'
			text("Paused", width / 2, 60)
		}

		drawScreens.options = () => {
			clear()
		}
		drawScreens["creation menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Create New World", width / 2, 20)
		}
		drawScreens["loadsave menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select World", width / 2, 20)
		}
		drawScreens.editworld = dirt
		drawScreens["multiplayer menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select Server", width / 2, 20)
		}
	})()

	// Give the font time to load and redraw the homescreen
	setTimeout(() => {
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}, 100)

	function tickLoop() {
		window.parent.tickid = window.setTimeout(tickLoop, 50) // 20 TPS

		if (world && screen === "play") {
			controls()
			runGravity()
			resolveContactsAndUpdatePosition()
			// if (p.y < 6.12) {
			// 	console.log(p.y)
			// }

			let tickStart = performance.now()
			world.tick()
			analytics.ticks++
			analytics.totalTickTime += performance.now() - tickStart
		}
	}

	let prevTime = 0
	function renderLoop(time) {
		let frameFPS = Math.round(10000/(time - prevTime)) / 10
		prevTime = time

		now = Date.now()
		let frameStart = performance.now()
		if (!gl) {
			initEverything()
			releasePointer()
		}

		if (screen === "play" || screen === "loading") {
			try {
				drawScreens[screen]()
			}
			catch(e) {
				console.error(e)
			}
		}

		if (screen === "play" && now - analytics.lastUpdate > 500 && analytics.frames) {
			analytics.displayedTickTime = (analytics.totalTickTime / analytics.ticks).toFixed(1)
			analytics.displayedRenderTime = (analytics.totalRenderTime / analytics.frames).toFixed(1)
			analytics.displayedFrameTime = (analytics.totalFrameTime / analytics.frames).toFixed(1)
			analytics.fps = round(analytics.frames * 1000 / (now - analytics.lastUpdate))
			analytics.displayedwFrameTime = analytics.worstFrameTime.toFixed(1)
			analytics.displayedwFps = analytics.worstFps
			analytics.worstFps = 1000000
			analytics.frames = 0
			analytics.totalRenderTime = 0
			analytics.totalTickTime = 0
			analytics.ticks = 0
			analytics.totalFrameTime = 0
			analytics.worstFrameTime = 0
			analytics.lastUpdate = now
			hud()
		}

		analytics.frames++
		analytics.totalFrameTime += performance.now() - frameStart
		analytics.worstFrameTime = max(performance.now() - frameStart, analytics.worstFrameTime)
		analytics.worstFps = min(frameFPS, analytics.worstFps)
		win.raf = requestAnimationFrame(renderLoop)
	}
	return renderLoop
}

window.onload = async function() {
	var init = await MineKhan()
	if (window.parent.raf) {
		window.cancelAnimationFrame(window.parent.raf)
		console.log("Canceled", window.parent.raf)
	}
	init()
}

})();

/******/ })()
;