import { UPDATE_REPORTS } from '../constants/actionTypes';

const initialState = {
  data: []
};

export default function reports(state = initialState, action) {
  if (action.type !== UPDATE_REPORTS) return state;
  const request = action.request;
  const data = request.data;
  switch (request.type) {
    case 'list':
      return {
        ...state,
        data
      };
    case 'add':
      return {
        ...state,
        data: [...state.data, data]
      };
    case 'remove':
      return {
        ...state,
        data: state.data.filter(d => d.id !== request.id)
      };
    default:
      return state;
  }
}
