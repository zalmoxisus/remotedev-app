import socketOptions from '../constants/socketOptions';
import * as actions from '../constants/socketActionTypes';

const initialState = {
  options: socketOptions,
  id: null,
  socketState: actions.CLOSED,
  authState: actions.PENDING,
  authToken: null,
  error: undefined
};

export default function socket(state = initialState, action) {
  switch (action.type) {
    case actions.CONNECT_REQUEST:
      return {
        ...state,
        socketState: actions.CONNECTING
      };
    case actions.CONNECT_ERROR:
      return {
        ...state,
        error: action.error
      };
    case actions.CONNECT_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        socketState: action.payload.socketState,
        authState: action.payload.authState,
        error: action.error
      };
    case actions.AUTH_REQUEST:
      return {
        ...state,
        authState: actions.PENDING
      };
    case actions.AUTH_SUCCESS:
      return {
        ...state,
        authState: actions.AUTHENTICATED,
        authToken: action.authToken,
        baseChannel: action.baseChannel
      };
    case actions.AUTH_ERROR:
      return {
        ...state,
        authState: actions.UNAUTHENTICATED,
        error: action.error
      };
    case actions.DEAUTHENTICATE:
      return {
        ...state,
        authState: actions.UNAUTHENTICATED,
        authToken: null
      };
    case actions.DISCONNECT:
      return initialState;
    default:
      return state;
  }
}
