import { generate } from 'shortid';

import at from '../constants/ActionTypes';
import { __ } from '../utils';

const initialState = { collection: [] };

export default function packages(state = initialState, action) {
  const { collection } = state;
  const { type, path, result = {} } = action;
  const { outdatedDeps, outdatedDevDeps } = result;

  switch (type) {
  case at.PACKAGE_ADD:
    return { ...state,
      collection: __('add', collection, 'path', { id: generate(), path }) };

  case at.PACKAGE_REMOVE:
    return { ...state, collection: __('remove', collection, 'path', { path }) };

  case at.PACKAGE_UPDATE:
    return { ...state, error: null, updating: true, selected: action.selected };

  case at.PACKAGE_UPDATE_FAIL:
    return { ...state, error: result, updating: false };

  case at.PACKAGE_UPDATE_SUCCESS:
    return { ...state, error: null, updating: false,
      collection: __('update', collection, path,
        { path: result.path, ...result.remaining }) };

  case at.PACKAGE_REFRESH:
    return { ...state, error: null, loading: true, selected: action.selected };

  case at.PACKAGE_REFRESH_FAIL:
    return { ...state, error: result, loading: false };

  case at.PACKAGE_REFRESH_SUCCESS:
    return { ...state, loading: false,
      collection: __('update', collection, 'path',
        { path: result.path, outdatedDeps, outdatedDevDeps }) };

  default:
    return { ...state };
  }
}
