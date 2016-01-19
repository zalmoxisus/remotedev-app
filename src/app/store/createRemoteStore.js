import createDevStore from './createDevStore.js';
import updateState from './updateState';
import { subscribe, dispatchRemotely } from '../services/messaging';

let store;
let instance;

export function createRemoteStore(socketOptions, onInstancesChanged, newInstance) {
  store = createDevStore(dispatchRemotely);
  instance = newInstance;
  subscribe(msg => {
    updateState(store, msg, onInstancesChanged, instance);
  }, socketOptions, onInstancesChanged);
  return store;
}

export function updateStoreInstance(newInstance) {
  instance = newInstance;
  if (newInstance !== 'auto') store.liftedStore.setInstance(instance);
}
