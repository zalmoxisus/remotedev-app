export default function createDevStore(onDispatch) {
  const initialState = {
    actionsById: {},
    computedStates: [],
    currentStateIndex: -1,
    monitorState: {},
    nextActionId: 0,
    skippedActionIds: [],
    stagedActionIds: []
  };
  let currentState = [];
  let listeners = [];
  let initiated = false;
  let instance;

  function getState(id) {
    if (id) return currentState[id] || initialState;
    if (instance) return currentState[instance] || initialState;
    return initialState;
  }

  function getInitialState() {
    return initialState;
  }

  function isSet() {
    return initiated;
  }

  function update() {
    listeners.forEach(listener => listener());
  }

  function setState(state, id, onChanged) {
    const isNew = !currentState[id];
    if (isNew && onChanged) onChanged();
    currentState[id] = state;
    update();
    initiated = true;
  }

  function setInstance(id, toUpdate) {
    instance = id;
    if (toUpdate && instance && instance !== 'auto') update();
  }

  function deleteInstance(id) {
    delete currentState[id];
    instance = Object.keys(currentState)[0];
    update();
  }

  function dispatch(action) {
    if (action.type === 'JUMP_TO_STATE') {
      let state = getState();
      onDispatch('DISPATCH', action, instance, state.computedStates[action.index].state);
      setState({ ...state, currentStateIndex: action.index }, instance);
    } else onDispatch('DISPATCH', action, instance);
    return action;
  }

  function dispatchAction(action) {
    onDispatch('ACTION', action, instance);
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    dispatch: dispatchAction,
    getState,
    subscribe,
    liftedStore: {
      dispatch,
      getInitialState,
      getState,
      setState,
      setInstance,
      deleteInstance,
      subscribe,
      isSet
    }
  };
}
