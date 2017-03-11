# React Expander

Make your component expandable by drag and drop ([demo](https://ryym.github.io/react-expander/)).

Sample code:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  allowExpandingIn,
  beExpandable
} from 'react-expander';

// Define an expandable component.
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

// Wrap the component by `beExpandable`.
// This passes width and height to Box when expanded.
const ExpandableBox = beExpandable(Box);

// Define a container component.
const Container = ({ expander, expandHandlers }) => {
  const containerStyle = {
    width: '100%',
    height: '200px',
    border: '2px solid #ccc'
  };

  // Specify styles for expanding point.
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

// Wrap the container by `allowExpandingIn`.
// Users can expand Box inside of this container.
const AllowedContainer = allowExpandingIn(Container);

ReactDOM.render(
  <AllowedContainer />,
  document.getElementById('main'),
);
```
