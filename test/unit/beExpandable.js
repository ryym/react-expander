import React from 'react';
import TestUtils from 'react-addons-test-utils';
import assert from 'power-assert';
import beExpandable from '$lib/beExpandable';

/**
 * A simple div component for tests.
 */
class Div extends React.Component {
  render() {
    return (
      <div className="wrappee">
        {this.props.children}
      </div>
    );
  }
}

describe('beExpandable', function() {
  function renderExpandable(
    Wrappee, props, options = { width: 100, height: 100 }
  ) {
    const Expandable = beExpandable(Wrappee, options);
    return TestUtils.renderIntoDocument(<Expandable {...props} />);
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

    it('does not add external div');

    it('renders a wrapped component', () => {
      const expandable = renderExpandable(Div, { expander });
      const wrappee = TestUtils.findRenderedComponentWithType(expandable, Div);

      assert(wrappee);
    });

    it('gives width and height to wrapped component', () => {
      const sizes = { width: 100, height: 100 };
      const expandable = renderExpandable(Div, { expander }, sizes);
      const div = TestUtils.findRenderedComponentWithType(expandable, Div);
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
      const div = TestUtils.findRenderedComponentWithType(expandable, Div);

      assert.deepEqual(div.props, Object.assign(props, sizes));
    });

    it('passes its children to wrapped component', () => {
      const ExpandableDiv = beExpandable(Div, { width: 100, height: 100 });
      const expandable = TestUtils.renderIntoDocument(
        <ExpandableDiv expander={{}}>
          <div className="child-div"></div>
        </ExpandableDiv>
      );

      const child = TestUtils.findRenderedDOMComponentWithClass(expandable, 'child-div');
      assert(child);
    });
  });

  describe('expander element', () => {
    it('renders expander element');

    it('has a specified props');

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
