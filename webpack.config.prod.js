'use strict';

const webpack = require('webpack');

const execSync = require('child_process').execSync;

var moment = require('moment');

var git = require('git-rev-sync');

var date = moment().format('YYYYMMDD');

var version = date + '.' + git.short();

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
var entrance = 'public/index.js';

var versionCss = 'styles.' + version + '.css';
var versionJs = 'bundle.' + version + '.js';


var entry = {};
entry[versionJs] =  __dirname + '/public/index.js';
entry['shimsbundle.js'] = __dirname + '/public/shims.js';

module.exports = {

  // devtool: 'eval', // build 最快，尺寸最大
  // devtool: 'source-map',
  // devtool: 'cheap-module-source-map',
  // 测试发现设置 devtool source 与否对尺寸没影响

  // 为了使用变量做 key，此处 entry 用变量
  entry: entry,

  output: {
    path: __dirname + '/dist',
    filename: '[name]'
    // filename: versionJs
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
  postcss: [
        require('postcss-cssnext')({
            browsers: ['> 0%']
        })
    ],
  plugins: [
    new ExtractTextPlugin(versionCss, {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // 第三方库中，有很多类似 process.env.NODE_ENV !== 'production'
    // 的条件代码，设置 production 后使用 uglifyjs 可以把这些删掉。
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    new webpack.optimize.UglifyJsPlugin({

      // 选项参考：https://github.com/webpack/webpack/issues/1205#issuecomment-154840823
      compress: {
        warnings: false,
        properties: true,
        sequences: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        unused: true,
        loops: true,
        hoist_funs: true,
        cascade: true,
        if_return: true,
        join_vars: true,
        //drop_console: true,
        drop_debugger: true,
        unsafe: true,
        hoist_vars: true,
        negate_iife: true,
        //side_effects: true
      },
      //sourceMap: true,
      mangle: {

        // 根据 es6/es5 shims 的 package.json，build 时 keep fnames 才能保证正常
        // https://github.com/es-shims/es6-shim/blob/master/package.json#L45
        // https://github.com/es-shims/es5-shim/blob/master/package.json#L26
        keep_fnames: true,

        toplevel: true,
        sort: true,
        eval: true,
        properties: true
      },
      output: {
        space_colon: false,
        comments: false,
      }
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};

function cdnReplace() {
  var layoutTemplate = "public/views/layout.jsx";
  // var cdn = 'http://cdn3.yunzhanghu.com';
  var cdn = '';

  var cssLine = 'link.*styles.*link';
  var jsLine = 'script.*bundle.*script';

  var cdnCss = cdn + '/' + versionCss;
  var cdnJs = cdn + '/' + versionJs;

  var cdnCssLine = "<link rel=\"stylesheet\" href=\"" + cdnCss + "\"></link>";
  var cdnJsLine = "<script src=\"" + cdnJs + "\"></script>";

  var cssSedParams = "-i '/" + cssLine + "/c\\" + cdnCssLine + "' " + layoutTemplate;
  var jsSedParams = "-i '/" + jsLine + "/c\\" + cdnJsLine + "' " + layoutTemplate;

  // mac 上用 gsed，linux 上用 sed
  execSync("type gsed"
           + " && gsed " + cssSedParams
           + " || sed " + cssSedParams);
  execSync("type gsed"
           + " && gsed " + jsSedParams
           + " || sed " + jsSedParams);

}

cdnReplace();
