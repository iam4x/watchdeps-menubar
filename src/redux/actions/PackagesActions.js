import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import at from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');

const getOutdated = promisify(david.getUpdatedDependencies);

export function addPackage(packagePath) {
  return { type: at.PACKAGE_ADD, packagePath };
}

export function removePackage(packagePath) {
  return { type: at.PACKAGE_REMOVE, packagePath };
}

export function checkOutdated(packagePath) {
  return asyncFuncCreator({
    constant: 'PACKAGE_CHECK_OUTDATED',
    selected: packagePath,
    promise: async () => {
      const rawPackage = await fs.read(packagePath);
      const packageJson = await JSON.parse(rawPackage);

      const outdatedDeps = await getOutdated(packageJson);
      const outdatedDevDeps = await getOutdated(packageJson, { dev: true });

      return { outdatedDeps, outdatedDevDeps, packagePath };
    }
  });
}
