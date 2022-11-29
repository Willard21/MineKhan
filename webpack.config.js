const HtmlWebpackPlugin = require("html-webpack-plugin")
const InlinePlugin = require("html-inline-script-webpack-plugin")
const path = require("path")

// Build straight into production if building on my VPS
let output = "./dist"
if (__dirname.includes("willard/server/dev")) {
	output = "../../public/minekhan"
}

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
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		// new InlinePlugin(),
	],
	watch: true,
	watchOptions: {
		aggregateTimeout: 100,
		// poll: 1000,
		ignored: '**/node_modules',
	},
}
