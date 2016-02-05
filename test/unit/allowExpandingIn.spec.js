import React from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName
} from 'react-addons-test-utils';
import assert from 'power-assert';
import sinon from 'sinon';
import allowExpandingIn from '$lib/allowExpandingIn';
import Div from './Div';

describe('allowExpandingIn', function() {
  function renderAllower(Container, props = {}) {
    const Allower = allowExpandingIn(Container);
    const allower = renderIntoDocument(<Allower {...props} />);
    const container = findWithType(allower, Container);
    return { allower, container };
  }

  function makeMockConnector(overrides) {
    return Object.assign({
      getCurrentSizes() {
        return { width: 100, height: 100 };
      },
      handleExpand() {}
    }, overrides);
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

  it('passes all the given props to wrapped component', () => {
    const props = {
      foo: 'foo',
      bar: 100,
      callback: () => 1
    };
    const { container } = renderAllower(Div, props);
    const { foo, bar, callback } = container.props;

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
    const { container } = renderAllower(Div);
    assert(container.props.expandHandlers);
  });

  it('gives expander to wrapped component', () => {
    const { container } = renderAllower(Div);
    assert(container.props.expander);
  });

  describe('expandHandlers', () => {
    describe('#isExpanding()', () => {
      it('returns true when called while resizing', () => {
        const connector = makeMockConnector();
        const { container } = renderAllower(Div);
        const { expandHandlers, expander } = container.props;
        expander.startResizing({}, connector);

        assert.equal(expandHandlers.isExpanding(), true);
      });
    });

    context('while resizing', () => {
      describe('#onMouseMove()', () => {
        it('emits new witdh and height to connector#handleExpand()', () => {
          function asCursorPoint([x, y]) {
            return { clientX: x, clientY: y };
          }
          const connector = makeMockConnector({
            handleExpand: sinon.spy()
          });
          const { container } = renderAllower(Div);
          const { expandHandlers, expander } = container.props;
          const points = [
            [0, 0], [10, 10], [20, 20], [30, 30]
          ];
          const width = 100;
          const height = 100;

          expander.startResizing(
            { width, height, clientX: 0, clientY: 0 },
            connector
          );
          points.map(asCursorPoint).forEach(point => {
            expandHandlers.onMouseMove(asEventObject(point));
          });

          const expectedArgs = points.map(([x, y]) => {
            return [{ width: width + x, height: height + y }];
          });
          assert.deepEqual(connector.handleExpand.args, expectedArgs);
        });
      });

      describe('#onMouseUp()', () => {
        it('stops resizing', () => {
          const connector = makeMockConnector();
          const { container } = renderAllower(Div);
          const { expandHandlers, expander } = container.props;
          expander.startResizing({}, connector);
          expandHandlers.onMouseUp({});

          assert(! expandHandlers.isExpanding());
        });
      });

      describe('#onMouseLeave()', () => {
        it('stops resizing', () => {
          const connector = makeMockConnector();
          const { container } = renderAllower(Div);
          const { expandHandlers, expander } = container.props;
          expander.startResizing({}, connector);
          expandHandlers.onMouseLeave({});

          assert(! expandHandlers.isExpanding());
        });
      });
    });
  });

  describe('connector', () => {
    describe('#startResizing()', () => {
      it('starts resizing', () => {
        const connector = makeMockConnector();
        const { container } = renderAllower(Div);
        const { expandHandlers, expander } = container.props;

        assert(! expandHandlers.isExpanding());

        expander.startResizing({}, connector);
        assert(expandHandlers.isExpanding());
      });
    });
  });
});
