import socketOptions from '../constants/socketOptions';
import * as actions from '../constants/socketActionTypes';

const initialState = {
  options: socketOptions,
  isCustom: false,
  id: null,
  channels: [],
  socketState: actions.CLOSED,
  authState: actions.PENDING,
  authToken: null,
  error: undefined
};

export default function socket(state = initialState, action) {
  switch (action.type) {
    case actions.CONNECT_REQUEST:
      let options = state.options;
      let isCustom = state.isCustom;
      if (action.options) {
        isCustom = true;
        options = action.options;
      }
      return {
        ...state,
        isCustom,
        options,
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
    case actions.SUBSCRIBE_SUCCESS:
      return {
        ...state,
        channels: [...state.channels, action.channelName]
      };
    case actions.UNSUBSCRIBE:
      return {
        ...state,
        channels: state.channels.filter(channel =>
          channel !== action.channelName
        )
      };
    case actions.DISCONNECTED:
      return {
        ...initialState,
        options: state.options
      };
    case actions.RECONNECT:
      return {
        ...state,
        isCustom: action.isCustom,
        options: action.isCustom ? action.options : socketOptions
      };
    default:
      return state;
  }
}
