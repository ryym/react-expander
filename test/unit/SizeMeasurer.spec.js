import forEach from 'mocha-each';
import assert from 'power-assert';
import {
  measures,
  normalizeDirections
} from '$src/SizeMeasurer';

describe('measures', () => {
  function testEach(measure, params) {
    forEach(params).it(
      param => `handles ${JSON.stringify(param)}`,
      ([originalSize, cursorFrom, cursorTo], updatedSize) => {
        assert.equal(
          measure(originalSize, cursorFrom, cursorTo),
          updatedSize
        );
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
  forEach([
    ['top', {
      dirX: 'asIs', dirY: 'top'
    }],
    ['bottom', {
      dirX: 'asIs', dirY: 'bottom'
    }],
    ['left', {
      dirX: 'left', dirY: 'asIs'
    }],
    ['right', {
      dirX: 'right', dirY: 'asIs'
    }],
    ['top left', {
      dirX: 'left', dirY: 'top'
    }],
    ['bottom right', {
      dirX: 'right', dirY: 'bottom'
    }],
    ['left bottom', {
      dirX: 'left', dirY: 'bottom'
    }],
    ['left bottom right', {
      dirX: 'left', dirY: 'bottom'
    }]
  ])
  .it(
    params => `handles ${JSON.stringify(params)}`,
    (directions, expected) => {
      const actual = normalizeDirections(directions);
      assert.deepEqual(actual, expected);
    }
  );

  context('with invalid directions', () => {
    forEach([
      ['top bottom'],
      ['top top'],
      ['left right'],
      ['right right']
    ])
    .it('throws an error for %j', arg => {
      assert.throws(() => normalizeDirections(arg));
    });
  });
});
