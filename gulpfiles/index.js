const gulp = require('gulp');
const glob = require('glob');
const ghPages = require('gulp-gh-pages');
const $ = require('./tasks/_shared');

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

gulp.task('ghpages', ['eg:build'], () => {
  return gulp.src(`${$.PATH.eg}/build/**/*`)
    .pipe(ghPages({
      message: 'Update by gulp-gh-pages',
      cacheDir: `${$.root}/.gh-pages`
    }));
});
