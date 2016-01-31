import React from 'react';

/**
 * A simple div component for tests.
 */
export default class Div extends React.Component {
  render() {
    return (
      <div className="wrappee">
        {this.props.children}
      </div>
    );
  }
}

