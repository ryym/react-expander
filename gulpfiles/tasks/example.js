const gulp = require('gulp');
const $ = require('./_shared');
const onpm = require('othernpm')($.PATH.eg);

gulp.task('eg:dev', () => {
  onpm('run dev');
});

gulp.task('eg:build', done => {
  onpm('run build').on('exit', done);
});
