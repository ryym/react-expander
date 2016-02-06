import React from 'react';
import { beExpandable } from 'react-expander';

class Item extends React.Component {
  render() {
    const { width, height } = this.props;
    return (
      <div
        className="item box"
        style={{ width, height }}
      >
        <div className="box__name">
          Item
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default beExpandable(Item);
