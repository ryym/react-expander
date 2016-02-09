import React from 'react';

/**
 * Wrap the given component as an expanding allower.
 * Expandable components can expand only in the allower component.
 * @param {React.Component} ContainerComp - The component that may
 *     have one or more expandable component as children.
 * @return {React.Component} The allower component.
 */
export default function allowExpandingIn(ContainerComp) {
  return React.createClass({
    render() {
      return (
        <ContainerComp
          {...this.props}
          expandHandlers={this.makeExpandHandlers()}
          expander={this.makeExpander()}
        />
      );
    },

    makeExpandHandlers() {
      const onStopEvent = e => this.stopResizing(e);
      return {
        onMouseMove: e => this.expand(e),
        onMouseUp: onStopEvent,
        onMouseLeave: onStopEvent
      };
    },

    makeExpander() {
      function expander(props) {
        expander.props = Object.assign({}, props);
        return expander;
      }
      expander.startResizing = this.startResizing;
      return expander;
    },

    startResizing(connector) {
      this._connector = connector;
    },

    stopResizing() {
      if (this._connector) {
        this._connector.stopResizing();
        this._connector = undefined;
      }
    },

    expand(e) {
      e.preventDefault();

      if (! this._connector) {
        return;
      }
      this._connector.expand(e);
    }
  });
}
