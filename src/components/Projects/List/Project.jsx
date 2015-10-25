import map from 'lodash/collection/map';

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import { countOutdated, packageManagersToArray } from 'utils/projects';
import { refresh, update, remove, updateOne } from 'redux/actions/ProjectsActions';

class Project extends Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    dependenciesType: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  static contextTypes = { store: PropTypes.object.isRequired }

  handleUpdateOne({ versions, ...rest }) {
    const { project, dependenciesType } = this.props;
    const { store: { dispatch } } = this.context;

    const version = versions[dependenciesType];

    return dispatch(updateOne({ type: 'npm', project, version, ...rest }));
  }

  renderDependencies(dependencies: Object, dev) {
    const { dependenciesType, project: { updating, refreshing } } = this.props;

    return (
      <table className='table dependencies'>
        <thead>
          <tr>
            <th width='170px'>{ dev ? 'devDependencies' : 'dependencies' }</th>
            <th width='20%' className='text-right'>actual</th>
            <th width='20%' className='text-right'>stable</th>
            { dependenciesType === 'latest' &&
              <th width='20%' className='text-right'>latest</th> }
            <th className='text-right'>actions</th>
          </tr>
        </thead>
        <tbody>
          { map(dependencies, (versions, dependency) => ({ versions, dependency }))
            .sort((curr, next) => curr.dependency > next.dependency ? 1 : -1)
            .map(({ dependency, versions }) =>
              versions.warn ?
                <tr key={ dependency }>
                  <td>{ dependency }</td>
                  <td
                    className='text-right'
                    colSpan={ dependenciesType === 'latest' ? 3 : 2 }>
                    <span className='label label-danger'>
                      can't fetch versions
                    </span>
                  </td>
                  <td className='text-right'>
                    <button
                      className='btn label label-default'
                      disabled>
                      <i className='fa fa-cog' /> update
                    </button>
                  </td>
                </tr> :
                <tr
                  key={ dependency }
                  className='dependency'>
                  <td>{ dependency }</td>
                  <td className='text-right'>{ versions.required }</td>
                  <td className='text-right'>{ versions.stable }</td>
                  { dependenciesType === 'latest' &&
                    <td className='text-right'>{ versions.latest }</td>}
                  <td className='text-right'>
                    <button
                      className='label btn btn-primary'
                      onClick={ () =>
                        this.handleUpdateOne({ dev, versions, dependency }) }
                      disabled={ updating || refreshing }>
                      <i className={ cx(
                          'fa fa-cog',
                          updating && 'fa-spin') } /> update
                    </button>
                  </td>
                </tr>) }
        </tbody>
      </table>
    );
  }

  renderPackageManger({ pkgManagerName, ...pkgManagerData }) {
    const { dependenciesType } = this.props;
    const outdated = pkgManagerData.outdated[dependenciesType];

    if (pkgManagerName === 'npm') {
      const { dev, prod } = outdated;

      const devCount = Object.keys(dev).length;
      const prodCount = Object.keys(prod).length;

      return (
        <div
          key={ pkgManagerName }
          className='app--project--details'>
          { prodCount > 0 && this.renderDependencies(prod) }
          { devCount > 0 && this.renderDependencies(dev, true) }
        </div>
      );
    }

    return (<div className='hide' />);
  }

  render() {
    const { store: { dispatch } } = this.context;
    const { project, dependenciesType, onSelect } = this.props;

    const { name, path, refreshing, updating, packageManagers } = project;
    const outdatedCount = countOutdated(packageManagers, dependenciesType);

    const [, parentDir ] = path.split('/').reverse();

    return (
      <div
        key={ project.id }
        className='app--project'>
        <header
          onClick={ onSelect }
          className='project--header clearfix'>
          <div className='pull-left'>
            <span className='label label-default'>
              { parentDir } / { name }
            </span>
          </div>
          <div className='pull-left'>
            { outdatedCount > 0 ?
              <div className='label label-warning'>
                { outdatedCount } dependencies outdated
                <i className='fa fa-exclamation-triangle' />
              </div> :
              <div className='label label-success'>
                dependencies are up to date
                <i className='fa fa-check'/>
              </div> }
          </div>
          <div className='pull-right'>
            <button
              className='btn btn-success label'
              onClick={ () => dispatch(refresh(project)) }
              disabled={ refreshing || updating }>
              <i className={ cx('fa fa-refresh', refreshing && 'fa-spin') } /> refresh
            </button>
            <button
              className='btn btn-primary label'
              onClick={ () => dispatch(update(project, dependenciesType)) }
              disabled={ refreshing || updating || outdatedCount === 0 }>
              <i className={ cx('fa fa-cog', updating && 'fa-spin') } /> update
            </button>
            <button
              className='btn btn-danger label'
              onClick={ () => dispatch(remove(project)) }>
              <i className='fa fa-times' /> remove
            </button>
          </div>
        </header>
        <main className='active'>
          { packageManagersToArray(packageManagers)
            .sort((curr, next) =>
              curr.pkgManagerName > next.pkgManagerName ? 1 : -1)
            .map(::this.renderPackageManger) }
        </main>
      </div>
    );
  }

}

export default Project;
