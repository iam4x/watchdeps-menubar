import at from '../constants/ActionTypes';

const initialState = { collection: [] };

export default function packages(state = initialState, action) {
  switch (action.type) {
  case at.PACKAGE_ADD:
    return {
      ...state,
      collection: state.collection.indexOf(action.packagePath) > -1 ?
      [ ...state.collection ] : [ ...state.collection, action.packagePath ]
    };

  case at.PACKAGE_CHECK_OUTDATED:
    return { ...state, error: null, loading: true };

  case at.PACKAGE_CHECK_OUTDATED_FAIL:
    return { ...state, error: action.result, loading: false };

  case at.PACKAGE_CHECK_OUTDATED_SUCCESS:
    return { ...state, ...action.result, loading: false };

  default:
    return { ...state };
  }
}
