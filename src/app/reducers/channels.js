import * as actions from '../constants/socketActionTypes';

export default function channels(state = [], action) {
  switch (action.type) {
    case actions.SUBSCRIBE_SUCCESS:
      return [...state, action.channelName];
    case actions.UNSUBSCRIBE:
      return state.filter(channel =>
        channel !== action.channelName
      );
    default:
      return state;
  }
}
