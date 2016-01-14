export default function createDevToolsStore(onDispatch) {
  const initialState = {
    actionsById: {},
    computedStates: [],
    currentStateIndex: -1,
    monitorState: {},
    nextActionId: 0,
    skippedActionIds: [],
    stagedActionIds: []
  };
  let currentState = { ...initialState };
  let listeners = [];
  let initiated = false;

  function dispatch(action) {
    if (action.type[0] !== '@') onDispatch(action);
    return action;
  }

  function getState() {
    return currentState;
  }

  function getInitialState() {
    return initialState;
  }

  function isSet() {
    return initiated;
  }

  function setState(state) {
    currentState = state;
    listeners.forEach(listener => listener());
    initiated = true;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    dispatch,
    getState,
    subscribe,
    liftedStore: {
      dispatch,
      getInitialState,
      getState,
      setState,
      subscribe,
      isSet
    }
  };
}
