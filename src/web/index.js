import React from 'react';
import { render } from 'react-dom';
import DevTools from '../app/containers/DevTools';
import createRemoteStore from '../app/store/createRemoteStore.js';
const store = createRemoteStore();

render(
  <DevTools store={store} />,
  document.getElementById('root')
);
