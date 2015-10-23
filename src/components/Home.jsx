import React, { Component, PropTypes } from 'react';
import remote from 'remote';
import { connect } from 'react-redux';

import Dependencies from 'components/Shared/Dependencies';
import { addPackage, checkOutdated } from 'redux/actions/PackagesActions';

const dialog = remote.require('dialog');

@connect(({ packages }) => ({ packages }))
class Home extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    packages: PropTypes.object.isRequired
  }

  handleClick(event) {
    event.preventDefault();
    dialog.showOpenDialog(
      { properties: [ 'openFile' ],
        filters: [ { name: 'NPM Package', extensions: [ 'json' ] } ] },
      (files = []) => this.handleSelect(files)
    );
  }

  handleSelect([ packagePath ]) {
    if (packagePath) {
      const { dispatch } = this.props;
      return dispatch(addPackage(packagePath));
    }
  }

  render() {
    const { dispatch } = this.props;
    const { packages: { collection = [], loading } } = this.props;
    const { packages: { outdatedDeps = {}, outdatedDevDeps = {} } } = this.props;

    return (
      <div className='card'>
        <div className='card-header'>
          <span
            className='btn btn-sm btn-primary'
            onClick={ ::this.handleClick }>
            add a new `package.json`
          </span>
        </div>
        <div className='card-block'>
          <strong>Your packages</strong>
          { ' ' }
          <small>(Click one to check for updates)</small>
          <ul>
            { collection.map((packagePath, index) =>
              <li
                key={ index }
                onClick={ () => dispatch(checkOutdated(packagePath)) }>
                { packagePath }
              </li>) }
          </ul>
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
