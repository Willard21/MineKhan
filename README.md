# MineKhan
Minecraft for Khan Academy

Khan Academy link can be found [here](https://www.khanacademy.org/computer-programming/minecraft/5647155001376768).

Fullscreen version of the game can be found [here](https://willard21.github.io/MineKhan/Minecwaft.html).

If you'd like to contribute, join the conversation on [Discord](https://discord.gg/j3SzCQU).

___

About the code and game:

@MineKhan version Alpha 0.7.0

	NOTE:
The "Save" button saves your world to your local browser. Nobody else can see it. However, if you're on a public or shared computer, that save may be deleted unexpectedly. So it's a good idea to keep a safe copy of your save string somewhere where it won't be deleted.

To share your save with other people, copy your world string into the "loadString" variable on line 188.

	Controls:

 * Right-click (or ctrl + left-click): place block
 * Left-click: Remove block
 * Middle-click: Pick block
 * Q: Sprint
 * Shift: Sneak
 * W: Walk forward
 * S: Walk backward
 * A: Walk left
 * D: Walk right
 * E: Open inventory
 * B: Toggle super Breaker
 * Z: Zoom
 * L: Toggle Spectator mode
 * Enter: Toggle slab/stair mode
 * Arrow Keys: look around
 * P or Esc: pause/unpause
 * 1-9 navigate hotbar
 * Spacebar: jump
 * Double jump: toggle flight
 * Shift (flying): fly down
 * Space (flying): fly up
 * T: Reload textures
 * ; (semicolon): Release the pointer without pausing (for screenshots)

	Notes and accreditation:
 * This program (MineKhan) was made by Willard (me). The original is https://www.khanacademy.org/cs/mc/5647155001376768 (just adding this so that spin-offs have it)
 * Zushah helped me with some of the menus in the 0.6 update via GitHub. https://www.khanacademy.org/profile/zushah77/
 * Element118 helped speed up the process of adding new textures significantly. https://www.khanacademy.org/profile/element118/

 * This program originated as a spin-off of ScusCraft by ScusX.
 * It's 99% different code at this point, but I still never would have made it this far without his code for reference.
 * ScusCraft can be found here: https://www.khanacademy.org/computer-programming/scuscraft-3d/5145400332058624
 * My original spin-off can be found here: https://www.khanacademy.org/computer-programming/high-performance-minecraft/5330738124357632
 * While porting the code from PJS to a webpage, I copied the PJS source code for a few of their helper functions from here: https://raw.githubusercontent.com/Khan/processing-js/master/processing.js
 * The textures are 100% copied from real Minecraft, and are the property of Mojang and Microsoft with whom I have no association.
 * The real Minecraft game can be bought and downloaded at https://www.minecraft.net/en-us/


 * Chunks are kept in memory until you restart. So don't explore too far or memory usage will grow until it crashes unrecoverably.


	To-Do:
 * A lot. Check out the GitHub repo if you'd like to collaborate on this. Must use Discord.
 * https://github.com/Willard21/MineKhan


	How it works:

The graphics in this project are done using WebGL, which is a web implementation of OpenGL ES 2.
It allows us to write shader programs that run right on the GPU, which means it can run as fast as any C++ game.
The infamous P3D mode in Processing.js uses WebGL behind the scenes, but it does it so inefficiently that it might as well not even being using the GPU.

To properly utilize WebGL like this program does, you need to make efficient use of Vertext Buffer Objects (VBOs).
A VBO is an array that contains a whole bunch of vertices. Since WebGL can only render triangles and lines, these vertices are stored in multiples of 3.
A vertex doesn't only include its world coordinates, though. It also includes its texture coordinates, and any other data you want the shaders to manipulate.
In my case, every vertex has an X, Y, Z, textureX, textureY, and shadowIntensity. So 6 values for every block vertex in the world.

A program can only draw 1 VBO per draw call. Since the texture data is attached to the vertex data, you can't switch textures between vertices.
That means you either have to make seperate draw calls for each texture, or only use 1 texture. I do the latter.
I make a single 256x256 pixel texture, and store each of the 16x16 block textures in a section of that big texture, and store the coordinates to it. This is informally called a "texture atlas".
Then when I'm preparing my VBO, I send the texture coordinates along with the block coordinates so the shader knows how to map the 256x256 pixel texture onto the 16x16 pixel block face.

I do this once for each chunk in the world, and store those VBOs so I can draw them every frame. If a block is edited in a chunk, then that VBO is replaced.
Drawing a chunk after the VBO has been created is as simple as binding the buffer and calling "gl.drawArrays" once per chunk. The GPU takes care of the rest.

I also use what's called Vertex Array Objects (VAOs) to re-use shared vertices. Since the GPU expects triangles, and I want to draw squares, I need to draw 2 triangles (6 vertices) per square.
That means 2 of them are being re-used. The VAO lets me tell the GPU to use the cached vertex data instead of looking for a new one, which offers a small inprovement to GPU performance.
This isn't entirely necessary, but it's considered best practice. Some OpenGL ES implementations require it, but WebGL 1 does not. I think WebGL 2 does, but that's not as well supported.
