import difference from 'lodash/difference';

export function sweep(liftedState) {
  const state = { ...liftedState };
  state.skippedActionIds.forEach(id => {
    delete state.actionsById[id];
    const idx = liftedState.stagedActionIds.indexOf(id);
    if (idx !== -1) state.computedStates.splice(idx, 1);
  });
  state.stagedActionIds = difference(state.stagedActionIds, state.skippedActionIds);
  state.skippedActionIds = [];
  state.currentStateIndex = Math.min(state.currentStateIndex, state.stagedActionIds.length - 1);
  return state;
}
