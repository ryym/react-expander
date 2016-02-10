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
  'test:dest'
]);

// Test pre-transpiled sources directly.
gulp.task('test', ['test:prepare'], () => {
  return runTests($.GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});

// Test transpiled sources.
gulp.task('test:dest', ['build', 'test:prepare:dest'], () => {
  return runTests($.GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});

gulp.task('test:watch', ['test:prepare'], () => {
  function test() {
    runTests($.GLOB.spec, { reporter: 'dot' })
      .catch(e => console.log(e.stack));
  }

  const sourceFiles = glob.sync($.GLOB.src, { realpath: true });
  gulp.watch($.GLOB.src, () => {
    // Reload all source files.If we refresh only the changed file,
    // the files required in it don't be refreshed.
    sourceFiles.forEach(f => clearModuleCache(f));
    test();
  });
  $.runAndWatch($.GLOB.test, null, () => test());
});

gulp.task('test:prepare', () => {
  registerBabelHook({
    plugins: [
      moduleAliasPlugin({ '$src': $.PATH.src })
    ]
  });
  loadTestHelpers();
});

gulp.task('test:prepare:dest', () => {
  registerBabelHook({
    plugins: [
      moduleAliasPlugin({ '$src': $.PATH.dest })
    ]
  });
  loadTestHelpers();
});

function loadTestHelpers() {
  require(`${$.root}/test/mocha-env`);
}

function registerBabelHook(options) {
  require('babel-core/register')(options || {});
}

function moduleAliasPlugin(modules) {
  const options = Object.keys(modules).map(alias => {
    return { src: modules[alias], expose: alias };
  });
  return ['module-alias', options];
}
