import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="header__title">
          <i className="fa fa-fire"></i>
          React Expander Demo
        </span>
      </div>
      <div className="header__right">
        <a
          href="https://github.com/ryym/react-expander"
          className="header__source"
        >
          <i className="header__source__icon fa fa-github"></i>
          <span className="header__source__name">
            Source
          </span>
        </a>
      </div>
    </header>
  );
}
