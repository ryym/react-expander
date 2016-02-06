import React from 'react';
import Container from './Container';

export default class Example extends React.Component {
  render() {
    return (
      <div id="example">
        {this.renderHeader()}
        <Container />
        {this.renderFooter()}
      </div>
    );
  }

  renderHeader() {
    return (
      <header className="header">
        <div className="header__left">
          <span className="header__title">
            <i className="fa fa-fire"></i>
            React Expander Demo
          </span>
        </div>
        <div className="header__right">
          <a href="https://github.com/ryym/react-expander">
            <div className="header__source">
              <i className="header__source__icon fa fa-github"></i>
              <span className="header__source__name">
                Source
              </span>
            </div>
          </a>
        </div>
      </header>
    );
  }

  renderFooter() {
    return (
      <footer className="footer">
        <div className="footer__author">
          Created by
          <a href="https://github.com/ryym">
            @ryym
          </a>
        </div>
      </footer>
    );
  }
}

