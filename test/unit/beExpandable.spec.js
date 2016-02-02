import React from 'react';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  findRenderedComponentWithType as findWithType,
  findRenderedDOMComponentWithClass as findWithClassName,
  scryRenderedDOMComponentsWithTag as scryWithTag,
  isDOMComponent
} from 'react-addons-test-utils';
import assert from 'power-assert';
import beExpandable from '$lib/beExpandable';
import Div from './Div';

describe('beExpandable', function() {
  function renderExpandable(
    Wrappee, props, options = { width: 100, height: 100 }
  ) {
    const Expandable = beExpandable(Wrappee, options);
    return renderIntoDocument(<Expandable {...props} />);
  }

  describe('options', () => {
    it('requires width and height', () => {
      assert.throws(() => {
        beExpandable(<div />, {});
      });
    });
  });

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
      const sizes = { width: 100, height: 100 };
      const expandable = renderExpandable(Div, { expander }, sizes);
      const div = findWithType(expandable, Div);
      const { width, height } = div.props;

      assert.deepEqual({ width, height }, sizes);
    });

    it('passes all the given props to wrapped component', () => {
      const props = {
        expander,
        foo: 'foo',
        bar: 'bar',
        style: { color: 'red', margin: 0 },
        onClick: e => { e.preventDefault(); }
      };
      const sizes = { width: 100, height: 100 };
      const expandable = renderExpandable(Div, props, sizes);
      const div = findWithType(expandable, Div);

      const divProps = Object.assign({}, div.props);
      delete divProps.children;
      assert.deepEqual(divProps, Object.assign(props, sizes));
    });

    it('passes its children to wrapped component', () => {
      const ExpandableDiv = beExpandable(Div, { width: 100, height: 100 });
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
      const expandable = renderExpandable(
        Div, { expander }, {
          width: 100, height: 100,
          expanderProps: { className: 'expander' }
        }
      );
      const _expander = findWithClassName(expandable, 'expander');

      assert(_expander);
    });

    it('has a specified props', () => {
      const expanderProps = {
        className: 'expander',
        foo: 'bar',
        onClick: () => false
      };
      const expandable = renderExpandable(
        Div, { expander }, { width: 100, height: 100, expanderProps }
      );
      const _expander = findWithClassName(expandable, 'expander');

      assert(_expander.props, expanderProps);
    });

    it('starts resizing on mouse down');
  });

  describe('conector', () => {
    it('passes a connector object to `startResizing` function');
  });

  describe('#handleExpand()', () => {
    it('handles resizing and update its state');

    it('passes new witdh and height to wrapped component');
  });

  describe('#getCurrentSizes()', () => {
    it('returns current witdh and height of wrapped component');
  });

});
