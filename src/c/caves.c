// #include <emscripten/emscripten.h>
// extern void conlog(int a, double b);
#include <math.h>

int cast(double a) {
	int ret;
	asm(
		"local.get %[a]\n"
		"i32.trunc_f64_s\n"
		"local.set %[ret]\n"
		: [ret] "=r" (ret) : [a] "r" (a)
	);
	return ret;
}

int* positions = 0;
double noise(double x, double y, double z) {
	const double NORM_3D = 1.0 / 206.0;
	const double SQUISH_3D = 1.0 / 3.0;
	const double STRETCH_3D = -1.0 / 6.0;

	const double* data = (double*) 320;
	const char* source = (char*) 8384;
	const char* perm = (char*) 8640;
	const char* perm3D = (char*) 8896;
	const char* gradients3D = (char*) 9152;

	const double stretchOffset = (x + y + z) * STRETCH_3D;
	const double xs = x + stretchOffset;
	const double ys = y + stretchOffset;
	const double zs = z + stretchOffset;
	const double xsb = floor(xs);
	const double ysb = floor(ys);
	const double zsb = floor(zs);
	const double xins = xs - xsb;
	const double yins = ys - ysb;
	const double zins = zs - zsb;
	const double inSum = xins + yins + zins;

	if (!(0.0 <= xins && xins <= 1.0 && 0.0 <= yins && yins <= 1.0 && 0.0 <= zins && zins <= 1.0 && 0.0 <= inSum && inSum <= 3.0)) {
		__builtin_unreachable();
	}

	const int bits = cast(yins - zins + 1.0)
	| cast(xins - yins + 1.0) << 1
	| cast(xins - zins + 1.0) << 2
	| cast(inSum) << 3
	| cast(inSum + zins) << 5
	| cast(inSum + yins) << 7
	| cast(inSum + xins) << 9;

	const int n = (unsigned int)(bits * 571183418275LL + 1013904223) >> 1;

	int c = positions[n % 80];
	if (c == -1) {
		return 0.0;
	}
	double value = 0.0;
	const double squishOffset = (xsb + ysb + zsb) * SQUISH_3D;
	const double dx0 = x - (xsb + squishOffset);
	const double dy0 = y - (ysb + squishOffset);
	const double dz0 = z - (zsb + squishOffset);
	const int count = c < 432 ? 6 : 8;
	for (int j = 0; j < count; j++) {
		const double dx = dx0 + data[c];
		const double dy = dy0 + data[c+1];
		const double dz = dz0 + data[c+2];
		double attn = 2 - dx * dx - dy * dy - dz * dz;
		if (attn > 0) {
			int i = perm3D[(perm[cast(xsb + data[c+3]) & 0xFF] + cast(ysb + data[c+4]) & 0xFF) + cast(zsb + data[c+5]) & 0xFF];
			attn *= attn;
			value += attn * attn * (gradients3D[i] * dx + gradients3D[i + 1] * dy + gradients3D[i + 2] * dz);
		}
		c += 6;
	}

	return value * NORM_3D + 0.5;
}

int isCave(double x, double y, double z) {
	const double smooth = 0.02;
	const double caveSize = 0.0055;
	return fabs(0.5 - noise(x * smooth, y * smooth, z * smooth)) < caveSize
		&& fabs(0.5 - noise(y * smooth, z * smooth, x * smooth)) < caveSize;
}

void carveSphere(int index, char* output) {
	const short* sphere = (short*) 30216;
	for (int i = 0; i < 81; i++) {
		const int index2 = index + sphere[i];
		if (output[index2] != 1) {
			output[index2] = 2;
		}
	}
}

__attribute__((used)) char* getCaves(int x, int z) {
	char* results = (char*) 9224;
	// Clear out the array so it doesn't re-use the results.
	__builtin_memset(results, 0, 20992); // Clear 256 * 82 bytes

	for (int i = 1024; i < 20480; i++) {
		const int px = i >> 4 & 15;
		const int pz = i & 15;
		if (isCave(x + px, i >> 8, z + pz)) {
			if (px > 1 && px < 14 && pz > 1 && pz < 14) {
				carveSphere(i, results);
			} else {
				results[i] = 1;
			}
		}
	}
	return results;
}
