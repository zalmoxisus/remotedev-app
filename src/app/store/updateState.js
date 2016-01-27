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

export default function updateState(store, request, onInstancesChanged, instance, sync) {
  const payload = parseJSON(request.payload);
  if (!payload) return null;

  let newState;
  let action = {};
  if (request.action) action = parseJSON(request.action) || {};

  if (!instance || instance === 'auto') store.liftedStore.setInstance(request.id);

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
        store.liftedStore.getState(request.id),
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

  store.liftedStore.setState(newState, request.id, () => {
    if (onInstancesChanged) onInstancesChanged(request.id, request.name);
  });

  if (sync && request.id === instance) sync(newState, instance);

  return newState;
}
