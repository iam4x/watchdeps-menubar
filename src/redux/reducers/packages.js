import { generate } from 'shortid';

import at from '../constants/ActionTypes';
import { __ } from '../utils';

const initialState = { collection: [] };

export default function packages(state = initialState, action) {
  const { collection } = state;
  const { type, result, path } = action;

  switch (type) {
  case at.PACKAGE_ADD:
    const newPackage = { id: generate(), path };
    return { ...state, collection: __('add', collection, 'path', newPackage) };

  case at.PACKAGE_REMOVE:
    return { ...state, collection: __('remove', collection, 'path', { path }) };

  case at.PACKAGE_UPDATE:
    return { ...state, error: null, updating: true, selected: action.selected };

  case at.PACKAGE_UPDATE_FAIL:
    return { ...state, error: result, updating: false };

  case at.PACAKAGE_UPDATE_SUCCESS:
    return { ...state, error: null, updating: false };

  case at.PACKAGE_CHECK_OUTDATED:
    return { ...state, error: null, loading: true, selected: action.selected };

  case at.PACKAGE_CHECK_OUTDATED_FAIL:
    return { ...state, error: result, loading: false };

  case at.PACKAGE_CHECK_OUTDATED_SUCCESS:
    const { outdatedDeps, outdatedDevDeps } = result;

    const update = { path: result.path, outdatedDeps, outdatedDevDeps };
    const updatedCollection = __('update', collection, 'path', update);

    return { ...state, loading: false, collection: updatedCollection };

  default:
    return { ...state };
  }
}
