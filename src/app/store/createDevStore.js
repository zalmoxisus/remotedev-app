import { stringify } from 'jsan';

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
  let isReduxStore = [];
  let instance;

  function getState(id, strict) {
    if (id) return currentState[id] || !strict && initialState;
    if (instance) return currentState[instance] || initialState;
    return initialState;
  }

  function getInitialState() {
    return initialState;
  }

  function getInstance() {
    return instance;
  }

  function update() {
    listeners.forEach(listener => listener());
  }

  function setState(state, id, onChanged) {
    const isNew = !currentState[id];
    if (isNew && onChanged) onChanged();
    currentState[id] = state;
    update();
  }

  function setInstance(id, toUpdate) {
    instance = id;
    if (toUpdate && instance) update();
  }

  function deleteInstance(id) {
    delete currentState[id];
    delete isReduxStore[id];
    instance = Object.keys(currentState)[0];
    update();
  }

  function clear() {
    currentState = [];
    isReduxStore = [];
    update();
  }

  function dispatch(action, id = instance) {
    let state;
    if (action.type === 'JUMP_TO_STATE') {
      const liftedState = getState();
      if (!isReduxStore[id]) state = stringify(liftedState.computedStates[action.index].state);
      onDispatch('DISPATCH', action, id, state);
      setState({ ...liftedState, currentStateIndex: action.index }, id);
    } else if (action.type[0] !== '@') {
      if (!isReduxStore[id]) {
        if (action.type === 'ROLLBACK') {
          state = stringify(getState().computedStates[0].state);
        } else if (action.type === 'TOGGLE_ACTION') {
          state = stringify(getState());
        }
      }
      onDispatch('DISPATCH', action, id, state);
    }
    return action;
  }

  function dispatchAction(action) {
    if (action && action.type) onDispatch('ACTION', action, instance);
    return action;
  }

  function importState(state) {
    onDispatch('IMPORT', undefined, instance, state);
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function setAsRedux(id) {
    isReduxStore[id] = true;
  }

  function isRedux(id) {
    return isReduxStore[id];
  }

  return {
    dispatch: dispatchAction,
    getState,
    subscribe,
    setAsRedux,
    isRedux,
    clear,
    liftedStore: {
      dispatch,
      getInstance,
      getInitialState,
      getState,
      setState,
      setInstance,
      deleteInstance,
      subscribe,
      importState
    }
  };
}
