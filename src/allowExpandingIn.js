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
        >
        </ContainerComp>
      );
    },

    makeExpandHandlers() {
      const onStopEvent = e => this.stopResizing(e);
      return {
        isExpanding: this.isExpanding,
        onMouseMove: e => this.expand(e),
        onMouseUp: onStopEvent,
        onMouseLeave: onStopEvent
      };
    },

    makeExpander() {
      return {
        startResizing: this.startResizing
      };
    },

    isExpanding() {
      return !! this._resizedFrom;
    },

    startResizing(e, expander) {
      const { width, height } = expander.getCurrentSizes();
      this._resizedFrom = {
        width,
        height,
        handleExpand: expander.handleExpand,
        clientX: e.clientX,
        clientY: e.clientY,
      };
    },

    stopResizing() {
      this._resizedFrom = undefined;
    },

    expand(e) {
      e.preventDefault();

      if (! this._resizedFrom) {
        return;
      }

      const from = this._resizedFrom;
      let { width, height } = from;
      width += (e.clientX - from.clientX);
      height += (e.clientY - from.clientY);

      from.handleExpand(width, height);
    }
  });
}
