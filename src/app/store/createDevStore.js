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
  let currentState = [];
  let listeners = [];
  let initiated = false;
  let instance;

  function dispatch(action) {
    if (action.type[0] !== '@') onDispatch(action, instance);
    return action;
  }

  function getState() {
    return (
      (instance ? currentState[instance] : initialState) || initialState
    );
  }

  function getInitialState() {
    return initialState;
  }

  function isSet() {
    return initiated;
  }

  function setState(state, id) {
    const isNew = !currentState[id];
    currentState[id] = state;
    listeners.forEach(listener => listener());
    initiated = true;
    return isNew;
  }

  function setInstance(id) {
    instance = id;
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
      setInstance,
      subscribe,
      isSet
    }
  };
}
