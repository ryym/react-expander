import React from 'react';
import Expandable from './Expandable';

export default function Poster(props) {
  const { expander, expandTo } = props;
  return (
    <Expandable
      className={`poster ${props.className}`}
      size={{ width: 30, height: 30 }}
      expander={expander({
        className: 'poster-expander',
        expandTo
      })}
    >
      {props.children}
    </Expandable>
  );
}
