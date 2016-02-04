import assert from 'power-assert';
import {
  allowExpandingIn,
  beExpandable
} from '$lib';

describe('index file', function() {
  it('exports allowExpandingIn', () => {
    assert(typeof allowExpandingIn === 'function');
  });

  it('exports beExpandable', () => {
    assert(typeof beExpandable === 'function');
  });
});
