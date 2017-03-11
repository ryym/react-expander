import React from 'react';
import ReactDOM from 'react-dom';
import {
  allowExpandingIn,
  beExpandable
} from 'react-expander';

const Box = ({ width, height, children }) => {
  const style = {
    width,
    height,
    border: '1px solid black',
    position: 'relative'
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
};
const ExpandableBox = beExpandable(Box);

const Container = ({ expander, expandHandlers }) => {
  const containerStyle = {
    width: '100%',
    height: '200px',
    border: '2px solid #ccc'
  };
  const expanderStyle = {
    border: '1px solid red',
    width: '10px',
    height: '10px',
    position: 'absolute',
    bottom: 0,
    right: 0,
    cursor: 'pointer'
  };
  return (
    <div {...expandHandlers} style={containerStyle}>
      <ExpandableBox expander={expander({ style: expanderStyle })} />
    </div>
  );
};
const AllowedContainer = allowExpandingIn(Container);

ReactDOM.render(
  <AllowedContainer />,
  document.getElementById('main'),
);
