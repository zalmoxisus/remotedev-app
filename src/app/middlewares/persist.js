import { SELECT_MONITOR, TOGGLE_SLIDER, TOGGLE_DISPATCHER } from '../constants/actionTypes';
import { RECONNECT } from '../constants/socketActionTypes';
import { saveToStorage, saveObjToStorage } from '../utils/localStorage';

export default function persist(store) {
  return next => action => {
    const result = next(action);
    switch (action.type) { // eslint-disable-line default-case
      case RECONNECT:
        if (action.options) saveObjToStorage(!action.isCustom, action.options);
        break;
      case SELECT_MONITOR:
        saveToStorage('select-monitor', action.monitor);
        break;
      case TOGGLE_SLIDER:
        saveToStorage('slider-open', store.getState().monitor.sliderIsOpen);
        break;
      case TOGGLE_DISPATCHER:
        saveToStorage('dispatcher-open', store.getState().monitor.dispatcherIsOpen);
        break;
    }
    return result;
  };
}
