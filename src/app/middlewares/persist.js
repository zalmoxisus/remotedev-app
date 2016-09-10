import { RECONNECT } from '../constants/socketActionTypes';
import { saveObjToStorage } from '../utils/localStorage';

export default function persist(store) {
  return next => action => {
    const result = next(action);
    switch (action.type) { // eslint-disable-line default-case
      case RECONNECT:
        if (action.options) saveObjToStorage(!action.isCustom, action.options);
        break;
    }
    return result;
  };
}
