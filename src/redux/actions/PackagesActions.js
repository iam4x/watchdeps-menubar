import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import at from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');
const check = promisify(david.getUpdatedDependencies);

export function addPackage(path) {
  return { type: at.PACKAGE_ADD, path };
}

export function removePackage(path) {
  return { type: at.PACKAGE_REMOVE, path };
}

export function checkOutdated(path) {
  return asyncFuncCreator({
    constant: 'PACKAGE_CHECK_OUTDATED',
    selected: path,
    promise: async () => {
      const rawPackage = await fs.read(path);
      const packageJson = JSON.parse(rawPackage);

      const promises = [ check(packageJson), check(packageJson, { dev: true }) ];
      const [ outdatedDeps, outdatedDevDeps ] = await* promises;

      return { outdatedDeps, outdatedDevDeps, path };
    }
  });
}
