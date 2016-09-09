import { stringify } from 'jsan';
import difference from 'lodash/difference';
import omit from 'lodash/omit';
import { SET_STATE } from '../constants/actionTypes';

export function sweep(state) {
  return {
    ...state,
    actionsById: omit(state.actionsById, state.skippedActionIds),
    stagedActionIds: difference(state.stagedActionIds, state.skippedActionIds),
    skippedActionIds: [],
    currentStateIndex: Math.min(state.currentStateIndex, state.stagedActionIds.length - 1)
  };
}

export function nonReduxDispatch(store, state, action) {
  switch (action.type) {
    case 'TOGGLE_ACTION':
      return stringify(state);
    case 'JUMP_TO_STATE':
      return stringify(state.computedStates[action.index].state);
    case 'ROLLBACK':
      return stringify(state.computedStates[0].state);
    case 'SWEEP':
      store.dispatch({ type: SET_STATE, newState: sweep(state) });
    default:
      return undefined;
  }
}
