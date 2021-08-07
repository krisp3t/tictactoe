const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

module.exports = {
	entry: {
		vendor: "./src/vendor.js",
		main: "./src/index.js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
		new SpriteLoaderPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ["html-loader"],
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				type: "asset",
			},
			{
				test: /\.svg$/,
				use: ["svg-sprite-loader", "svgo-loader"],
			},
		],
	},
	resolveLoader: {
		extensions: [".ts", ".js"],
		modules: [path.join(__dirname, "node_modules")],
	},
	resolve: {
		modules: [path.join(__dirname, "node_modules")],
	},
};
