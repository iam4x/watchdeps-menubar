import at from '../constants/ActionTypes';
import { __ } from '../utils';

const initialState = { collection: [] };

export default function packages(state = initialState, action) {
  const { collection } = state;
  const { type, result, packagePath } = action;

  switch (type) {
  case at.PACKAGE_ADD:
    return { ...state, collection: __('add', collection, packagePath) };

  case at.PACKAGE_REMOVE:
    return { ...state, collection: __('remove', collection, packagePath) };

  case at.PACKAGE_CHECK_OUTDATED:
    return { ...state, error: null, loading: true, selected: action.selected };

  case at.PACKAGE_CHECK_OUTDATED_FAIL:
    return { ...state, error: result, loading: false };

  case at.PACKAGE_CHECK_OUTDATED_SUCCESS:
    const { outdatedDeps, outdatedDevDeps } = result;
    return { ...state, outdatedDeps, outdatedDevDeps, loading: false };

  default:
    return { ...state };
  }
}
