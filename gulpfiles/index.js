const gulp = require('gulp');
const glob = require('glob');

// Load all tasks.
const taskFiles = glob.sync(__dirname + '/tasks/!(_)*.js');
taskFiles.forEach(file => require(file));

gulp.task('default', [
  'lint:watch',
  'test:watch'
]);

gulp.task('check', [
  'lint:all',
  'test:dest'
]);
