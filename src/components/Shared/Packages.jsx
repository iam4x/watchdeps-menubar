import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class Packages extends Component {

  static propTypes = {
    onPackageRemove: PropTypes.func.isRequired,
    onPackageClick: PropTypes.func.isRequired,
    packages: PropTypes.array.isRequired,
    selected: PropTypes.string,
    loading: PropTypes.bool
  }

  renderPackage({ id, path, outdatedDeps = {}, outdatedDevDeps = {} }) {
    const { selected, loading, onPackageClick, onPackageRemove } = this.props;

    const isSelected = (path === selected);
    const isOutdated = !!(Object.keys(outdatedDeps).length);
    const isDevOutdated = !!(Object.keys(outdatedDevDeps).length);
    const [, packageName ] = path.split('/').reverse();

    return (
      <tr
        key={ id }
        className={ cx('app--package', isSelected && 'active') }>
        <td>
          <span
            className='label label-default'
            style={ { fontWeight: isSelected ? 'bold' : 'normal' } }
            onClick={ () => onPackageClick(path) }>
            { packageName }
          </span>
          { isSelected && loading && <small> ( loading... )</small> }
        </td>
        <td>
          <span
            className={ cx('label label-success', isOutdated && 'label-warning') }>
            dependencies ({ Object.keys(outdatedDeps).length })
          </span>
          <span
            className={ cx('label label-success', isDevOutdated && 'label-warning')}>
            devDependencies ({ Object.keys(outdatedDevDeps).length })
          </span>
        </td>
        <td className='text-right'>
          <span
            className='label label-danger'
            onClick={ () => onPackageRemove(path) }>
            Remove
          </span>
        </td>
      </tr>
    );
  }

  render() {
    const { packages } = this.props;

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
            { packages.map(::this.renderPackage) }
          </tbody>
        </table>
      </div>
    );
  }

}

export default Packages;
