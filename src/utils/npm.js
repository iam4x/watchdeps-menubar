import map from 'lodash/collection/map';

import promisify from 'utils/promisify';
import remote from 'remote';

const fs = remote.require('q-io/fs');
const david = remote.require('david');
const getUpdated = promisify(david.getUpdatedDependencies);

export async function check({ path }) {
  const packageRAW = await fs.read(path);
  const packageJSON = JSON.parse(packageRAW);
  const results = await* [
    getUpdated(packageJSON, { stable: true }),
    getUpdated(packageJSON, { dev: true, stable: true }),
    getUpdated(packageJSON, { stable: false }),
    getUpdated(packageJSON, { dev: true, stable: false })
  ];
  return { stable: { prod: results[0], dev: results[1] },
    latest: { prod: results[2], dev: results[3] } };
}

const { dirname } = remote.require('path');
const { spawn } = remote.require('child-process-promise');

export async function update({ path, outdated }, type) {
  const opts = { cwd: dirname(path) };

  function asArray(deps) {
    return map(deps, (versions, dep) => ({ versions, dep }))
      .filter(({ versions }) => !versions.warn)
      .map(({ versions, dep }) => dep + '@' + versions[type]);
  }

  const dev = [ 'i', '-D', ...asArray(outdated[type].dev) ];
  const prod = [ 'i', '-S', ...asArray(outdated[type].prod) ];
  await* [ spawn('npm', prod, opts), spawn('npm', dev, opts) ];

  return;
}
