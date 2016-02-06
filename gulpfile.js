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

const LINT_CONF = {
  src: {},
  test: {
    envs: ['node', 'mocha'],
    rules: {
      'no-console': 1
    }
  },
  gulpfile: {
    envs: ['node'],
    rules: {
      'no-multi-spaces': 0,
      'no-console': 0
    }
  },
  eg: {
    globals: ['require'],
    envs: ['browser']
  }
};

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
 * @return {Promise} Will be resolved if all the tests pass.
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
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
 * Lint sources by eslint. Throws an Error if any errors are found.
 * @param {string} pattern - The target file pattern.
 * @param {Object} configs - The config passed to {@code eslint.CLIEngine}.
 * @param {boolean} strict - If true and there are one or more warnings,
 *     an Error is thrown even if there is no errors.
 * @return {void}
 */
function lintFiles(pattern, configs, strict) {
  const linter = new eslint.CLIEngine(configs);
  const report = linter.executeOnFiles([pattern]);
  const formatter = linter.getFormatter();
  console.log(formatter(report.results));

  if (0 < report.errorCount || (strict && 0 < report.warningCount)) {
    throw new Error('eslint reports some problems.');
  }
}

// -------------------------------------------------------------
// Tasks
// -------------------------------------------------------------

gulp.task('default', [
  'test:watch',
  'lint:watch'
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
  const files = [
    `${PATH.test}/**/*.js`,
    `${PATH.dest}/*.js`
  ];

  runTests(PATH.testFilePattern, { reporter: 'dot' });
  gulp.watch(files, event => {
    clearModuleCache(event.path);
    runTests(PATH.testFilePattern, { reporter: 'dot' });
  });
});

gulp.task('test:prepare', () => {
  TEST_HELPERS.forEach(path => require(path));
});

gulp.task('lint:all', [
  'lint',
  'lint:gulpfile',
  'lint:eg'
]);

gulp.task('lint', [
  'lint:src',
  'lint:test'
]);

gulp.task('lint:src', () => {
  lintFiles(`${PATH.src}/*.js`, LINT_CONF.src, true);
});

gulp.task('lint:test', () => {
  lintFiles(`${PATH.test}/**/*.js`, LINT_CONF.test, true);
});

gulp.task('lint:gulpfile', () => {
  lintFiles('./gulpfile.js', LINT_CONF.gulpfile, true);
});

gulp.task('lint:eg', () => {
  lintFiles('./example/src', LINT_CONF.eg, true);
});

gulp.task('lint:watch', () => {
  const linters = {
    src: new eslint.CLIEngine(LINT_CONF.src),
    test: new eslint.CLIEngine(LINT_CONF.test)
  };
  function lintAndReport(path, linter) {
    const report = linter.executeOnFiles([path]);
    const formatter = linter.getFormatter();
    console.log(formatter(report.results));
  }

  lintAndReport(`${PATH.src}/*.js`, linters.src);
  lintAndReport(`${PATH.test}/**/*.js`, linters.test);

  gulp.watch(`${PATH.src}/*.js`, event => {
    lintAndReport(event.path, linters.src);
  });
  gulp.watch(`${PATH.test}/**/*.js`, event => {
    lintAndReport(event.path, linters.test);
  });
});
