import beExpandable from '$lib/beExpandable';

describe('beExpandable', function() {

  describe('options', () => {
    it('requires width and height');
  });

  describe('props', () => {
    it('requires expander passed from ExpandingAllower');
  });

  describe('wrapping', () => {
    it('does not add external div');

    it('gives width and height to wrapped component');

    it('passes all the given props to wrapped component');

    it('passes its children to wrapped component');

    it('renders expander element');
  });

  describe('expander element', () => {
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
