const path = require('path');
const HtmlWebapckPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
  },
  devServer: {
      contentBase: './dist'
  },
  plugins: [
      new HtmlWebapckPlugin({
          filename: 'index.html',
          template: './src/index.html'
      })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}