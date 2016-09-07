import omit from 'lodash/omit';
import { UPDATE_STATE } from '../constants/actionTypes';
import parseJSON from '../utils/parseJSON';
import { recompute } from '../store/updateState';

const defaultSate = {
  actionsById: {},
  computedStates: [],
  currentStateIndex: -1,
  monitorState: {},
  nextActionId: 0,
  skippedActionIds: [],
  stagedActionIds: []
};

function updateState(state, request) {
  const payload = parseJSON(request.payload);
  if (typeof payload === 'undefined') return state;

  let newState;
  const { id } = request;
  const action = request.action && parseJSON(request.action) || {};

  switch (request.type) {
    case 'INIT':
      newState = recompute(
        state.default,
        payload,
        { action: { type: '@@INIT' }, timestamp: action.timestamp || Date.now() }
      );
      break;
    case 'ACTION':
      const liftedState = state[id] || state.default;
      newState = recompute(
        liftedState,
        payload,
        action,
        request.nextActionId || (liftedState.nextActionId + 1),
        request.isExcess
      );
      break;
    case 'STATE':
      newState = payload;
      break;
    default:
      return state;
  }

  return { ...state, [id]: newState };
}

export default function liftedStates(state = { default: defaultSate }, action) {
  if (action.type !== UPDATE_STATE) return state;

  const { request } = action;
  if (request.type === 'DISCONNECTED') {
    return omit(state, request.id);
  }
  return updateState(state, request);
}
