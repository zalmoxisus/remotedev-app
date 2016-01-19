import createDevStore from './createDevStore.js';
import updateState from './updateState';
import { subscribe, dispatchRemotely, dispatchSync } from '../services/messaging';

let store;
let instance;
let shouldSync = false;

function sync(state, id) {
  if (shouldSync) dispatchSync(state, id);
}

export function createRemoteStore(socketOptions, onInstancesChanged, newInstance) {
  store = createDevStore(dispatchRemotely);
  instance = newInstance;
  subscribe(msg => {
    updateState(store, msg, onInstancesChanged, instance, sync);
  }, socketOptions, onInstancesChanged);
  return store;
}

export function updateStoreInstance(newInstance) {
  instance = newInstance;
  if (newInstance !== 'auto') store.liftedStore.setInstance(instance);
  shouldSync = false;
}

export function enableSync(should) {
  shouldSync = should;
}
