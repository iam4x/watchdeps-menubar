import at from 'redux/constants/ActionTypes';
import { asyncFuncCreator } from 'redux/utils';

import * as utils from 'utils/projects';

export function create(project) {
  return { type: at.PROJECT_CREATE, result: { project } };
}

export function remove(project) {
  return { type: at.PROJECT_REMOVE, result: { project } };
}

export function refresh(project) {
  return asyncFuncCreator({
    constant: 'PROJECT_REFRESH',
    result: { project: { ...project, refreshing: true } },
    promise: async () => {
      const { packageManagers } = project;
      const refreshedOutdated = await utils.refreshOutdated(packageManagers);
      return { project: { ...project, refreshing: false,
        packageManagers: refreshedOutdated } };
    }
  });
}

export function update(project, dependenciesType) {
  return asyncFuncCreator({
    constant: 'PROJECT_UPDATE',
    result: { project: { ...project, updating: true } },
    promise: async () => {
      try {
        const { packageManagers } = project;
        await utils.updateOutdated(packageManagers, dependenciesType);
        const refreshedOutdated = await utils.refreshOutdated(packageManagers);
        return { project: { ...project, updating: false,
          packageManagers: refreshedOutdated } };
      } catch (error) {
        console.warn(error.message);
        console.warn(error.stack);
        throw error;
      }
    }
  });
}
