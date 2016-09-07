import omit from 'lodash/omit';
import { UPDATE_STATE, LIFTED_ACTION, SELECT_INSTANCE } from '../constants/actionTypes';
import parseJSON from '../utils/parseJSON';
import { recompute } from '../store/updateState';

const initialState = {
  states: {
    default: {
      actionsById: {},
      computedStates: [],
      currentStateIndex: -1,
      monitorState: {},
      nextActionId: 0,
      skippedActionIds: [],
      stagedActionIds: []
    }
  },
  current: 'default',
  selected: null
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

function dispatchAction(state, { action }) {
  if (action.type === 'JUMP_TO_STATE') {
    const id = state.selected || state.current;
    const liftedState = state.states[id];
    return {
      ...state,
      states: {
        ...state.states,
        [id]: { ...liftedState, currentStateIndex: action.index }
      }
    };
  }
  return state;
}

function disconnected(state, { request }) {
  const states = omit(state.states, request.id);
  let selected = state.selected;
  let current = state.current;
  if (!states[selected]) {
    selected = null;
    const ids = Object.keys(states);
    if (ids.length > 1 && ids[0] === 'default') current = ids[1];
    else current = ids[0];
  }
  return { states, current, selected };
}

function init({ type, action }) {
  let isRedux = type === 'STATE';
  let actionCreators;
  let creators = action;
  if (typeof creators === 'string') creators = JSON.parse(creators);
  if (Array.isArray(creators)) actionCreators = creators;
  return { isRedux, actionCreators };
}

export default function lifted(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      if (action.request.type === 'DISCONNECTED') {
        return disconnected(state, action);
      }
      const current = action.request.id;
      let rest;
      if (!state.states[current]) {
        rest = init(action.request);
      }
      return {
        ...state,
        ...rest,
        current,
        states: updateState(state.states, action.request)
      };
    case LIFTED_ACTION:
      return dispatchAction(state, action);
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected };
    default:
      return state;
  }
}
