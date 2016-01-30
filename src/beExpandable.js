import React from 'react';

/**
 * Wrap the given component to make it expandable.
 * @param {React.Component} Component - The component to be wrapped.
 * @param {object} options - The options.
 * @return {React.Component} The wrapped component.
 */
export default function beExpandable(Component, options) {
  if (! (options.width && options.height)) {
    throw new Error('beExpandable: Please specify width and height');
  }
  return React.createClass({
    render() {
      if (! this.props.expander) {
        throw new Error('beExpandable#render: Please set expander as a prop');
      }
      return (
        <Component
          {...this.props}
          width={options.width}
          height={options.height}
        >
        </Component>
      );
    }
  });
}
