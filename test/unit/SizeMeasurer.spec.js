import assert from 'power-assert';
import {
  measures,
  normalizeDirections
} from '$src/SizeMeasurer';

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

describe('measures', () => {
  function testEach(calculator, params) {
    itEach(
      param => `handles ${JSON.stringify(param[0])}`,
      params, (args, out) => {
        assert.equal(calculator(...args), out);
      }
    );
  }

  describe('.top()', () => {
    testEach(measures.top, [
      [[100, 30, 40], 90],
      [[100, 30, 10], 120],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.bottom()', () => {
    testEach(measures.bottom, [
      [[100, 30, 40], 110],
      [[100, 30, 10], 80],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.left()', () => {
    testEach(measures.left, [
      [[100, 30, 40], 90],
      [[100, 30, 10], 120],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.right()', () => {
    testEach(measures.right, [
      [[100, 30, 40], 110],
      [[100, 30, 10], 80],
      [[100, 20, 20], 100]
    ]);
  });

  describe('.asIs()', () => {
    testEach(measures.asIs, [
      [[100], 100],
      [[200], 200]
    ]);
  });
});

describe('normalizeDirections()', () => {
  itEach(
    params => `handles ${JSON.stringify(params[0])}`,
    [
      [['top'], {
        dirX: 'asIs', dirY: 'top'
      }],
      [['bottom'], {
        dirX: 'asIs', dirY: 'bottom'
      }],
      [['left'], {
        dirX: 'left', dirY: 'asIs'
      }],
      [['right'], {
        dirX: 'right', dirY: 'asIs'
      }],
      [['top left'], {
        dirX: 'left', dirY: 'top'
      }],
      [['bottom right'], {
        dirX: 'right', dirY: 'bottom'
      }],
      [['left bottom'], {
        dirX: 'left', dirY: 'bottom'
      }],
      [['left bottom right'], {
        dirX: 'left', dirY: 'bottom'
      }]
    ],
    ([directions], expected) => {
      const actual = normalizeDirections(directions);
      assert.deepEqual(actual, expected);
    }
  );

  context('with invalid directions', () => {
    itEach(
      param => `throws an error for ${JSON.stringify(param)}`,
      [
        ['top bottom'],
        ['top top'],
        ['left right'],
        ['right right']
      ], arg => {
        assert.throws(() => normalizeDirections(arg));
      }
    );
  });
});
