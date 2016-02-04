import React from 'react';

/**
 * Wrap the given component to make it expandable.
 * @param {React.Component} Component - The component to be wrapped.
 * @return {React.Component} The wrapped component.
 */
export default function beExpandable(Component) {
  return React.createClass({
    getDefaultProps() {
      return {
        size: { width: 100, height: 100 }
      };
    },

    getInitialState() {
      const { width, height } = this.props.size;
      return { width, height };
    },

    render() {
      const props = this.props;

      if (! props.expander) {
        throw new Error('beExpandable: Please set expander as a prop');
      }

      return (
        <Component
          {...props}
          width={this.state.width}
          height={this.state.height}
        >
          {props.children}
          {this.renderExpander(props.expanderProps)}
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
