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
import beExpandable from '$lib/beExpandable';
import Div from './Div';

describe('beExpandable', function() {
  function renderExpandable(Wrappee, props, options) {
    const Expandable = beExpandable(Wrappee, options);
    return renderIntoDocument(<Expandable {...props} />);
  }

  describe('wrapping', () => {
    const expander = {};

    it('requires expander as a prop', () => {
      assert.throws(() => {
        renderExpandable(Div, {});
      });
    });

    it('does not add external DOM element', () => {
      const div = renderIntoDocument(<Div />);
      const expandable = renderExpandable(Div, { expander });
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
      const expandable = renderExpandable(Div, { expander });
      const wrappee = findWithType(expandable, Div);

      assert(wrappee);
    });

    it('gives width and height to wrapped component', () => {
      const size = { width: 100, height: 100 };
      const expandable = renderExpandable(Div, { expander, size });
      const div = findWithType(expandable, Div);
      const { width, height } = div.props;

      assert.deepEqual({ width, height }, size);
    });

    it('passes all the given props to wrapped component', () => {
      const size = { width: 100, height: 100 };
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

      const divProps = Object.assign({}, div.props);
      delete divProps.children;
      assert.deepEqual(divProps, Object.assign(props, size));
    });

    it('passes its children to wrapped component', () => {
      const ExpandableDiv = beExpandable(Div);
      const expandable = renderIntoDocument(
        <ExpandableDiv expander={{}}>
          <div className="child-div"></div>
        </ExpandableDiv>
      );

      const child = findWithClassName(expandable, 'child-div');
      assert(child);
    });
  });

  describe('expander element', () => {
    const expander = {};

    it('renders expander element', () => {
      const expandable = renderExpandable(Div, {
        expander,
        expanderProps: { className: 'expander' }
      });
      const _expander = findWithClassName(expandable, 'expander');

      assert(_expander);
    });

    it('has a specified props', () => {
      const expanderProps = {
        className: 'expander',
        ref: 'expander',
        onClick: sinon.spy()
      };
      const expandable = renderExpandable(Div, {
        expander, expanderProps
      });
      const _expander = expandable.refs.expander;

      // NOTE: React warns if we access '.props' of DOM component directly.
      assert(_expander.className, 'expander');

      Simulate.click(_expander);
      assert(expanderProps.onClick.calledOnce);
    });

    it('starts resizing on mouse down', () => {
      const expander = {
        startResizing: sinon.spy()
      };
      const expandable = renderExpandable(Div, {
        expander,
        expanderProps: { className: 'expander' }
      });
      const _expander = findWithClassName(expandable, 'expander');

      Simulate.mouseDown(_expander);
      assert(expander.startResizing.calledOnce);
    });
  });

  describe('conector', () => {
    it('has functions that are necessary to handle expanding', () => {
      const expandable = renderExpandable(Div, { expander: {} });
      const connector = expandable.makeConnector();

      assert.deepEqual(
        Object.keys(connector),
        ['handleExpand', 'getCurrentSizes']
      );
    });
  });

  describe('#updateSizes()', () => {
    const expander = {};

    it('passes given width and height to wrapped component', () => {
      const nextSizes = { width: 200, height: 200 };
      const expandable = renderExpandable(Div, {
        expander,
        size: { width: 100, height: 100 }
      });
      const div = findWithType(expandable, Div);

      expandable.updateSizes(nextSizes);
      const { width, height } = div.props;
      assert.deepEqual({ width, height }, nextSizes);
    });
  });

  describe('#getCurrentSizes()', () => {
    it('returns current witdh and height of wrapped component', () => {
      const expandable = renderExpandable(Div, {
        expander: {},
        size: { width: 150, height: 150 }
      });
      assert.deepEqual(
        expandable.getCurrentSizes(),
        { width: 150, height: 150 }
      );

      expandable.setState({ width: 200, height: 200 });
      assert.deepEqual(
        expandable.getCurrentSizes(),
        { width: 200, height: 200 }
      );
    });
  });

});
