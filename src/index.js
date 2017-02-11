import React from 'react';
import { render } from 'react-dom';
import App from './app';

render(
  <App />,
  document.getElementById('root')
);

/*
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    render(
      <NextApp />,
      document.getElementById('root')
    );
  });
}
*/
