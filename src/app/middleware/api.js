import { stringify } from 'jsan';
import socketCluster from 'socketcluster-client';
import * as actions from '../constants/socketActionTypes';

let socket;
let store;

const watch = subscription => request => {
  store.dispatch({
    type: subscription,
    request: request.data ? { id: request.id, ...request.data } : request
  });
};

function subscribe(channelName, subscription) {
  const channel = socket.subscribe(channelName);
  socket.on('subscribeFail', error => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'subscribeFail' });
  });
  socket.on('unsubscribe', error => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'unsubscribe' });
  });
  socket.on('dropOut', error => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'dropOut' });
  });
  socket.on('subscribe', () => {
    channel.watch(watch(subscription));
    store.dispatch({ type: actions.SUBSCRIBE_SUCCESS, channel });
  });
}

function handleConnection() {
  socket.on('error', error => {
    store.dispatch({ type: actions.CONNECT_ERROR, error });
  });
  socket.on('disconnect', () => {
    store.dispatch({ type: actions.DISCONNECT });
  });
  socket.on('connectAbort', () => {
    store.dispatch({ type: actions.DISCONNECT });
  });

  socket.on('connect', status => {
    store.dispatch({
      type: actions.CONNECT_SUCCESS,
      payload: {
        id: status.id,
        authState: socket.authState,
        socketState: socket.state
      },
      error: status.authError
    });
    if (socket.authState !== actions.AUTHENTICATED) {
      store.dispatch({ type: actions.AUTH_REQUEST });
    }
  });
}

function connect() {
  try {
    socket = socketCluster.connect(store.getState().socket.options);
    handleConnection(store);
  } catch (error) {
    store.dispatch({ type: actions.CONNECT_ERROR, error });
  }
}

function login() {
  socket.emit('login', {}, (error, baseChannel) => {
    if (error) {
      store.dispatch({ type: actions.AUTH_ERROR, error });
      return;
    }
    store.dispatch({ type: actions.AUTH_SUCCESS, baseChannel });
  });
}

export default function api(inStore) {
  store = inStore;
  return next => action => {
    switch (action.type) { // eslint-disable-line default-case
      case actions.CONNECT_REQUEST: connect(action.options); break;
      case actions.AUTH_REQUEST: login(); break;
      case actions.SUBSCRIBE_REQUEST: subscribe(action.baseChannel, action.subscription); break;
    }
    return next(action);
  };
}
