import assert from 'power-assert';
import {
  calculators
} from '$src/SizeCalculator';

/**
 * Execute parametarized test.
 */
function itEach(testName, params, testBody) {
  const makeTestName = typeof testName === 'function'
    ? testName : () => testName;

  params.forEach(param => {
    it(makeTestName(param), () => {
      testBody(...param);
    });
  });
}

describe('calculators', () => {
  function testEach(calculator, params) {
    itEach(
      param => `handles ${JSON.stringify(param[0])}`,
      params, (args, out) => {
        assert.equal(calculator(...args), out);
      }
    );
  }

  describe('.top()', () => {
    testEach(calculators.top, [
      [[100, 30, 40], 90],
      [[100, 30, 10], 120],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.bottom()', () => {
    testEach(calculators.bottom, [
      [[100, 30, 40], 110],
      [[100, 30, 10], 80],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.left()', () => {
    testEach(calculators.left, [
      [[100, 30, 40], 90],
      [[100, 30, 10], 120],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.right()', () => {
    testEach(calculators.right, [
      [[100, 30, 40], 110],
      [[100, 30, 10], 80],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.asIs()', () => {
    testEach(calculators.asIs, [
      [[100], 100],
      [[200], 200]
    ]);
  });
});
