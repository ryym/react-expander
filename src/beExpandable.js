import React from 'react';
import { SizeMeasurer } from './SizeMeasurer';

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
      const style = props.defaultStyle ?
        this.makeDefaultExpanderStyle() : [];
      return (
        <div
          onMouseDown={
            e => this.startResizing(e, props.expandTo, connector)
          }
          style={style}
          {...props}
        />
      );
    },

    makeDefaultExpanderStyle() {
      return {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '10px',
        height: '10px',
        cursor: 'move'
      };
    },

    startResizing(e, directions = 'bottom right', connector) {
      const { width, height } = this.state;
      this._measurer = new SizeMeasurer({
        width,
        height,
        clientX: e.clientX,
        clientY: e.clientY,
        directions
      });
      this.props.expander.startResizing(connector);
    },

    stopResizing() {
      this._measurer = undefined;
    },

    expand(e) {
      const width = this._measurer.measureWidth(e.clientX);
      const height = this._measurer.measureHeight(e.clientY);
      this.setState({ width, height });
    },

    makeConnector() {
      return {
        expand: this.expand,
        stopResizing: this.stopResizing
      };
    },

    isExpanding() {
      return !! this._measurer;
    }
  });
}
