const path = require('path');
const HtmlTemplatePlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATH = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

module.exports = {
  entry: PATH.src,

  output: {
    path: PATH.build,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: PATH.src
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', [
          'css', 'sass'
        ]),
        include: PATH.src
      }
    ]
  },

  devServer: {
    contentBase: PATH.build,
    iframe: true
  },

  plugins: [
    new HtmlTemplatePlugin({
      template: path.join(PATH.src, 'index.template.html'),
      inject: 'body'
    }),
    new ExtractTextPlugin('styles.css')
  ]
};
