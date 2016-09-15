import {
  SELECT_MONITOR, TOGGLE_SLIDER, TOGGLE_DISPATCHER,
  TEST_ADD, TEST_EDIT, TEST_REMOVE, TEST_SELECT
} from '../constants/actionTypes';
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
    case TEST_SELECT:
      saveToStorage('test-templates-sel', action.selected);
      break;
    case TEST_ADD:
    case TEST_EDIT:
    case TEST_REMOVE:
      const testsTemplates = store.getState().test.templates;
      saveToStorage('test-templates', testsTemplates, !testsTemplates);
      saveToStorage('test-templates-sel', action.selected);
      break;
  }
  return result;
};

export default persist;
