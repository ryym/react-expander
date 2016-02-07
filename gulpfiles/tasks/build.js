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
  return $.runAndWatch($.GLOB.src, $.GLOB.src, path => {
    gutil.log(gutil.colors.cyan('babel:'), path);
    return gulp.src(path)
      .pipe(babel())
      .on('error', e => console.log(e.stack))
      .pipe(gulp.dest($.PATH.dest));
  });
});
