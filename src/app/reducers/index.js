import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import socket from './socket';
import monitor from './monitor';
import notification from './notification';
import instances from './instances';
import test from './test';
import reports from './reports';

const rootReducer = combineReducers({
  routing,
  socket,
  monitor,
  instances,
  test,
  reports,
  notification
});

export default rootReducer;
