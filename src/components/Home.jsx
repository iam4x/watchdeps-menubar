import __ from 'lodash-fp';

import React from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import Packages from 'components/Shared/Packages';
import Dependencies from 'components/Shared/Dependencies';

import * as PackagesActions from 'redux/actions/PackagesActions';
import { update as prefUpdate } from 'redux/actions/PreferencesActions';

function Home({ dispatch, packages, preferences }) {
  const { collection = [], selected } = packages;
  const { withLatest } = preferences;

  const { outdatedDeps = {}, outdatedDevDeps = {} } = __.flow(
    __.reduce((result, pkg) => (pkg.path === selected) ? pkg : result, {}),
    __.pick([ 'outdatedDeps', 'outdatedDevDeps' ]),
    __.mapValues(__.mapValues(__.omit( !withLatest && 'latest')))
  )(collection);

  const handlePackageRefresh = (path) =>
    dispatch(PackagesActions.refresh({ path, withLatest }));

  const handlePackageRemove = (path) =>
    dispatch(PackagesActions.remove({ path }));

  const handlePackageUpdate = (opts) =>
    dispatch(PackagesActions.update({ ...opts, withLatest }));

  const handleCheckboxChange = ({ target: { checked } }) => {
    dispatch(prefUpdate({ withLatest: checked }));

    // FIXME:
    // Add refresh all method, this is slow and aks for multiple re-render
    collection.map(({ path }) =>
       dispatch(PackagesActions.refresh({ path, withLatest: checked })));
  };

  return (
    <div className='card main--block'>
      <div className='card-header'>
        <div className='clearfix'>
          <div
            className='pull-left'
            style={ { marginRight: 10 } }>
            <Toggle
              defaultChecked={ withLatest }
              onChange={ handleCheckboxChange } />
          </div>
          <strong className='pull-left'>
            watch upcoming dependencies versions
          </strong>
        </div>
      </div>
      { collection.length ?
        <div>
          <Packages
            { ...packages }
            onPackageRefresh={ handlePackageRefresh }
            onPackageRemove={ handlePackageRemove }
            onPackageUpdate={ handlePackageUpdate } />
          <Dependencies
            label='Outdated dependencies'
            dependencies={ outdatedDeps }
            withLatest={ withLatest } />
          <Dependencies
            label='Outdated devDependencies'
            dependencies={ outdatedDevDeps }
            withLatest={ withLatest } /> :
        </div> :
        <div className='card-block'>
          <strong>Start by selecting a `package.json`</strong>
        </div> }
    </div>
  );
}

const reducer = ({ preferences, packages }) => ({ preferences, packages });
export default connect(reducer)(Home);
