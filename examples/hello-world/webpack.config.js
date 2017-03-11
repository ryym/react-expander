/* eslint-env node */

const path = require('path');
const HtmlTemplatePlugin = require('html-webpack-plugin');

const PATH = {
  root: path.join(__dirname),
  build: path.join(__dirname, 'build')
};

module.exports = {
  entry: path.join(PATH.root, 'index.js'),

  output: {
    path: PATH.build,
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(PATH.root, 'index.js')
      }
    ]
  },

  devServer: {
    contentBase: PATH.build
  },

  plugins: [
    new HtmlTemplatePlugin({
      template: path.join(PATH.root, 'index.template.html'),
      inject: 'body'
    })
  ]
};

