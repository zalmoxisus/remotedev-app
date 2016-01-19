import parseJSON from '../utils/parseJSON';

function recompute(previousLiftedState, storeState, action, nextActionId = 1) {
  const actionId = nextActionId - 1;
  const liftedState = { ...previousLiftedState };
  liftedState.stagedActionIds = [...liftedState.stagedActionIds, actionId];
  liftedState.actionsById = { ...liftedState.actionsById };
  if (action.type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action;
  } else {
    liftedState.actionsById[actionId] = {
      action: action.action || action,
      timestamp: action.timestamp,
      type: 'PERFORM_ACTION'
    };
  }
  liftedState.nextActionId = nextActionId;
  liftedState.computedStates = [...liftedState.computedStates, { state: storeState }];
  liftedState.currentStateIndex++;
  return liftedState;
}

export default function updateState(store, request, onInstancesChanged, instance) {
  const payload = parseJSON(request.payload);
  if (!payload) return null;

  let newState;
  let action = {};
  if (request.action) action = parseJSON(request.action) || {};

  if (instance === 'auto') store.liftedStore.setInstance(request.id);

  switch (request.type) {
    case 'INIT':
      newState = recompute(
        store.liftedStore.getInitialState(),
        payload,
        { action: { type: '@@INIT' }, timestamp: action.timestamp }
      );
      break;
    case 'ACTION':
      newState = recompute(
        store.liftedStore.getState(),
        payload,
        action,
        request.nextActionId
      );
      break;
    case 'STATE':
      newState = payload;
      break;
    default:
      return null;
  }

  const isNew = store.liftedStore.setState(newState, request.id);
  if (isNew) onInstancesChanged(request.id, request.name);

  return newState;
}
