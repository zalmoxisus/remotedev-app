import { SELECT_MONITOR } from '../constants/actionTypes';

const initialState = {
  selected: 'inspectorMonitor'
};

export default function monitor(state = initialState, action) {
  switch (action.type) {
    case SELECT_MONITOR:
      return {
        ...state,
        selected: action.monitor
      };
    default:
      return state;
  }
}
