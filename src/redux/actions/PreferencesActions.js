import at from '../constants/ActionTypes';

export function update(data) {
  return { type: at.PREFERENCES_UPDATE, data };
}

export function reset() {
  return { type: at.PREFERENCES_RESET };
}
