import map from 'lodash/collection/map';
import reduce from 'lodash/collection/reduce';
import * as npm from 'utils/npm';

export function packageManagersToArray(packageManagers = Object) {
  return map(packageManagers, (pkgManagerData, pkgManagerName) => {
    return { pkgManagerName, ...pkgManagerData };
  });
}

export function packageManagersToObject(packageManagers = Array) {
  return packageManagers
    .reduce((results, { pkgManagerName, ...pkgManagerData }) =>
      ({ ...results, [pkgManagerName]: pkgManagerData }), {});
}

export function countOutdated(packageManagers, type) {
  function removeErrored(packages) {
    return reduce(packages, (results, versions, name) => {
      if (!versions.hasOwnProperty('warn')) results[name] = versions;
      return results;
    }, {});
  }

  return reduce(
    packageManagers,
    (count, pkgManagerData, pkgManagerName) => {
      if (pkgManagerName === 'npm') {
        const outdated = pkgManagerData.outdated[type];
        return Object.keys(removeErrored(outdated.dev)).length +
          Object.keys(removeErrored(outdated.prod)).length;
      }
      return 0;
    }, 0);
}

// Returns `packageManagers` with updated dependencies
export async function refreshOutdated(packageManagers) {
  const asArray = packageManagersToArray(packageManagers);
  const refreshed = await* asArray
    .map(async ({ pkgManagerName, ...pkgManagerData }) => {
      if (pkgManagerName === 'npm') {
        const outdated = await npm.check(pkgManagerData);
        return { pkgManagerName, ...pkgManagerData, outdated };
      }
      return { pkgManagerName, ...pkgManagerData };
    });
  return packageManagersToObject(refreshed);
}

// Returns no output, just update package manager associated file
// takes as second argument type of deps: `stable` || `latest`
export async function updateOutdated(packageManagers, type) {
  const asArray = packageManagersToArray(packageManagers);
  await* asArray.map(async ({ pkgManagerName, ...pkgManagerData }) => {
    if (pkgManagerName === 'npm') await npm.update(pkgManagerData, type);
    return;
  });
  return;
}
