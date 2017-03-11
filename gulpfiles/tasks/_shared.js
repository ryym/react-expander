const path = require('path');
const gulp = require('gulp');

const root = path.resolve(__dirname, '..', '..');
exports.root = root;

const PATH = {
  src: path.join(root, 'src'),
  dest: path.join(root, 'lib'),
  test: path.join(root, 'test'),
  eg: path.join(root, 'examples')
};
exports.PATH = PATH;

const GLOB = {
  src: `${PATH.src}/*.js`,
  test: `${PATH.test}/**/*.js`,
  spec: `${PATH.test}/**/*.spec.js`,
  dest: `${PATH.dest}/*.js`
};
exports.GLOB = GLOB;

/**
 * Run the task and watch the specified files.
 * When any of the watched files changes, re-run the task.
 * @param {string} watchPattern - The watch target pattern
 * @param {*} initialValue - The argument of first task call
 * @param {function} task - The task called when any of watched file changes.
 * @return {*} The return value of first task call.
 */
exports.runAndWatch = function(watchPattern, initialValue, task) {
  gulp.watch(watchPattern, event => {
    task(event.path, event);
  });
  return task(initialValue);
};
