import { SELECT_INSTANCE } from '../constants/actionTypes';

export function selectInstance(event, index, selected) {
  return { type: SELECT_INSTANCE, selected };
}
