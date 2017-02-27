import React from 'react';
import { SizeMeasurer } from './SizeMeasurer';

/**
 * Wrap the given component to make it expandable.
 * @param {React.Component} Component - The component to be wrapped.
 * @return {React.Component} The wrapped component.
 */
export default function beExpandable(Component) {
  const componentName = Component.displayName || Component.name;
  return React.createClass({
    getDefaultProps() {
      return {
        size: { width: 100, height: 100 }
      };
    },

    displayName: `BeExpandable(${componentName})`,

    getInitialState() {
      const { width, height } = this.props.size;
      return { width, height, isExpanding: false };
    },

    render() {
      const {
        size, expander, expanders, ...props
      } = this.props;

      if (! (expander || expanders)) {
        throw new Error('beExpandable: Please set expander as a prop');
      }

      return (
        <Component
          {...props}
          width={this.state.width}
          height={this.state.height}
        >
          {props.children}
          {this.renderExpanders()}
        </Component>
      );
    },

    getExpanders() {
      const { expander, expanders } = this.props;
      return expander ? [expander] : expanders;
    },

    normalizeExpanders(expanders) {
      return expanders.map(expander => {
        if (typeof expander === 'function') {
          return expander();
        }
        return expander;
      });
    },

    renderExpanders() {
      const expanders = this.getExpanders();
      return this.normalizeExpanders(expanders)
        .map(exp => this.renderExpander(exp.key, exp.props));
    },

    renderExpander(key, allProps = {}) {
      const {
        defaultStyle, className, expandTo, ...props
      } = allProps;
      const style = defaultStyle ? this.makeDefaultExpanderStyle() : [];
      const connector = this.makeConnector();
      const stateClass = this.state.isExpanding ? 're-expanding' : '';

      return (
        <div
          draggable
          key={key}
          onMouseDown={
            e => this.startResizing(e, expandTo, connector)
          }
          style={style}
          className={(className || '') + ` ${stateClass}`}
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
      this.setState({ isExpanding: false });
    },

    expand(e) {
      const width = this._measurer.measureWidth(e.clientX);
      const height = this._measurer.measureHeight(e.clientY);
      this.setState({ width, height, isExpanding: true });
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
