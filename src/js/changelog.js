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
			"Added textures",
			"Added inventory with 29 blocks",
			"Added chunks with chunk-based rendering",
			"Added mouse controls with screen lock",
			"Added occular occlusion (shadows in block corners)",
			"Added frustum culling (chunks behind the player aren't rendered)",
			"Stopped rendering hidden block faces",
			"Removed Processing.js dependency (everything is raw WebGL)",
			"Removed save codes (world format changed)",
			"Improved performance (Can render as much as the GPU can handle)"
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
			"Added Changelog page to the homepage"
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