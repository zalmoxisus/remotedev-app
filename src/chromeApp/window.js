import React from 'react';
import { render } from 'react-dom';
import DevTools from '../app';

chrome.storage.local.get({
  's:hostname': null,
  's:port': null
}, options => {
  render(
    <DevTools
      socketOptions={
        options['s:hostname'] && options['s:port'] ?
        { hostname: options['s:hostname'], port: options['s:port'] } : undefined
      }
    />,
    document.getElementById('root')
  );
});
