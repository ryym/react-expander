import React from 'react';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName,
  isDOMComponent,
  Simulate
} from 'react-addons-test-utils';
import assert from 'power-assert';
import sinon from 'sinon';
import beExpandable from '$src/beExpandable';
import Div from './Div';

describe('beExpandable', function() {
  function renderExpandable(Wrappee, props) {
    const Expandable = beExpandable(Wrappee);
    return renderIntoDocument(<Expandable {...props} />);
  }

  function makeExpander(props, startResizing) {
    return {
      props, startResizing
    };
  }

  it('requires expander as a prop', () => {
    assert.throws(() => {
      renderExpandable(Div, {});
    });
  });

  it('does not add external DOM element', () => {
    const div = renderIntoDocument(<Div />);
    const expandable = renderExpandable(Div, { expander: {} });
    const elements = findAllInRenderedTree(
      div, e => isDOMComponent(e)
    );
    const wrappedElements = findAllInRenderedTree(
      expandable, e => isDOMComponent(e)
    );

    const nExpander = 1;
    assert.equal(elements.length + nExpander, wrappedElements.length);
  });

  it('renders a wrapped component', () => {
    const expandable = renderExpandable(Div, { expander: {} });
    const wrappee = findWithType(expandable, Div);

    assert(wrappee);
  });

  it('gives width and height to the wrapped component', () => {
    const size = { width: 100, height: 100 };
    const expandable = renderExpandable(Div, { expander: {}, size });
    const div = findWithType(expandable, Div);
    const { width, height } = div.props;

    assert.deepEqual({ width, height }, size);
  });

  it('passes all the given props to the wrapped component', () => {
    const size = { width: 100, height: 100 };
    const expander = {
      props: { className: 'expander' }
    };
    const props = {
      expander,
      size,
      foo: 'foo',
      bar: 'bar',
      style: { color: 'red', margin: 0 },
      onClick: e => { e.preventDefault(); }
    };
    const expandable = renderExpandable(Div, props);
    const div = findWithType(expandable, Div);

    const expectedProps = Object.assign(props, size);
    delete expectedProps.size;
    delete expectedProps.expander;
    const divProps = Object.assign({}, div.props);
    delete divProps.children;

    assert.deepEqual(divProps, expectedProps);
  });

  it('passes its children to the wrapped component', () => {
    const ExpandableDiv = beExpandable(Div);
    const expandable = renderIntoDocument(
      <ExpandableDiv expander={{}}>
        <div className="child-div"></div>
      </ExpandableDiv>
    );

    const child = findWithClassName(expandable, 'child-div');
    assert(child);
  });

  it('renders expander element', () => {
    const expander = makeExpander({
      className: 'expander'
    });
    const expandable = renderExpandable(Div, { expander });
    const _expander = findWithClassName(expandable, 'expander');

    assert(_expander);
  });

  describe('expander element', () => {
    context('by default', () => {
      it('has default style', () => {
        const expander = makeExpander({ ref: 'expander' });
        const expandable = renderExpandable(Div, { expander });
        const _expander = expandable.refs.expander;
        assert(_expander.style);
      });
    });

    context('when noDefaultStyle is set to true', () => {
      it('does not have any default style', () => {
        const expander = makeExpander({
          ref: 'expander',
          noDefaultStyle: true
        });
        const expandable = renderExpandable(Div, { expander });
        const _expander = expandable.refs.expander;
        assert(_expander.style.position === '');
      });
    });

    it('has a specified props', () => {
      const onClick = sinon.spy();
      const expander = makeExpander({
        className: 'expander',
        ref: 'expander',
        onClick
      });
      const expandable = renderExpandable(Div, { expander });
      const _expander = expandable.refs.expander;

      // NOTE: React warns if we access '.props' of DOM component directly.
      assert(_expander.className, 'expander');

      Simulate.click(_expander);
      assert(onClick.calledOnce);
    });

    it('starts resizing on mouse down', () => {
      const expander = makeExpander({
        className: 'expander'
      }, sinon.spy());
      const expandable = renderExpandable(Div, { expander });
      const _expander = findWithClassName(expandable, 'expander');

      Simulate.mouseDown(_expander);
      assert(expander.startResizing.calledOnce);
    });
  });

  describe('connector', () => {
    it('has functions that are necessary to handle expanding', () => {
      const expandable = renderExpandable(Div, { expander: {} });
      const connector = expandable.makeConnector();

      assert.deepEqual(
        Object.keys(connector),
        ['expand', 'stopResizing']
      );
    });
  });

  describe('#startResizing()', () => {
    it('stores starting state', () => {
      const size = { width: 100, height: 100 };
      const expandable = renderExpandable(Div, {
        size, expander: { startResizing: () => {} }
      });
      const cursorPosition = { clientX: 10, clientY: 20 };

      expandable.startResizing(cursorPosition);
      assert.deepEqual(
        expandable._resizedFrom,
        Object.assign(size, cursorPosition)
      );
    });

    it('notifies allower that resizing started', () => {
      const startResizing = sinon.spy();
      const expandable = renderExpandable(Div, {
        expander: { startResizing }
      });

      expandable.startResizing({});
      assert(startResizing.calledOnce);
    });
  });

  describe('#stopResizing()', () => {
    it('clears a stored starting state', () => {
      const expandable = renderExpandable(Div, { expander: {} });
      expandable._resizedFrom = {};
      expandable.stopResizing();
      assert.equal(expandable._resizedFrom, undefined);
    });
  });

  describe('#expand()', () => {
    it('calculates new width and height and update state', () => {
      function asCursorPoint([x, y]) {
        return { clientX: x, clientY: y };
      }
      const points = [
        [0, 0], [10, 10], [20, 20], [30, 30]
      ];
      const width = 100;
      const height = 100;
      const expandable = renderExpandable(Div, { expander: {} });

      expandable._resizedFrom = {
        width, height, clientX: 0, clientY: 0
      };
      expandable.setState = sinon.spy();

      points.forEach(point => {
        expandable.expand(asCursorPoint(point));
      });

      const expectedArgs = points.map(([x, y]) => {
        return [{ width: width + x, height: height + y }];
      });
      assert.deepEqual(expandable.setState.args, expectedArgs);
    });
  });
});
