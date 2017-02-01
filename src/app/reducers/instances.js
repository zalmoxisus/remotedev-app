import {
  UPDATE_STATE, SET_STATE, LIFTED_ACTION,
  SELECT_INSTANCE, REMOVE_INSTANCE, TOGGLE_SYNC
} from '../constants/actionTypes';
import { DISCONNECTED } from '../constants/socketActionTypes';
import parseJSON from '../utils/parseJSON';
import { recompute } from '../utils/updateState';

export const initialState = {
  selected: null,
  current: 'default',
  sync: false,
  connections: {},
  options: { default: {} },
  states: {
    default: {
      actionsById: {},
      computedStates: [],
      currentStateIndex: -1,
      nextActionId: 0,
      skippedActionIds: [],
      stagedActionIds: []
    }
  }
};

function updateState(state, request, id, serialize) {
  let payload = request.payload;
  const actionsById = request.actionsById;
  if (actionsById) {
    payload = {
      ...payload,
      actionsById: parseJSON(actionsById, serialize),
      computedStates: parseJSON(request.computedStates, serialize)
    };
    if (request.type === 'STATE' && request.committedState) {
      payload.committedState = payload.computedStates[0].state;
    }
  } else {
    payload = parseJSON(payload, serialize);
  }

  let newState;
  const liftedState = state[id] || state.default;
  let isExcess;
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
      isExcess = request.isExcess;
      if (typeof isExcess === 'undefined') isExcess = request.nextActionId > request.maxAge;
      newState = recompute(
        liftedState,
        payload,
        action,
        request.nextActionId || (liftedState.nextActionId + 1),
        isExcess
      );
      break;
    case 'STATE':
      newState = payload;
      if (newState.computedStates.length <= newState.currentStateIndex) {
        newState.currentStateIndex = newState.computedStates.length - 1;
      }
      break;
    case 'PARTIAL_STATE':
      const maxAge = request.maxAge;
      const nextActionId = payload.nextActionId;
      const stagedActionIds = payload.stagedActionIds;
      let computedStates = payload.computedStates;
      let oldActionsById;
      let oldComputedStates;
      let committedState;
      if (nextActionId > maxAge) {
        const oldStagedActionIds = liftedState.stagedActionIds;
        const excess = oldStagedActionIds.indexOf(stagedActionIds[1]);
        let key;
        if (excess > 0) {
          oldComputedStates = liftedState.computedStates.slice(excess - 1);
          oldActionsById = { ...liftedState.actionsById };
          for (let i = 1; i < excess; i++) {
            key = oldStagedActionIds[i];
            if (key) delete oldActionsById[key];
          }
          committedState = computedStates[0].state;
        } else {
          oldActionsById = liftedState.actionsById;
          oldComputedStates = liftedState.computedStates;
          committedState = liftedState.committedState;
        }
      } else {
        oldActionsById = liftedState.actionsById;
        oldComputedStates = liftedState.computedStates;
        committedState = liftedState.committedState;
      }
      computedStates = [...oldComputedStates, ...computedStates];
      const statesCount = computedStates.length;
      let currentStateIndex = payload.currentStateIndex;
      if (statesCount <= currentStateIndex) currentStateIndex = statesCount - 1;

      newState = {
        ...liftedState,
        actionsById: { ...oldActionsById, ...payload.actionsById },
        computedStates,
        currentStateIndex,
        nextActionId,
        stagedActionIds,
        committedState
      };
      break;
    case 'LIFTED':
      newState = liftedState;
      break;
    default:
      return state;
  }

  if (request.liftedState) newState = { ...newState, ...request.liftedState };
  return { ...state, [id]: newState };
}

export function dispatchAction(state, { action }) {
  if (action.type === 'JUMP_TO_STATE' || action.type === 'JUMP_TO_ACTION') {
    const id = state.selected || state.current;
    const liftedState = state.states[id];
    let currentStateIndex = action.index;
    if (typeof currentStateIndex === 'undefined' && action.actionId) {
      currentStateIndex = liftedState.stagedActionIds.indexOf(action.actionId);
    }
    return {
      ...state,
      states: {
        ...state.states,
        [id]: { ...liftedState, currentStateIndex }
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
  let sync = state.sync;

  delete connections[connectionId];
  instanceIds.forEach(id => {
    if (id === selected) {
      selected = null;
      sync = false;
    }
    if (id === current) {
      const inst = Object.keys(connections)[0];
      if (inst) current = connections[inst][0];
      else current = 'default';
    }
    delete options[id];
    delete states[id];
  });
  return {
    selected,
    current,
    sync,
    connections,
    options,
    states
  };
}

function init({ type, action, name, libConfig = {} }, connectionId, current) {
  let lib;
  let actionCreators;
  let isRedux;
  let creators = libConfig.actionCreators || action;
  if (typeof creators === 'string') creators = JSON.parse(creators);
  if (Array.isArray(creators)) actionCreators = creators;
  if (type === 'STATE') {
    lib = 'redux';
    isRedux = true;
  }
  return {
    name: libConfig.name || name || current,
    connectionId,
    explicitLib: libConfig.type,
    lib,
    actionCreators,
    features: libConfig.features ? libConfig.features :
      {
        lock: isRedux, persist: isRedux, export: libConfig.type === 'redux' ? 'custom' : true,
        import: 'custom', pause: true, reorder: true, jump: true, dispatch: true, test: true
      },
    serialize: libConfig.serialize
  };
}

export default function instances(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      const { request } = action;
      if (!request) return state;
      const connectionId = action.id || request.id;
      const current = request.instanceId || connectionId;
      let connections = state.connections;
      let options = state.options;

      if (typeof state.options[current] === 'undefined') {
        connections = {
          ...state.connections,
          [connectionId]: [...(connections[connectionId] || []), current]
        };
        options = { ...options, [current]: init(request, connectionId, current) };
      }

      return {
        ...state,
        current,
        connections,
        options,
        states: updateState(state.states, request, current, options[current].serialize)
      };
    case SET_STATE:
      return {
        ...state,
        states: {
          ...state.states,
          [getActiveInstance(state)]: action.newState
        }
      };
    case TOGGLE_SYNC:
      return { ...state, sync: !state.sync };
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected, sync: false };
    case REMOVE_INSTANCE:
      return removeState(state, action.id);
    case LIFTED_ACTION: {
      if (action.message === 'DISPATCH') return dispatchAction(state, action);
      if (action.message === 'IMPORT') {
        const id = state.selected || state.current;
        if (state.options[id].features.import === true) {
          return {
            ...state,
            states: {
              ...state.states,
              [id]: parseJSON(action.state)
            }
          };
        }
      }
      return state;
    }
    case DISCONNECTED:
      return initialState;
    default:
      return state;
  }
}

/* eslint-disable no-shadow */
export const getActiveInstance = instances => instances.selected || instances.current;
/* eslint-enable */
