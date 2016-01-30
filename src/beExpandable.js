import React from 'react';

export default function beExpandable(Component) {
  return React.createClass({

    render() {
      return (
        <Component />
      );
    }

  });
}
