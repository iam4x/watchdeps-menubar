import { reduce } from 'lodash-fp';

import remote from 'remote';
import { promisify } from 'app-utils';

import { asyncFuncCreator } from '../utils';
import at from '../constants/ActionTypes';

const fs = remote.require('q-io/fs');
const david = remote.require('david');
const { dirname } = remote.require('path');
const { spawn } = remote.require('child-process-promise');

const check = promisify(david.getUpdatedDependencies);

export function add({ path }) {
  return { type: at.PACKAGE_ADD, path };
}

export function remove({ path }) {
  return { type: at.PACKAGE_REMOVE, path };
}

export function refresh({ path, withLatest }) {
  return asyncFuncCreator({
    constant: 'PACKAGE_REFRESH',
    selected: path,
    promise: async () => {
      const rawPackage = await fs.read(path);
      const packageJson = JSON.parse(rawPackage);

      const [ outdatedDeps, outdatedDevDeps ] = await* [
        check(packageJson, { stable: !withLatest }),
        check(packageJson, { dev: true, stable: !withLatest })
      ];

      return { outdatedDeps, outdatedDevDeps, path };
    }
  });
}

export function update({ path, outdatedDeps, outdatedDevDeps, withLatest }) {
  const ver = withLatest ? 'latest' : 'stable';

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
