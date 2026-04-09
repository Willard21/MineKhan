# MineKhan
Minecraft for Khan Academy

Khan Academy link can be found [here](https://www.khanacademy.org/computer-programming/minekhan/5647155001376768).

GitHub release can be found [here](https://willard21.github.io/MineKhan/dist/).

[Replit post](https://repl.it/talk/share/MineKhan-Minecraft-for-Khan-Academy/87382) and [app](https://replit.com/@Willard21/MineKhan)

Multiplayer [login](https://willard.fun/login) and [game](https://willard.fun/minekhan). This is the most up-to-date version, and I frequently code in production on this version. Beware of bugs.

Texture encoder is [here](https://willard.fun/minekhan/textures).

If you'd like to contribute, join the conversation on [Discord](https://discord.gg/j3SzCQU).

To build the project, first clone/download it, then `cd` into the directory, then `npm install`, then `node index.js`. This will build the project into the `dist` folder and start a server on http://localhost:4000. It will watch for any changes in the src folder and automatically re-build the project as soon as you save.

To compile the C code to WASM, `sudo apt install clang lld wabt` to install the dependencies in Ubuntu (or google how to do it on your own OS), then run `./compile-wasm.sh` after making it executable. Or just open the file to copy/paste the commands inside it. It'll print the base64 to the console to be copy/pasted into the code. The generated caves.wat file is just for perusal and doesn't do anything.