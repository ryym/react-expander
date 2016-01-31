import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName,
  scryRenderedDOMComponentsWithTag as scryWithTag
} from 'react-addons-test-utils';
import assert from 'power-assert';
import allowExpandingIn from '$lib/allowExpandingIn';
import Div from './Div'

describe('allowExpandingIn', function() {
  function renderAllower(Container, props = {}) {
    const Allower = allowExpandingIn(Container);
    return renderIntoDocument(<Allower {...props} />);
  }

  it('renders a wrapped component', () => {
    const allower = renderAllower(Div);
    const div = findWithType(allower, Div);

    assert(div);
  });

  it('passes all the given props to wrapped component', () => {
    const props = {
      foo: 'foo',
      bar: 100,
      callback: () => 1
    };
    const allower = renderAllower(Div, props);
    const div = findWithType(allower, Div);

    const { foo, bar, callback } = div.props;
    assert.deepEqual({ foo, bar, callback }, props);
  });

  it('passes its children to wrapped component', () => {
    const Allower = allowExpandingIn(Div);
    const allower = renderIntoDocument(
      <Allower>
        <span className="child-span" />
      </Allower>
    );
    const child = findWithClassName(allower, 'child-span');
    assert(child);
  });

  it('gives expandHandlers to wrapped component', () => {
    const allower = renderAllower(Div);
    const div = findWithType(allower, Div);
    assert(div.props.expandHandlers);
  });

  it('gives expander to wrapped component', () => {
    const allower = renderAllower(Div);
    const div = findWithType(allower, Div);
    assert(div.props.expander);
  });

  describe('expandHandlers', () => {
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
