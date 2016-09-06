import parseJSON from '../utils/parseJSON';
import commitExcessActions from './commitExcessActions';

function recompute(previousLiftedState, storeState, action, nextActionId = 1, isExcess) {
  const actionId = nextActionId - 1;
  const liftedState = { ...previousLiftedState };
  liftedState.stagedActionIds = [...liftedState.stagedActionIds, actionId];
  liftedState.actionsById = { ...liftedState.actionsById };
  if (action.type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action;
  } else {
    liftedState.actionsById[actionId] = {
      action: action.action || action,
      timestamp: action.timestamp || Date.now(),
      type: 'PERFORM_ACTION'
    };
  }
  liftedState.nextActionId = nextActionId;
  liftedState.computedStates = [...liftedState.computedStates, { state: storeState }];
  liftedState.currentStateIndex++;

  if (isExcess) commitExcessActions(liftedState);

  return liftedState;
}

export default function updateState(store, request, onInstancesChanged, instance, sync) {
  let instanceId = request.instanceId || request.id;
  if (request.type === 'START' && onInstancesChanged) {
    onInstancesChanged(
      { id: request.id, instanceId },
      request.name
    );
  }

  const payload = parseJSON(request.payload);
  if (typeof payload === 'undefined') return null;

  let newState;
  let action = {};
  if (request.action) action = parseJSON(request.action) || {};

  if (!instance) store.liftedStore.setInstance(instanceId);

  switch (request.type) {
    case 'INIT':
      newState = recompute(
        store.liftedStore.getInitialState(),
        payload,
        { action: { type: '@@INIT' }, timestamp: action.timestamp || Date.now() }
      );
      break;
    case 'ACTION':
      const liftedState = store.liftedStore.getState(instanceId);
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
      return null;
  }

  store.liftedStore.setState(newState, instanceId, () => {
    store.init(request);
    if (onInstancesChanged) {
      onInstancesChanged(
        { id: request.id, instanceId },
        request.name
      );
    }
  });

  if (sync && instanceId === instance) sync(newState, instance);

  return newState;
}
