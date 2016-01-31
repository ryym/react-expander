import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName,
  scryRenderedDOMComponentsWithTag as scryWithTag
} from 'react-addons-test-utils';
import assert from 'power-assert';
import beExpandable from '$lib/beExpandable';

describe('allowExpandingIn', function() {

  it('renders a wrapped component');

  it('passes all the given props to wrapped component');

  it('gives expandHandler to wrapped component');

  it('gives expander to wrapped component')

  describe('expandHandler', () => {
    describe('#isExpanding()', () => {
      it('returns true when called while resizing');
    });

    context('before resizing', () => {
      describe('#onMouseMove()', () => {
        it('does nothing');
      });
    });

    context('while resizing', () => {
      beforeEach(() => {
      });

      describe('#onMouseMove()', () => {
        it('emits new witdh and height to expander#handleExpand()');
      });

      describe('#onMouseUp()', () => {
        it('stops resizing');
      });

      describe('#onMouseLeave()', () => {
        it('stops resizing');
      });
    });
  });

  describe('expander', () => {
    describe('#startResizing()', () => {
      it('starts resizing');
    });
  });
});
