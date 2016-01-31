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
      return {};
    },

    makeExpander() {
      return {};
    }
  });
}
