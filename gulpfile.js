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
  test: path.join(__dirname, 'test')
};

const GLOB = {
  src: `${PATH.src}/*.js`,
  test: `${PATH.test}/**/*.js`,
  spec: `${PATH.test}/**/*.spec.js`,
  dest: `${PATH.dest}/*.js`
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
  return gulp.src(GLOB.src)
    .pipe(babel())
    .pipe(gulp.dest(PATH.dest));
});

gulp.task('watch', () => {
  function transform(path) {
    gulp.src(path)
      .pipe(babel())
      .on('error', e => console.log(e.stack))
      .pipe(gulp.dest(PATH.dest));
  }

  transform(GLOB.src);
  gulp.watch(GLOB.src, event => {
    gutil.log(colors.cyan('babel:'), event.path);
    transform(event.path);
  });
});

gulp.task('test:all', [
  'lint:all',
  'test:prepare',
  'test'
]);

gulp.task('test', ['build', 'test:prepare'], () => {
  return runTests(GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});

gulp.task('test:watch', ['watch', 'test:prepare'], () => {
  function test() {
    runTests(GLOB.spec, { reporter: 'dot' })
      .catch(e => console.log(e.stack));
  }

  test();
  gulp.watch([GLOB.test, GLOB.dest], event => {
    clearModuleCache(event.path);  // Need to refresh dest files.
    test();
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
  lintFiles(GLOB.src, LINT_CONF.src, true);
});

gulp.task('lint:test', () => {
  lintFiles(GLOB.test, LINT_CONF.test, true);
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

  lintAndReport(GLOB.src, linters.src);
  lintAndReport(GLOB.test, linters.test);

  gulp.watch(GLOB.src, event => {
    lintAndReport(event.path, linters.src);
  });
  gulp.watch(GLOB.test, event => {
    lintAndReport(event.path, linters.test);
  });
});
