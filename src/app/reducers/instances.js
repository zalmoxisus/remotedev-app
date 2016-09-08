import { UPDATE_STATE, SELECT_INSTANCE, REMOVE_INSTANCE } from '../constants/actionTypes';
import { DISCONNECT } from '../constants/socketActionTypes';

const initialState = {
  selected: null,
  names: {},
  connections: {}
};

function removeState(state, connectionId) {
  const instanceIds = state.connections[connectionId];
  if (!instanceIds) return state;
  const names = { ...state.names };
  const connections = { ...state.connections };

  delete connections[connectionId];
  instanceIds.forEach(id => {
    delete names[id];
  });
  return {
    selected: null,
    connections,
    names
  };
}

export default function instances(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE:
      const { request } = action;
      const connectionId = request.id;
      const instanceId = request.instanceId || connectionId;
      if (typeof state.names[instanceId] !== 'undefined') return state;

      const instanceIds = state.connections[connectionId] || [];
      instanceIds.push(instanceId);
      return {
        ...state,
        connections: {
          ...state.connections,
          [connectionId]: instanceIds
        },
        names: {
          ...state.names,
          [instanceId]: request.name || instanceId
        }
      };
    case SELECT_INSTANCE:
      return { ...state, selected: action.selected };
    case REMOVE_INSTANCE:
      return removeState(state, action.id);
    case DISCONNECT:
      return initialState;
    default:
      return state;
  }
}
