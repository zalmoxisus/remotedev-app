import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import socket from './socket';
import channels from './channels';
import lifted from './lifted';
import instances from './instances';

const rootReducer = combineReducers({
  routing,
  socket,
  channels,
  lifted,
  instances
});


export default rootReducer;
