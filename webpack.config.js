const HtmlWebpackPlugin = require("html-webpack-plugin")
const InlinePlugin = require("html-inline-script-webpack-plugin")
const path = require("path")
const fs = require('fs')

let plugins = [
	new HtmlWebpackPlugin({
		template: './src/index.html',
		inject: "body",
	})
]

// Build to the dist folder by default
let output = "./dist"

// If I'm coding on my VPS, build to the beta page on willard.fun
if (__dirname.includes("willard/server/dev")) {
	output = "../../public/minekhan/beta"
}

// If I'm coding on my desktop, and have my VPS mounted, build to the beta page on willard.fun
else if (__dirname.includes("/home/willard/Desktop/MineKhan")) {
	if (fs.readdirSync("/home/willard/vps").includes("server")) {
		output = "/home/willard/vps/server/public/minekhan/beta"
	}
}

// Bundle the JS into the HTML file; makes debugging harder, and breaks webpack's auto build
// plugins.push(new InlinePlugin())

module.exports = {
	mode: "none",
	entry: "./src/main.js",
	output: {
		path: path.resolve(__dirname, output),
		filename: "main.js",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(txt|glsl)$|workers\//i,
				use: "raw-loader",
			},
		],
	},
	plugins,
	watch: true,
	watchOptions: {
		aggregateTimeout: 100,
		// poll: 1000,
		ignored: '**/node_modules',
	},
}
