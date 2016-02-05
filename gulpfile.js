const path   = require('path');
const gulp   = require('gulp');
const babel  = require('gulp-babel');
const glob   = require('glob');
const Mocha  = require('mocha');
const eslint = require('eslint');
const gutil  = require('gulp-util');
const colors = gutil.colors;

const PATH = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'lib'),
  test: path.join(__dirname, 'test'),
  testFilePattern: './test/**/*.spec.js'
};

const TEST_HELPERS = [
  'babel-core/register',
  './test/mocha-env'
];

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
 * @return {Promise} Will be resolved if all the tests pass.
 */
function runTests(pattern) {
  const mocha = new Mocha();
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => {
    clearModuleCache(file);  // For watching
    mocha.addFile(file);
  });
  return new Promise((resolve, reject) => {
    mocha.run(failed => failed ? reject() : resolve());
  });
}

/**
 * Lint sources by eslint. Throws an error if any problems are found.
 * @param {string} pattern - The target file pattern.
 * @param {Object} options - The option passed to {@code eslint.CLIEngine}.
 * @return {void}
 */
function lintFiles(pattern, options) {
  const linter = new eslint.CLIEngine(options);
  const files = glob.sync(pattern);
  const report = linter.executeOnFiles(files);
  const formatter = linter.getFormatter();
  console.log(formatter(report.results));

  if (0 < report.errorCount || (options.strict && 0 < report.warningCount)) {
    throw new Error('eslint reports some problems.');
  }
}

// -------------------------------------------------------------
// Tasks
// -------------------------------------------------------------

gulp.task('default', [
  'test:watch'
]);

gulp.task('build', () => {
  return gulp.src(`${PATH.src}/*.js`)
    .pipe(babel())
    .pipe(gulp.dest(PATH.dest));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(`${PATH.src}/*.js`, event => {
    gutil.log(colors.cyan('babel:'), event.path);
    gulp.src(event.path)
      .pipe(babel())
      .on('error', e => console.log(e.stack))
      .pipe(gulp.dest(PATH.dest));
  });
});

gulp.task('test:all', [
  'lint:all',
  'test:prepare',
  'test'
]);

gulp.task('test', ['build', 'test:prepare'], () => {
  return runTests(PATH.testFilePattern)
    .catch(() => process.exit(1));
});

gulp.task('test:watch', ['watch', 'test:prepare'], () => {
  runTests(PATH.testFilePattern);
  const files = [
    `${PATH.test}/**/*.js`,
    `${PATH.dest}/*.js`
  ];
  gulp.watch(files, event => {
    clearModuleCache(event.path);
    runTests(PATH.testFilePattern);
  });
});

gulp.task('test:prepare', () => {
  TEST_HELPERS.forEach(path => require(path));
});

gulp.task('lint:all', [
  'lint',
  'lint:gulpfile'
]);

gulp.task('lint', [
  'lint:src',
  'lint:test'
]);

gulp.task('lint:src', () => {
  lintFiles(`${PATH.src}/*.js`, {
    strict: true
  });
});

gulp.task('lint:test', () => {
  lintFiles(`${PATH.test}/**/*.js`, {
    envs: ['node', 'mocha'],
    rules: {
      'no-console': 1
    }
  });
});

gulp.task('lint:gulpfile', () => {
  lintFiles('./gulpfile.js', {
    envs: ['node'],
    rules: {
      'no-multi-spaces': 0,
      'no-console': 0
    }
  });
});
