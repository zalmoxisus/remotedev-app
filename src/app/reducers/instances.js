import { UPDATE_STATE } from '../constants/actionTypes';

const initialState = {
  names: {},
  connections: {}
};

function disconnected(state, connectionId) {
  const instanceIds = state.connections[connectionId];
  if (!instanceIds) return state;
  const names = { ...state.names };
  const connections = { ...state.connections };

  delete connections[connectionId];
  instanceIds.forEach(id => {
    delete names[id];
  });
  return {
    connections,
    names
  };
}

export default function instances(state = initialState, action) {
  if (action.type !== UPDATE_STATE) return state;

  const { request } = action;
  const connectionId = request.id;

  if (request.type === 'DISCONNECTED') {
    return disconnected(state, connectionId);
  }

  const instanceId = request.instanceId || connectionId;
  if (/* request.type === 'START' || */ !state.names[instanceId]) {
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
  }

  return state;
}
