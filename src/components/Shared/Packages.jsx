import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

class Packages extends Component {

  static propTypes = {
    onPackageRemove: PropTypes.func.isRequired,
    onPackageClick: PropTypes.func.isRequired,
    packages: PropTypes.array.isRequired,
    selected: PropTypes.bool
  }

  renderPackage(packagePath, index) {
    const { selected, onPackageClick, onPackageRemove } = this.props;
    const isSelected = (packagePath === selected);

    return (
      <div
        key={ index }
        style={ { opacity: isSelected ? 1 : 0.5 } }>
        <span
          className={ cx('label label-default', isSelected && 'label-success') }
          onClick={ () => onPackageClick(packagePath) }>
          { packagePath }
        </span>
        <span
          className='label label-danger'
          style={ { marginLeft: 10 } }
          onClick={ () => onPackageRemove(packagePath) }>
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
