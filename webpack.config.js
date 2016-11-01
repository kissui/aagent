'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {

  entry: {
     bundle: __dirname + '/public/index.js',
     shimsbundle: __dirname + '/public/shims.js'
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
    },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize&-autoprefixer!postcss-loader!sass")
       }
    ]
  },
  //为了添加css3 各个浏览器的前缀 postcss-cssnext 为了解决，webpack.config build的时候不添加前缀问题
  //解决此问题的相关链接
  //https://github.com/AngularClass/angular2-webpack-starter/wiki/How-to-include-PostCSS
  //https://github.com/AngularClass/angular2-webpack-starter/issues/644
  postcss: [
        require('postcss-cssnext')({
            browsers: ['> 0%']
        })
    ],
  plugins: [
    new ExtractTextPlugin("styles.css", {
      allChunks: true
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};
