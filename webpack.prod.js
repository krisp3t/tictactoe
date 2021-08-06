const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
	mode: "production",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[contenthash].bundle.js",
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: { esModule: false },
					},
					{ loader: "css-loader" },
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["postcss-preset-env"],
							},
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: { esModule: false },
					},
					{ loader: "css-loader" },
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: ["postcss-preset-env"],
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
});
