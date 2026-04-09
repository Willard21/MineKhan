#!/bin/bash

set -e # Stop on error

SRC="src/c/caves.c"    # Source file
OUT="src/c/caves.wasm" # Output file
WAT="src/c/caves.wat"  # Wat output file (Decompiled WASM file)

# Build
echo "Compiling $SRC to $OUT..."
clang --target=wasm32 -O3 -mbulk-memory -nostdlib -Wl,--no-entry -Wl,--export=getCaves -Wl,--strip-all -o "$OUT" "$SRC"

echo "✅ Build complete!"
wasm2wat "$OUT" -o "$WAT"
echo "Encoding $OUT to base64..."
base64 -w 0 "$OUT"
echo
