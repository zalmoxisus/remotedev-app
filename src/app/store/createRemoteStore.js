import createDevStore from './createDevStore.js';
import updateState from './updateState';
import { subscribe, dispatchRemotely } from '../services/messaging';

export default function createRemoteStore(socketOptions, onInstancesChanged, autoInstance) {
  const store = createDevStore(dispatchRemotely);
  subscribe(msg => {
    updateState(store, msg, onInstancesChanged, autoInstance);
  }, socketOptions, onInstancesChanged);
  return store;
}
