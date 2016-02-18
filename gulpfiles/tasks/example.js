const gulp = require('gulp');
const cp = require('child_process');

/**
 * Change the current directory to
 * the example directory.
 * @return {void}
 */
function gotoExampleDir() {
  process.chdir('./example');
}

/**
 * Run the specified npm script.
 * @param {string} scriptName
 * @return {Object} A process object returned from `child_process.spawn`.
 */
function runNpmScript(scriptName) {
  return cp.spawn('npm', [ 'run', scriptName ], {
    stdio: 'inherit'
  });
}

gulp.task('eg:dev', () => {
  gotoExampleDir();
  runNpmScript('dev');
});

gulp.task('eg:build', done => {
  gotoExampleDir();
  const build = runNpmScript('build');
  build.on('exit', done);
});
