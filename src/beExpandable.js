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
      const {
        size, expander, ...props
      } = this.props;

      if (! expander) {
        throw new Error('beExpandable: Please set expander as a prop');
      }

      return (
        <Component
          {...props}
          width={this.state.width}
          height={this.state.height}
        >
          {props.children}
          {this.renderExpander(expander.props)}
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
      const { width, height } = this.state;
      this._resizedFrom = {
        width,
        height,
        clientX: e.clientX,
        clientY: e.clientY
      };
      this.props.expander.startResizing(connector);
    },

    stopResizing() {
      this._resizedFrom = undefined;
    },

    expand(e) {
      const from = this._resizedFrom;
      let { width, height } = from;
      width += (e.clientX - from.clientX);
      height += (e.clientY - from.clientY);

      this.setState({ width, height });
    },

    makeConnector() {
      return {
        expand: this.expand,
        stopResizing: this.stopResizing
      };
    }
  });
}
