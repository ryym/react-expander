import React from 'react';

/**
 * Wrap the given component as an expanding allower.
 * Expandable components can expand only in the allower component.
 * @param {React.Component} ContainerComp - The component that may
 *     have one or more expandable component as children.
 * @return {React.Component} The allower component.
 */
export default function allowExpandingIn(ContainerComp) {
  const componentName = ContainerComp.displayName || ContainerComp.name;
  return React.createClass({
    _expanderId: 0,

    displayName: `AllowExpandingIn(${componentName})`,

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
      return {
        onDragStart: e => {
          e.dataTransfer.setData('text/plain', '');
        },
        onDragOver: e => {
          e.dataTransfer.dropEffect = 'move';
          this.expand(e);
        },
        onDragEnd: e => {
          this.stopResizing(e);
        }
      };
    },

    makeExpander() {
      return props => {
        return {
          props,
          key: ++this._expanderId,
          startResizing: this.startResizing
        };
      };
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
