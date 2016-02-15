import React from 'react';
import Poster from './Poster';

export default class Board extends React.Component {
  render() {
    const { expander } = this.props;
    return (
      <div className="board__content-bg">
        <div className="board__content">

          {this.renderDescription()}

          <Poster
            expander={expander}
            className="poster-react"
          >
            <h3>About</h3>
            React expander is a library for&nbsp;
            <a href="https://facebook.github.io/react/">React</a>.
          </Poster>

          <Poster
            expander={expander}
            expandTo="bottom left"
            className="poster-example"
          >
            <h3>Source code</h3>
            The source code of this page is&nbsp;
            <a href="https://github.com/ryym/react-expander/tree/master/example">
              here
            </a>.
          </Poster>


          <Poster
            expander={expander}
            expandTo="top left"
            className="poster-repository"
          >
            <h3>Repository</h3>
            React expander is hosted on&nbsp;
            <a href="https://github.com/ryym/react-expander">
              Github
            </a>.
          </Poster>

        </div>
      </div>
    );
  }

  renderDescription() {
    return (
      <div className="board__description">
        <h2>React Expander</h2>
        <p>
          Hi, this is a sample page using&nbsp;
          <a href="https://github.com/ryym/react-expander">
            react-expander
          </a>.
          You can expand some elements in this page as you like
          by drag and drop.
          There are also options to expand only width or height.
        </p>
      </div>
    );
  }
}
