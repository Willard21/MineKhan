const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');
const fs = require('fs');

// hacky way to remove refference to the files but hey, it works
const template = fs.readFileSync('./src/index.html', 'utf8').replace('<link rel="stylesheet" href="index.css">', '').replace('<script type="module" src="index-test.js"></script>', '');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: template
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'main',
    })
  ],
};