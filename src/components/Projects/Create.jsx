import map from 'lodash/collection/map';
import reduce from 'lodash/collection/reduce';
import includes from 'lodash/collection/includes';
import isEmpty from 'lodash/lang/isEmpty';
import defer from 'lodash/function/defer';

import React, { Component, PropTypes } from 'react';
import remote from 'remote';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { Link } from 'react-router';

import { refreshOutdated } from 'utils/projects';
import { create } from 'redux/actions/ProjectsActions';
import SelectFile from 'components/Shared/SelectFile';

const { list } = remote.require('q-io/fs');

@connect(({ projects: { projects } }) => ({ projects }))
class ProjectCreate extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired
  }

  state = { project: { id: generate() }, isWorking: false }

  async handleSelected(projectPath) {
    try {
      const [ projectName ] = projectPath.split('/').reverse();
      const files = await list(projectPath);
      const pkgManagers = { npm: 'package.json', bower: 'bower.json', bundler: 'Gemfile' };
      const foundPkgManagers = reduce(
        pkgManagers,
        (found, pkgFile, pkgManager) =>
          includes(files, pkgFile) ?
            { ...found, [pkgManager]: { path: projectPath + '/' + pkgFile } } :
            { ...found },
        {}
      );

      const project = { name: projectName, path: projectPath,
        packageManagers: foundPkgManagers };
      return this.setState({ project: { ...this.state.project, ...project } });
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
    }
  }

  handleNameChange({ target: { value } }) {
    const { project } = this.state;
    return this.setState({ project: { ...project, name: value } });
  }

  async handleSave() {
    this.setState({ isWorking: true });
    try {
      const { dispatch, history } = this.props;
      const { project: { packageManagers, ...rest } } = this.state;

      // find outdates dependencies
      // and store them into project
      const refreshedOutdated = await refreshOutdated(packageManagers);
      const project = { ...rest, packageManagers: refreshedOutdated };

      // create project into project store
      dispatch(create(project));

      // transition to projects list
      return defer(() => history.replaceState(null, '/'));
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
      return this.setState({ isWorking: false });
    }
  }

  render() {
    const { projects } = this.props;
    const { project: { path, name, packageManagers }, isWorking } = this.state;

    const alreadyExists = projects
      .some((project) => project.path === path);

    return (
      <div className='app--project--create'>
        <header>
          <Link to='/'>
            <i className='fa fa-arrow-left' /> back to projects list
          </Link>
        </header>
        <main className='alert alert-info'>
          <div
            className='clearfix'
            style={ { marginBottom: 10 } }>
            <div
              className='pull-left'
              style={ { marginRight: path && 10 } }>
              <SelectFile
                label={ 'Select your project directory' }
                properties={ [ 'openDirectory' ] }
                onSelected={ ::this.handleSelected } />
              { path &&
                <code style={ { marginLeft: 10 } }>{ path }</code> }
            </div>
          </div>
          { (path && alreadyExists) &&
            <div className='alert alert-warning'>
              Project already exists, please choose another project directory
            </div> }
          { (path && !alreadyExists) &&
            <div>
              <div className='form-group'>
                <label htmlFor='name'>Project name</label>
                <input
                  type='text'
                  className='form-control'
                  value={ name }
                  onChange={ ::this.handleNameChange } />
              </div>
              { isEmpty(packageManagers) ?
                <div className='alert alert-warning'>
                  No package manager found, please choose another project directory
                </div> :
                <div className='form-group'>
                  <label htmlFor='packageManagers'>
                    Package manager(s) found for project
                  </label>
                  <ul>
                    { map(packageManagers, (pkgManagerData, pkgManagerName) =>
                      <li
                        key={ pkgManagerName }
                        style={ { fontSize: 13 } }>
                        <strong>{ pkgManagerName }</strong>
                        <code
                          style={ { marginLeft: 10 } }>
                          { pkgManagerData.path }
                        </code>
                      </li>) }
                  </ul>
              </div> }
            </div> }
          { (path && !isEmpty(packageManagers) && name && !alreadyExists) &&
            <button
              className='btn btn-primary'
              onClick={ ::this.handleSave }
              disabled={ isWorking }>
              { !isWorking ?
                <span>Save project</span> :
                <i className='fa fa-refresh fa-spin' /> }
            </button> }
        </main>
      </div>
    );
  }

}

export default ProjectCreate;
