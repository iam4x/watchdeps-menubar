import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class Packages extends Component {

  static propTypes = {
    onPackageRemove: PropTypes.func.isRequired,
    onPackageClick: PropTypes.func.isRequired,
    packages: PropTypes.array.isRequired,
    selected: PropTypes.string
  }

  renderPackage({ id, path, outdatedDeps = {}, outdatedDevDeps = {} }) {
    const { selected, onPackageClick, onPackageRemove } = this.props;

    const isSelected = (path === selected);
    const isOutdated = !!(Object.keys(outdatedDeps).length);
    const isDevOutdated = !!(Object.keys(outdatedDevDeps).length);

    return (
      <div
        key={ id }
        className='app--package'
        style={ { opacity: isSelected ? 1 : 0.5 } }>
        <span
          className='label label-primary'
          onClick={ () => onPackageClick(path) }>
          { path }
        </span>
        <span
          className={ cx('label label-success', isOutdated && 'label-warning') }>
          dependencies ({ Object.keys(outdatedDeps).length })
        </span>
        <span
          className={ cx('label label-success', isDevOutdated && 'label-warning')}>
          devDependencies ({ Object.keys(outdatedDevDeps).length })
        </span>
        <span
          className='label label-danger'
          onClick={ () => onPackageRemove(path) }>
          Remove
        </span>
      </div>
    );
  }

  render() {
    const { packages } = this.props;
    return (<div>{ packages.map(::this.renderPackage) }</div>);
  }

}

export default Packages;
