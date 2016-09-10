import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import socket from './socket';
import instances from './instances';

const rootReducer = combineReducers({
  routing,
  socket,
  instances
});


export default rootReducer;
