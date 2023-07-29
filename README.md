# MineKhan
Minecraft for Khan Academy

Khan Academy link can be found [here](https://www.khanacademy.org/computer-programming/minekhan/5647155001376768).

GitHub release can be found [here](https://willard21.github.io/MineKhan/dist/).

[Replit post](https://repl.it/talk/share/MineKhan-Minecraft-for-Khan-Academy/87382) and [app](https://replit.com/@Willard21/MineKhan)

Multiplayer [login](https://willard.fun/login) and [game](https://willard.fun/minekhan). This is the most up-to-date version, and I frequently code in production on this version. Beware of bugs.


If you'd like to contribute, join the conversation on [Discord](https://discord.gg/j3SzCQU).

To build the project, first clone/download it, then `cd` into the directory, then `npm install`, then `npm run build`. This will build the project into the `dist` folder. From there, you can either `node index.js` to start a server on localhost:4000, or just open the html file. If it built into multiple files, then you'll have to use the server option.

Compiling the caves.c file into WASM is a bit more involved. It requires installing emscripten, then running `emcc src/c/caves.c -o test.js -O3 -Os -sEXPORTED_FUNCTIONS=_getCaves -sERROR_ON_UNDEFINED_SYMBOLS=0`, which will output a useless JS file along with the .wasm file. Delete the JS file. Then you'll need to convert the .wasm file to base64 somehow (I just googled an online tool for it), then copy/paste it into the workers/Caves.js file. Loading the wasm file directly works too, but that wouldn't work on KA, which is why I went with the base64 method.

I think there's a way to compile C into WASM with Clang to avoid emscripten and that useless JS file, but I couldn't figure it out. If anyone else figures it out, I'd appreciate some instructions.