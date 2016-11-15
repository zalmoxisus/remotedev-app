import {
  LIFTED_ACTION, MONITOR_ACTION, SELECT_INSTANCE, SELECT_MONITOR, EXPORT,
  TOGGLE_SYNC, TOGGLE_SLIDER, TOGGLE_DISPATCHER, GET_REPORT_REQUEST,
  SHOW_NOTIFICATION, CLEAR_NOTIFICATION
} from '../constants/actionTypes';
import { RECONNECT } from '../constants/socketActionTypes';

let monitorReducer;
let monitorProps = {};

export function liftedDispatch(action) {
  if (action.type[0] === '@') {
    if (action.type === '@@INIT_MONITOR') {
      monitorReducer = action.update;
      monitorProps = action.monitorProps;
    }
    return { type: MONITOR_ACTION, action, monitorReducer, monitorProps };
  }
  return { type: LIFTED_ACTION, message: 'DISPATCH', action };
}

export function selectInstance(event, index, selected) {
  return { type: SELECT_INSTANCE, selected };
}

export function selectMonitor(event, index, value) {
  return { type: SELECT_MONITOR, monitor: value };
}

export function importState(state, preloadedState) {
  return { type: LIFTED_ACTION, message: 'IMPORT', state, preloadedState };
}

export function exportState() {
  return { type: EXPORT };
}

export function lockChanges(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'LOCK_CHANGES', status },
    toAll: true
  };
}

export function pauseRecording(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'PAUSE_RECORDING', status },
    toAll: true
  };
}

export function dispatchRemotely(action) {
  return { type: LIFTED_ACTION, message: 'ACTION', action };
}

export function toggleSync() {
  return { type: TOGGLE_SYNC };
}

export function toggleSlider() {
  return { type: TOGGLE_SLIDER };
}

export function toggleDispatcher() {
  return { type: TOGGLE_DISPATCHER };
}

export function saveSocketSettings(isCustom, options) {
  return { type: RECONNECT, isCustom, options };
}

export function showNotification(message) {
  return { type: SHOW_NOTIFICATION, notification: { type: 'ERROR', message } };
}

export function clearNotification() {
  return { type: CLEAR_NOTIFICATION };
}

export function getReport(report) {
  return { type: GET_REPORT_REQUEST, report };
}
