import React from 'react';

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
      return {
        isExpanding: this.isExpanding
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
    }
  });
}
