import * as actions from '../constants/socketActionTypes';

export default function channels(state = {}, action) {
  switch (action.type) {
    case actions.SUBSCRIBE_SUCCESS:
      return {
        ...state,
        [action.channel.name]: action.channel
      };
    default:
      return state;
  }
}
