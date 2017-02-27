import React from 'react';
import ReactDOM from 'react-dom';
import Sample from './components/Sample';

require('./sample.scss');

ReactDOM.render(
  <Sample />,
  document.getElementById('main')
);
