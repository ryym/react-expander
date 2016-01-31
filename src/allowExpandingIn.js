import React from 'react';

export default function allowExpandingIn(ContainerComp) {
  return React.createClass({
    render() {
      return <ContainerComp />;
    }
  });
}
