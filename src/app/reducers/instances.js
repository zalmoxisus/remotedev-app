import {
  UPDATE_STATE, SET_STATE, LIFTED_ACTION,
  SELECT_INSTANCE, REMOVE_INSTANCE
} from '../constants/actionTypes';
import { DISCONNECT } from '../constants/socketActionTypes';
import parseJSON from '../utils/parseJSON';
import { recompute } from '../store/updateState';

const initialState = {
  selected: null,
  current: 'default',
  connections: {},
  options: {},
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
  }
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

function removeState(state, connectionId) {
  const instanceIds = state.connections[connectionId];
  if (!instanceIds) return state;

  const connections = { ...state.connections };
  const options = { ...state.options };
  const states = { ...state.states };
  let selected = state.selected;
  let current = state.current;

  delete connections[connectionId];
  instanceIds.forEach(id => {
    if (id === selected) selected = null;
    if (id === current) current = 'default';
    delete options[id];
    delete states[id];
  });
  return {
    selected,
    current,
    connections,
    options,
    states
  };
}

function init({ type, action, name }, current) {
  let isRedux = type === 'STATE';
  let actionCreators;
  let creators = action;
  if (typeof creators === 'string') creators = JSON.parse(creators);
  if (Array.isArray(creators)) actionCreators = creators;
  return { name: name || current, isRedux, actionCreators };
}

export default function instances(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      const { request } = action;
      const connectionId = request.id;
      const current = request.instanceId || connectionId;
      let connections = state.connections;
      let options = state.options;

      if (typeof state.options[current] === 'undefined') {
        connections = {
          ...state.connections,
          [connectionId]: [...(connections[connectionId] || []), current]
        };
        options = { ...options, [current]: init(request, current) };
      }

      return {
        ...state,
        current,
        connections,
        options,
        states: updateState(state.states, request)
      };
    case SET_STATE:
      return {
        ...state,
        states: {
          ...state.states,
          [state.selected || state.current]: action.newState
        }
      };
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected };
    case REMOVE_INSTANCE:
      return removeState(state, action.id);
    case LIFTED_ACTION:
      if (action.message === 'DISPATCH') return dispatchAction(state, action);
      return state;
    case DISCONNECT:
      return initialState;
    default:
      return state;
  }
}
