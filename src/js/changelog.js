const changeList = [
	{
		date: "2017-03-09",
		version: "Scuscraft 3D Alpha 0.1",
		versionLink: "https://www.khanacademy.org/computer-programming/scuscraft-3d/5145400332058624",
		creditName: "ScusX",
		creditLink: "https://www.khanacademy.org/profile/kaid_690562335310574068784363/projects",
		changes: [
			"(Original game)",
			"Added first 7 blocks (no textures)",
			"Added oak trees",
			"Added save codes (copy/paste only)",
			"Made with P3D",
			"(Renders about 4 blocks away)"
		]
	},
	{
		date: "2020-07-05",
		version: "0.3",
		versionLink: "https://www.khanacademy.org/computer-programming/high-performance-minecraft/5330738124357632",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Added: Textures",
			"Added: Inventory with 29 blocks",
			"Added: Chunks with chunk-based rendering",
			"Added: Mouse controls with screen lock",
			"Added: Occular occlusion (shadows in block corners)",
			"Added: Frustum culling (chunks behind the player aren't rendered)",
			"Stopped: rendering hidden block faces",
			"Removed: Processing.js dependency (everything is raw WebGL)",
			"Removed: Save codes (world format changed)",
			"Optimized: Everything is faster",
		]
	},
	{
		date: "2020-07-06",
		version: "0.3.1",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: Glass blocks no longer cast shadows",
			"Fixed: Glass blocks no longer show inner faces when placed together",
			"Fixed: Buttons should no longer get \"stuck\" down",
			"Fixed: Adding too many visible blocks to a chunk made it disappear (can still happen, but I increased the max)",
			"Added: Ores now spawn underground.",
			"Removed: TNT block. Stop asking how to detonate it.",
			"Changed: Birch tree frequency slightly reduced.",
			"Changed: Mouse pointer now uses the correct icon when over buttons",
			"Changed: Canvas now scales to window size (fullscreen if you load the page from an html file)."
		]
	},
	{
		date: "2020-07-23",
		version: "0.4",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: People getting stuck at Y=7",
			"Fixed: Right click getting stuck on Safari",
			"Fixed: Inventory looked really weird on Firefox",
			"Optimized: Hotbar is no longer drawn every frame",
			"Optimized: World gen is now much faster on faster computers (just does more work per frame)",
			"Added: Pick block (middle click, actually added this like 2 weeks ago but forgot to mention it).",
			"Added: Save codes. See instructions on line 5 of comments."
		]
	},
	{
		date: "2020-08-16",
		version: "0.5",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Added: Caves",
			"Fixed: Clicking while holding space toggled flight on some browsers",
			"Fixed: Redstone was generating too high in the world"
		]
	},
	{
		date: "2020-08-28",
		version: "0.5.1",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: Caves no longer generate above ground, so there should be fewer broken trees.",
			"Changed: Caves now use Open Simplex Noise instead of Perlin Noise, which speeds up world gen a decent amount. This will likely break any old saves inside caves.",
			"Changed: Save codes now use a textarea tag instead of a textbox, and spell check is disabled. Shouldn't lag so much when copying it now.",
			"Changed: reduced tree spawn frequency by half."
		]
	},
	{
		date: "2020-09-28",
		version: "0.6",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: That annoying bug that caused leaves to reappear when loading saves.",
			"Fixed: The weird flat walls in caves.",
			"Fixed: Ctrl clicking should now place blocks.",
			"Fixed: Saves should no longer scatter randomly.",
			"Fixed: Higher FOV should no longer let you xray.",
			"Added: Slabs. Press \"Enter\" to toggle between slabs and cubes.",
			"Added: Sneaking. Press \"Shift\" while on the ground to prevent falling off edges.",
			"Added: Spectator mode: Press \"L\" to fly through walls.",
			"Added: Grass spread and decay.",
			"Added: 19 new blocks to the inventory.",
			"Added: Superflat world gen option.",
			"Added: FOV setting.",
			"Added: Mouse sensitivity setting.",
			"Added: Load world option for loading the world without editing the code.",
			"Added: Spin-offs now link back to this program in the pause menu.",
			"Added: In-game saving instructions.",
			"Changed: The name of the game to MineKhan.",
			"Changed: The logo and fonts.",
			"Changed: The settings layout."
		]
	},
	{
		date: "2020-12-13",
		version: "0.7",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: Rendering glitch with blocks above slabs",
			"Fixed: Teleporting when walking against a slab and wall",
			"Fixed: Losing saves when you save a world before visiting previously edited chunks.",
			"Fixed: Superflat worlds not loading as superflat if you didn't change the option",
			"Added: Fog",
			"Added: Stairs",
			"Added: Top slabs",
			"Added: Loading screen",
			"Added: Settings sliders",
			"Added: Local save option",
			"Added: Button hover text",
			"Added: World selection screen",
			"Added: Increased FOV while sprinting",
			"Added: Option to disable caves or trees at world gen",
			"Changed: Zoom button is now animated",
			"Changed: All then menus"
		]
	},
	{
		date: "2020-12-17",
		version: "0.7.1",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Fixed: Shadows on the tops of stairs were wrong (the sides of stairs are still wrong)",
			"Fixed: Unable to save worlds loaded from the save box thing",
			"Fixed: Collision bug when going up stairs against a wall",
			"Fixed: Could toggle trees and caves on superflat, but they didn't do anything",
			"Fixed: Lots of other small random bugs that I didn't bother to write down",
			"Changed: Main menu background, updated by @danielkshin via GitHub",
		]
	},
	{
		date: "2024-04-29",
		version: "0.8.1",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Added: Lighting",
			"Added: Lots of blocks",
			"Added: Fences and lanterns",
			"Added: Rivers and flowers",
			"Added: /commands (use /help <command> for details)",
			"Added: Fullscreen button",
			"Added: Multiplayer",
			"Changed: Save codes are now around 7x smaller",
			"Changed: Title page is now an image (I'll make it higher resolution later)",
			"Changed: Inventory now has tabs and scrolling and block names",
			"Changed: Textures are encoded differently",
			"Changed: The source code was split into multiple files",
			"Removed: \"Enter\" no longer changes block types",
			"Optimized: World gen is now around 20x faster",
			"Optimized: Cave generation was re-written in C and compiled to WASM, then multithreaded with Web Workers to speed up world gen",
		]
	},
	{
		date: "2024-05-02",
		version: "0.8.2",
		versionLink: "https://www.khanacademy.org/computer-programming/minekhan/5647155001376768",
		creditName: "Willard",
		creditLink: "https://www.khanacademy.org/profile/willllard/projects",
		changes: [
			"Added: Inner and outer corner stairs",
			"Added: /time command; control the sun!",
			"Fixed: Stair/slab collision bugs",
			"Fixed: Weird lines between blocks",
			"Fixed: Crash on old Safari versions (from weird function hoisting behavior)",
			"Fixed: Un-rotated stairs from old saves. Only applies if it hasn't been saved over in 0.8.1",
			"Changed: Fences have fence-shaped hitboxes now (let me know if you prefer it like that or not)",
			"Changed: Fences no longer connect to non-solid blocks"
		]
	},
	{
		date: "2025-02-03",
		version: "0.8.3",
		creditName: "jkcoderdev",
		creditLink: "https://github.com/jkcoderdev",
		changes: [
			"Fix build path error on Windows"
		]
	},
	{
		date: "2025-04-21",
		version: "0.8.3",
		versionLink: "https://willard.fun/minekhan",
		creditName: "Willard",
		creditLink: "https://github.com/Willard21",
		changes: [
			"Added \"Controls\" page in Options",
			"Added \"Change Log\" page to the homepage",
			"Removed: Ctrl clicking no longer places blocks by default (you can still bind it in the options)",
		]
	},
]

changeList.sort((a, b) => b.date.localeCompare(a.date))

const list = document.getElementById("changelog-list")
for (let {date, version, creditName, creditLink, versionLink, changes} of changeList) {
	let li = document.createElement("li")
	li.innerHTML = `Version: ${versionLink ? `<a href=${versionLink} target="_blank">${version}</a>` : version}<br>
		Date: ${date}<br>
		Credit: ${creditLink ? `<a href=${creditLink} target="_blank">${creditName}</a>` : creditName}<br>
		Changes:<br>
		<ul>${changes.map(change => `<li>${change}</li>`).join("")}</ul>`
	li.style.marginBottom = "20px"
	list.appendChild(li)
}
const changelog = document.getElementById("changelog-container")
export { changelog }