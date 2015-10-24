import React from 'react';
import { connect } from 'react-redux';

import Packages from 'components/Shared/Packages';
import Dependencies from 'components/Shared/Dependencies';

import * as pa from 'redux/actions/PackagesActions';

function Home({ dispatch, packages }) {
  const { collection = [], selected } = packages;

  const { outdatedDeps = {}, outdatedDevDeps = {} } = collection
    .find(({ path }) => path === selected) || {};

  return (
    <div className='card main--block'>
      { collection.length ?
        <div>
          <Packages
            { ...packages }
            onPackageRefresh={ (pkg) => dispatch(pa.checkOutdated(pkg)) }
            onPackageRemove={ (pkg) => dispatch(pa.removePackage(pkg)) }
            onPackageUpdate={ (opts) => dispatch(pa.update(opts)) } />
          <Dependencies
            label='Outdated dependencies'
            dependencies={ outdatedDeps } />
          <Dependencies
            label='Outdated devDependencies'
            dependencies={ outdatedDevDeps } />
        </div> :
        <div className='card-block'>
          <strong>Start by selecting a `package.json`</strong>
        </div> }
    </div>
  );
}

export default connect(({ packages }) => ({ packages }))(Home);
