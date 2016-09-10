import { SELECT_MONITOR, TOGGLE_SLIDER, TOGGLE_DISPATCHER } from '../constants/actionTypes';

const initialState = {
  selected: 'inspectorMonitor',
  sliderIsOpen: false,
  dispatcherIsOpen: false
};

export default function monitor(state = initialState, action) {
  switch (action.type) {
    case SELECT_MONITOR:
      return {
        ...state,
        selected: action.monitor
      };
    case TOGGLE_SLIDER:
      return {
        ...state,
        sliderIsOpen: !state.sliderIsOpen
      };
    case TOGGLE_DISPATCHER:
      return {
        ...state,
        dispatcherIsOpen: !state.dispatcherIsOpen
      };
    default:
      return state;
  }
}
