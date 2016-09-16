import { combineReducers } from 'redux';
import socket from './socket';
import monitor from './monitor';
import notification from './notification';
import instances from './instances';
import test from './test';
import reports from './reports';

const rootReducer = combineReducers({
  socket,
  monitor,
  instances,
  test,
  reports,
  notification
});

export default rootReducer;
