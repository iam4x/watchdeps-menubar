import React, { Component, PropTypes } from 'react';
import remote from 'remote';
import cx from 'classnames';

const { dirname, basename } = remote.require('path');
const { exec } = remote.require('child_process');

class Packages extends Component {

  static propTypes = {
    onPackageRemove: PropTypes.func.isRequired,
    onPackageRefresh: PropTypes.func.isRequired,
    onPackageUpdate: PropTypes.func.isRequired,
    collection: PropTypes.array.isRequired,
    selected: PropTypes.string,
    loading: PropTypes.bool,
    updating: PropTypes.bool
  }

  renderPackage({ id, path, outdatedDeps = {}, outdatedDevDeps = {} }) {
    const { selected, loading, updating } = this.props;
    const { onPackageRefresh, onPackageRemove, onPackageUpdate } = this.props;

    const active = (path === selected);
    const nbOutdated = Object.keys(outdatedDeps).length;
    const nbDevOutdated = Object.keys(outdatedDevDeps).length;

    return (
      <tr
        key={ id }
        className={ cx('app--package', { active }) }>
        <td>
          <span
            className='label label-default btn'
            style={ { fontWeight: (path === selected) ? 'bold' : 'normal' } }
            onClick={ () => onPackageRefresh(path) }>
            <i
              className={ cx('fa', active ? 'fa-folder-open' : 'fa-folder') }
              onClick={ () => exec(`open ${dirname(path)}`) }
              style={ { marginRight: 10 } } />
            { basename(dirname(path)) }
          </span>
        </td>
        <td>
          <span
            className={ cx('label label-success', nbOutdated && 'label-warning') }>
            dependencies { nbOutdated && (<span> ({ nbOutdated })</span>) }
          </span>
          <span
            className={ cx('label label-success', nbOutdated && 'label-warning')}>
            devDependencies { nbDevOutdated && (<span> ({ nbDevOutdated })</span>) }
          </span>
        </td>
        <td className='text-right'>
          <span
            className='label label-success btn btn-sm'
            onClick={ () => onPackageRefresh(path) }>
            <i className={ cx('fa fa-refresh', active && loading && 'fa-spin') } />
          </span>
          <span
            className='label label-primary btn btn-sm'
            onClick={ () => onPackageUpdate({ path, outdatedDeps, outdatedDevDeps }) }>
            Update { (active && updating) && <i className='fa fa-cog fa-spin' /> }
          </span>
          <span
            className='label label-danger btn btn-sm'
            onClick={ () => onPackageRemove(path) }>
            Remove
          </span>
        </td>
      </tr>
    );
  }

  render() {
    const { collection } = this.props;

    return (
      <div className='card-block'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Parent directory</th>
              <th>Status</th>
              <th className='text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            { collection.map(::this.renderPackage) }
          </tbody>
        </table>
      </div>
    );
  }

}

export default Packages;
