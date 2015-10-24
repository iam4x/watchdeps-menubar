import reduce from 'lodash/collection/reduce';

import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import at from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');
const { dirname } = remote.require('path');
const { spawn } = remote.require('child-process-promise');

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

export function update({ path, outdatedDeps, outdatedDevDeps, ver = 'stable' }) {
  return asyncFuncCreator({
    constant: 'PACKAGE_UPDATE',
    selected: path,
    promise: async () => {
      const opts = { cwd: dirname(path) };

      function depsToArray(deps, vt) {
        return Object.keys(deps)
          .filter(name => deps[name][vt])
          .map(name => name + '@' + deps[name][vt]);
      }

      function getRemaining(result, versions, name) {
        if (versions.stable !== versions.latest) result[name] = versions;
        return result;
      }

      await* [ spawn('npm', [ 'i', '-S', ...depsToArray(outdatedDeps, ver) ], opts),
        spawn('npm', [ 'i', '-D', ...depsToArray(outdatedDevDeps, ver) ], opts) ];

      const remaining = (ver === 'stable') ?
        { outdatedDeps: reduce(outdatedDeps, getRemaining, {}),
          outdatedDevDeps: reduce(outdatedDevDeps, getRemaining, {}) } :
        { outdatedDeps: {}, outdatedDevDeps: {} };

      return { path, remaining };
    }
  });
}
