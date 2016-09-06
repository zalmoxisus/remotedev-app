import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import socket from './socket';
import channels from './channels';
import liftedStates from './liftedStates';

const rootReducer = combineReducers({
  routing,
  socket,
  channels,
  liftedStates
});


export default rootReducer;
