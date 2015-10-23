import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import { PACKAGE_ADD } from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');

const getOutdated = promisify(david.getUpdatedDependencies);

export function addPackage(packagePath) {
  return { type: PACKAGE_ADD, packagePath };
}

export function checkOutdated(packagePath) {
  return asyncFuncCreator({
    constant: 'PACKAGE_CHECK_OUTDATED',
    promise: async () => {
      const rawPackage = await fs.read(packagePath);
      const packageJson = await JSON.parse(rawPackage);

      const outdatedDeps = await getOutdated(packageJson);
      const outdatedDevDeps = await getOutdated(packageJson, { dev: true });

      return { outdatedDeps, outdatedDevDeps };
    }
  });
}
