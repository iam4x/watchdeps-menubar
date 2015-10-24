import at from '../constants/ActionTypes';

const initialState = { withLatest: false };

export default function preferences(state = initialState, action) {
  const { type, data } = action;

  switch (type) {
  case at.PREFERENCES_UPDATE:
    return { ...state, ...data };

  case at.PREFERENCES_RESET:
    return { ...initialState };

  default:
    return { ...state };
  }
}
