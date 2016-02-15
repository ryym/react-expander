import React from 'react';
import { allowExpandingIn } from 'react-expander';
import Expandable from './Expandable';
import Header from './Header';
import Footer from './Footer';
import Board from './Board';

class Sample extends React.Component {
  render() {
    const { expandHandlers, expander } = this.props;
    return (
      <div className="sample-container" {...expandHandlers}>
        <Header />

        <div className="sample-main">
          <Expandable
            className="board-frame"
            size={{ width: 25, height: 25 }}
            expander={expander({
              className: 'expander'
            })}
          >
            <Board expander={expander} />
          </Expandable>
        </div>

        <Footer />
      </div>
    );
  }
}

export default allowExpandingIn(Sample);
