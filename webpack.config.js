var path = require('path')
var webpack = require('gulp-webpack')

var entryConfig = require('./entry.config.js');

module.exports = {
  entry: entryConfig,
  output: {
        filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}

