const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');

module.exports = [{
  name: 'production',
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
      template: './src/index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'main',
    })
  ],
}, {
  name: 'test',
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './test'),
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
      template: './src/index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'main',
    })
  ],
}];