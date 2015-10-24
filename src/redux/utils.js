// Utils for removing boilerplate from Redux
import at from './constants/ActionTypes';

export function asyncFuncCreator({ constant, ...rest }) {
  return {
    types: [
      at[constant],
      at[constant + '_SUCCESS'],
      at[constant + '_FAIL']
    ],
    ...rest
  };
}

export function generateConstants(constants) {
  return constants.reduce((result, constant) => {
    if (constant.indexOf('(ASYNC)')) {
      const clean = constant.replace('(ASYNC)', '');
      result[clean] = clean;
      result[clean + '_SUCCESS'] = clean + '_SUCCESS';
      result[clean + '_FAIL'] = clean + '_FAIL';
    } else {
      result[constant] = constant;
    }
    return result;
  }, {});
}

// TODO: Remove this util, use `lodash-fp` into reducers
export function __(method, collection, findIndex, data) {
  const index = collection
    .findIndex(item => item[findIndex] === data[findIndex]);

  switch (method) {
  case 'add':
    if (index === -1) return [ ...collection, data ];
    return [ ...collection ];

  case 'remove':
    if (index > -1) {
      const updated = [ ...collection ];
      updated.splice(index, 1);
      return [ ...updated ];
    }
    return [ ...collection ];

  case 'update':
    if (index > -1) {
      const updated = [ ...collection ];
      updated[index] = { ...updated[index], ...data };
      return [ ...updated ];
    }
    return [ ...collection ];

  default:
    return [ ...collection ];
  }
}
