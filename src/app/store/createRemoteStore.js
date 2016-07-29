import createDevStore from './createDevStore.js';
import updateState from './updateState';
import { subscribe, dispatchRemotely, dispatchSync } from '../services/messaging';

let store;
let instance;
let shouldSync = false;

function sync(state, id) {
  if (shouldSync) dispatchSync(state, id);
}

export function startMonitoring(id) {
  dispatchRemotely('START', undefined, id);
}

export function createRemoteStore(socketOptions, onInstancesChanged, onError, newInstance) {
  store = createDevStore(dispatchRemotely);
  instance = newInstance;
  subscribe(msg => {
    if (msg.type === 'STOP') { // Stopped by other monitor
      startMonitoring(msg.id);
      return;
    }
    if (msg.type === 'ERROR') {
      onError(msg.payload);
      return;
    }
    updateState(store, msg, onInstancesChanged, instance, sync);
  }, socketOptions, onInstancesChanged);
  return store;
}

export function updateStoreInstance(newInstance) {
  instance = newInstance;
  if (newInstance) store.liftedStore.setInstance(instance);
  shouldSync = false;
}

export function enableSync(should) {
  shouldSync = should;
}

export function importState(state) {
  store.liftedStore.importState(state);
}

export function exportState() {
  return store.liftedStore.getState();
}
