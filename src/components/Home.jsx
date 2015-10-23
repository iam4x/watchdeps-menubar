import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Packages from 'components/Shared/Packages';
import Dependencies from 'components/Shared/Dependencies';
import SelectFile from 'components/Shared/SelectFile';

import { addPackage, checkOutdated, removePackage } from 'redux/actions/PackagesActions';

@connect(({ packages }) => ({ packages }))
class Home extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    packages: PropTypes.object.isRequired
  }

  render() {
    const { dispatch } = this.props;
    const { packages: { collection = [], loading, selected } } = this.props;
    const { packages: { outdatedDeps = {}, outdatedDevDeps = {} } } = this.props;

    return (
      <div className='card main--block'>
        <div className='card-header'>
          <SelectFile onSelectedFile={ (file) => dispatch(addPackage(file)) } />
        </div>
        <div className='card-block'>
          <Packages
            packages={ collection }
            selected={ selected }
            onPackageClick={ (pkg) => dispatch(checkOutdated(pkg)) }
            onPackageRemove={ (pkg) => dispatch(removePackage(pkg)) } />
        </div>
        <div className='card-block'>
          <strong>Outdated dependencies</strong>
          { loading ?
            <div>loading...</div> :
            <Dependencies dependencies={ outdatedDeps } /> }
        </div>
        <div className='card-block'>
          <strong>Outdated devDependencies</strong>
            { loading ?
              <div>loading...</div> :
              <Dependencies dependencies={ outdatedDevDeps } /> }
        </div>
      </div>
    );
  }

}

export default Home;
