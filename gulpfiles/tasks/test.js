const gulp  = require('gulp');
const glob  = require('glob');
const Mocha = require('mocha');
const $     = require('./_shared');

/**
 * Clear cached module to enable to re-require the module.
 * @param {string} path - The module path.
 * @return {void}
 */
function clearModuleCache(path) {
  delete require.cache[path];
}

/**
 * Run tests by mocha.
 * @param {string} pattern - The pattern of test files.
 * @param {Object} options - The options passed to mocha.
 * @return {Promise} Will be resolved after running all tests.
 *     The argument is an exit code. If any runtime errors occured,
 *     this promise will be rejected.
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => {
    clearModuleCache(file);  // For watching
    mocha.addFile(file);
  });
  return new Promise((resolve, reject) => {
    try {
      mocha.run(resolve);
    } catch(e) {
      reject(e);
    }
  });
}


gulp.task('test:all', [
  'lint:all',
  'test:prepare',
  'test'
]);

gulp.task('test:prepare', () => {
  const testHelpers = [
    'babel-core/register',
    `${$.root}/test/mocha-env`
  ];
  testHelpers.forEach(path => require(path));
});

gulp.task('test', ['build', 'test:prepare'], () => {
  return runTests($.GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});

gulp.task('test:watch', ['watch', 'test:prepare'], () => {
  const watchTargets = [$.GLOB.test, $.GLOB.dest];
  $.runAndWatch(watchTargets, null, path => {
    path && clearModuleCache(path);  // Need to refresh dest files.
    runTests($.GLOB.spec, { reporter: 'dot' })
      .catch(e => console.log(e.stack));
  });
});
