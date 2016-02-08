import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName
} from 'react-addons-test-utils';
import assert from 'power-assert';
import sinon from 'sinon';
import allowExpandingIn from '$src/allowExpandingIn';
import Div from './Div';

describe('allowExpandingIn', function() {
  function renderAllower(Container, props = {}) {
    const Allower = allowExpandingIn(Container);
    const allower = renderIntoDocument(<Allower {...props} />);
    const container = findWithType(allower, Container);
    return { allower, container };
  }

  function asEventObject(object) {
    return Object.assign({
      preventDefault() {},
      stopPropagation() {}
    }, object);
  }

  it('renders a wrapped component', () => {
    const { container } = renderAllower(Div);
    assert(container);
  });

  it('passes all the given props to the wrapped component', () => {
    const props = {
      foo: 'foo',
      bar: 100,
      callback: () => 1
    };
    const { container } = renderAllower(Div, props);
    const { foo, bar, callback } = container.props;

    assert.deepEqual({ foo, bar, callback }, props);
  });

  it('passes its children to the wrapped component', () => {
    const Allower = allowExpandingIn(Div);
    const allower = renderIntoDocument(
      <Allower>
        <span className="child-span" />
      </Allower>
    );
    const child = findWithClassName(allower, 'child-span');
    assert(child);
  });

  it('gives expandHandlers to the wrapped component', () => {
    const { container } = renderAllower(Div);
    assert(container.props.expandHandlers);
  });

  it('gives expander to the wrapped component', () => {
    const { container } = renderAllower(Div);
    assert(container.props.expander);
  });

  describe('expandHandlers', () => {
    context('while resizing', () => {
      describe('#onMouseMove()', () => {
        it('calls this#expand()', () => {
          const { allower, container } = renderAllower(Div);
          const { expandHandlers } = container.props;

          allower.expand = sinon.spy();
          expandHandlers.onMouseMove({});
          assert(allower.expand.calledOnce);
        });
      });

      describe('#onMouseUp()', () => {
        it('calls this#stopResizing()', () => {
          const { allower, container } = renderAllower(Div);
          const { expandHandlers } = container.props;

          allower.stopResizing = sinon.spy();
          expandHandlers.onMouseUp({});
          assert(allower.stopResizing.calledOnce);
        });
      });

      describe('#onMouseLeave()', () => {
        it('calls this#stopResizing()', () => {
          const { allower, container } = renderAllower(Div);
          const { expandHandlers } = container.props;

          allower.stopResizing = sinon.spy();
          expandHandlers.onMouseLeave({});
          assert(allower.stopResizing.calledOnce);
        });
      });
    });
  });

  describe('#startResizing()', () => {
    it('stores a given connector object', () => {
      const { allower } = renderAllower(Div);
      const connector = {};
      allower.startResizing(connector);
      assert.equal(allower._connector, connector);
    });
  });

  describe('#stopResizing()', () => {
    it('notifies connector that resizing finished', () => {
      const { allower } = renderAllower(Div);
      const stopResizing = sinon.spy();
      allower._connector = { stopResizing };
      allower.stopResizing();
      assert(stopResizing.calledOnce);
    });

    it('clears a stored connector object', () => {
      const { allower } = renderAllower(Div);
      allower._connector = { stopResizing: () => {} };
      allower.stopResizing();
      assert.equal(allower._connector, undefined);
    });
  });

  describe('#expand()', () => {
    it('calls connector#expand()', () => {
      const { allower } = renderAllower(Div);
      const expand = sinon.spy();
      const event = asEventObject({ clientX: 100, clientY: 120 });

      allower._connector = { expand };
      allower.expand(event);
      assert.deepEqual(expand.args[0], [event]);
    });
  });
});
