import { SELECT_MONITOR, TOGGLE_SLIDER, TOGGLE_DISPATCHER } from '../constants/actionTypes';
import { RECONNECT } from '../constants/socketActionTypes';
import { saveToStorage, saveObjToStorage } from '../utils/localStorage';

const persist = (suffix = '') => store => next => action => {
  const result = next(action);
  switch (action.type) { // eslint-disable-line default-case
    case RECONNECT:
      if (action.options) saveObjToStorage(!action.isCustom, action.options);
      break;
    case SELECT_MONITOR:
      saveToStorage('monitor' + suffix, action.monitor);
      break;
    case TOGGLE_SLIDER:
      saveToStorage('slider' + suffix, true, !store.getState().monitor.sliderIsOpen);
      break;
    case TOGGLE_DISPATCHER:
      saveToStorage('dispatcher' + suffix, true, !store.getState().monitor.dispatcherIsOpen);
      break;
  }
  return result;
};

export default persist;
