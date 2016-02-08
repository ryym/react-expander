import React from 'react';
import { allowExpandingIn } from 'react-expander';
import ExpandableItem from './ExpandableItem';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  render() {
    const { expandHandlers } = this.props;
    return (
      <div
        {...expandHandlers}
        className="container box"
      >
        <div className="box__name">
          Container
        </div>
        {this.renderItem(100, 100)}
        {this.renderItem(100, 100)}
        {this.renderItem(100, 100)}
      </div>
    );
  }

  renderItem(width, height) {
    const { expander } = this.props;
    return (
      <ExpandableItem
        size={{ width, height }}
        expander={expander({
          className: 'expander'
        })}
      />
    );
  }
}

export default allowExpandingIn(Container);
