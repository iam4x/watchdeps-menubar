import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import at from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');

const getOutdated = promisify(david.getUpdatedDependencies);

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
      const packageJson = await JSON.parse(rawPackage);

      const outdatedDeps = await getOutdated(packageJson);
      const outdatedDevDeps = await getOutdated(packageJson, { dev: true });

      return { outdatedDeps, outdatedDevDeps, path };
    }
  });
}
