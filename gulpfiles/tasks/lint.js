const gulp   = require('gulp');
const eslint = require('eslint');
const $      = require('./_shared');

const LINT_CONF = {
  src: {
    envs: ['node']
  },
  test: {
    envs: ['node', 'mocha'],
    rules: {
      'no-console': 1
    }
  },
  gulp: {
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
 * Lint sources by eslint. Throws an Error if any errors are found.
 * @param {string} pattern - The target file pattern.
 * @param {Object} configs - The config passed to eslint.CLIEngine.
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


gulp.task('lint:all', [
  'lint',
  'lint:gulp',
  'lint:eg'
]);

gulp.task('lint', [
  'lint:src',
  'lint:test'
]);

gulp.task('lint:src', () => {
  lintFiles($.GLOB.src, LINT_CONF.src, true);
});

gulp.task('lint:test', () => {
  lintFiles($.GLOB.test, LINT_CONF.test, true);
});

gulp.task('lint:gulp', () => {
  lintFiles('./gulpfiles/**/*.js', LINT_CONF.gulp, true);
});

gulp.task('lint:eg', () => {
  lintFiles(`${$.PATH.eg}/**/*.js`, LINT_CONF.eg, true);
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

  $.runAndWatch($.GLOB.src, $.GLOB.src, path => {
    lintAndReport(path, linters.src);
  });
  $.runAndWatch($.GLOB.test, $.GLOB.test, path => {
    lintAndReport(path, linters.test);
  });
});
