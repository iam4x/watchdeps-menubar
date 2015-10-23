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

  handleSelectedFile(file) {
    const { dispatch } = this.props;
    dispatch(addPackage(file));
    dispatch(checkOutdated(file));
  }

  render() {
    const { dispatch } = this.props;
    const { packages: { collection = [], selected, loading } } = this.props;

    const { outdatedDeps = {}, outdatedDevDeps = {} } = collection
      .find(({ path }) => path === selected) || {};

    return (
      <div className='card main--block'>
        <div className='card-header'>
          <SelectFile onSelectedFile={ ::this.handleSelectedFile } />
        </div>
        { collection.length ?
          <div>
            <div className='card-block'>
              <Packages
                packages={ collection }
                selected={ selected }
                onPackageClick={ (pkg) => dispatch(checkOutdated(pkg)) }
                onPackageRemove={ (pkg) => dispatch(removePackage(pkg)) } />
            </div>
            <div className='card-block'>
              <div>
                <strong>Outdated dependencies</strong>
                { loading && <small> ( updating... )</small> }
              </div>
              <Dependencies dependencies={ outdatedDeps } />
            </div>
            <div className='card-block'>
              <div>
                <strong>Outdated devDependencies</strong>
                { loading && <small> ( updating...)</small> }
              </div>
              <Dependencies dependencies={ outdatedDevDeps } />
            </div>
          </div> :
          <div className='card-block'>
            <strong>Start by selecting a `package.json`</strong>
          </div>
        }
      </div>
    );
  }

}

export default Home;
