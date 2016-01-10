import React from 'react';
import DevTools from './containers/DevTools';
import createRemoteStore from './store/createRemoteStore.js';

const store = createRemoteStore();

export default () => <DevTools store={store}/>;
