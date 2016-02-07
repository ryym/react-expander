const path = require('path');

const root = path.resolve(__dirname, '..', '..');
exports.root = root;

const PATH = {
  src: path.join(root, 'src'),
  dest: path.join(root, 'lib'),
  test: path.join(root, 'test')
};
exports.PATH = PATH;

const GLOB = {
  src: `${PATH.src}/*.js`,
  test: `${PATH.test}/**/*.js`,
  spec: `${PATH.test}/**/*.spec.js`,
  dest: `${PATH.dest}/*.js`
};
exports.GLOB = GLOB;
