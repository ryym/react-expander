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
    getInitialState() {
      const { width, height } = options;
      return { width, height };
    },

    render() {
      if (! this.props.expander) {
        throw new Error('beExpandable#render: Please set expander as a prop');
      }
      return (
        <Component
          {...this.props}
          width={this.state.width}
          height={this.state.height}
        >
          {this.props.children}
          {this.renderExpander(options.expanderProps)}
        </Component>
      );
    },

    renderExpander(props = {}) {
      const connector = this.makeConnector();
      return (
        <div
          onMouseDown={e => this.startResizing(e, connector)}
          {...props}
        />
      );
    },

    startResizing(e, connector) {
      this.props.expander.startResizing(e, connector);
    },

    makeConnector() {
      return {
        handleExpand: this.updateSizes,
        getCurrentSizes: this.getCurrentSizes
      };
    },

    updateSizes({ width, height }) {
      this.setState({ width, height });
    },

    getCurrentSizes() {
      const { width, height } = this.state;
      return { width, height };
    }
  });
}
