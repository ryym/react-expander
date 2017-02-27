import React from 'react';
import { beExpandable } from 'react-expander';

function Expandable(props) {
  const { width, height, className } = props;
  return (
    <div
      className={className}
      style={{ width, height }}
    >
      {props.children}
    </div>
  );
}
export default beExpandable(Expandable);
