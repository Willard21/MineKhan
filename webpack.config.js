const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const path = require("path");

// I know it's a bad idea, but I don't really care.
let output = "./dist";
if (__dirname.includes("willard/server/dev")) {
	output = "../../public/minekhan";
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
				test: /\.(txt|glsl|jsw)$/i,
				use: "raw-loader",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new ScriptExtHtmlWebpackPlugin({
			inline: "main",
		}),
	],
};
