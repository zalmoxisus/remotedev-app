import React from 'react';
import DevTools from './containers/DevTools';
import createRemoteStore from './store/createRemoteStore.js';

export default ({ socketOptions }) => <DevTools store={createRemoteStore(socketOptions)}/>;
