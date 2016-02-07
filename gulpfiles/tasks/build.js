const gulp  = require('gulp');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const $     = require('./_shared');

gulp.task('build', () => {
  return gulp.src($.GLOB.src)
    .pipe(babel())
    .pipe(gulp.dest($.PATH.dest));
});

gulp.task('watch', () => {
  function transform(path) {
    return gulp.src(path)
      .pipe(babel())
      .on('error', e => console.log(e.stack))
      .pipe(gulp.dest($.PATH.dest));
  }

  gulp.watch($.GLOB.src, event => {
    gutil.log(gutil.colors.cyan('babel:'), event.path);
    transform(event.path);
  });

  return transform($.GLOB.src);
});
