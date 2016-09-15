import { TEST_ADD, TEST_EDIT, TEST_REMOVE, TEST_SELECT } from '../constants/actionTypes';

const initialState = {
  selected: 0,
  templates: undefined
};

export default function monitor(state = initialState, action) {
  let templates;
  switch (action.type) {
    case TEST_SELECT:
      return { ...state, selected: action.selected };
    case TEST_EDIT:
      templates = [...(state.templates || action.templates)];
      templates[state.selected] = action.template;
      return { ...state, templates };
    case TEST_ADD:
      return {
        ...state,
        selected: state.templates.length,
        templates: [...(state.templates || action.templates), action.template]
      };
    case TEST_REMOVE:
      templates = state.templates || action.templates;
      return {
        ...state,
        selected: 0,
        templates: templates.length === 1 ? undefined : [
          ...templates.slice(0, state.selected),
          ...templates.slice(state.selected + 1)
        ]
      };
    default:
      return state;
  }
}
