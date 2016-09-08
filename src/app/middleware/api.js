import { stringify } from 'jsan';
import socketCluster from 'socketcluster-client';
import * as actions from '../constants/socketActionTypes';
import {
  UPDATE_STATE, REMOVE_INSTANCE, LIFTED_ACTION
} from '../constants/actionTypes';

let socket;
let store;

function emit({ message: type, id, action, state }) {
  socket.emit(
    id ? 'sc-' + id : 'respond',
    { type, action, state }
  );
}

function startMonitoring() {
  store.dispatch({ type: actions.EMIT, message: 'START' });
}

function dispatchLiftedAction({ action }) {
  store.dispatch({ type: actions.EMIT, message: 'DISPATCH', action });
}

const watch = subscription => request => {
  if (subscription === UPDATE_STATE) {
    if (request.type === 'DISCONNECTED') {
      store.dispatch({
        type: REMOVE_INSTANCE,
        id: request.id
      });
      return;
    }
    if (request.type === 'START') {
      store.dispatch({ type: actions.EMIT, message: 'START', id: request.id });
      return;
    }
  }
  store.dispatch({
    type: subscription,
    request: request.data ? { ...request.data, id: request.id } : request
  });
};

function subscribe(channelName, subscription) {
  const channel = socket.subscribe(channelName);
  channel.watch(watch(subscription));
}

function handleConnection() {
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
  socket.on('disconnect', code => {
    store.dispatch({ type: actions.DISCONNECT, code });
  });

  socket.on('subscribe', channelName => {
    store.dispatch({ type: actions.SUBSCRIBE_SUCCESS, channelName });
  });
  socket.on('unsubscribe', channelName => {
    socket.unsubscribe(channelName);
    socket.unwatch(channelName);
    store.dispatch({ type: actions.UNSUBSCRIBE, channelName });
  });
  socket.on('subscribeFail', error => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'subscribeFail' });
  });
  socket.on('dropOut', error => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'dropOut' });
  });

  socket.on('error', error => {
    store.dispatch({ type: actions.CONNECT_ERROR, error });
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
    store.dispatch({ type: actions.SUBSCRIBE_REQUEST, baseChannel, subscription: UPDATE_STATE });
  });
}

export default function api(inStore) {
  store = inStore;
  return next => action => {
    const result = next(action);
    switch (action.type) { // eslint-disable-line default-case
      case actions.CONNECT_REQUEST: connect(action.options); break;
      case actions.AUTH_REQUEST: login(); break;
      case actions.SUBSCRIBE_REQUEST: subscribe(action.baseChannel, action.subscription); break;
      case actions.SUBSCRIBE_SUCCESS: startMonitoring(); break;
      case actions.EMIT: emit(action); break;
      case LIFTED_ACTION: dispatchLiftedAction(action); break;
    }
    return result;
  };
}
