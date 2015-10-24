import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SelectFile from 'components/Shared/SelectFile';
import { addPackage, checkOutdated } from 'redux/actions/PackagesActions';

@connect()
class Header extends Component {

  static propTypes = { dispatch: PropTypes.func.isRequired }

  handleSelectedFile(file) {
    const { dispatch } = this.props;
    dispatch(addPackage(file));
    dispatch(checkOutdated(file));
  }

  render() {
    return (
      <header className='app--header'>
        <div className='container-fluid clearfix'>
          <div className='pull-left'>
            WatchDeps
          </div>
          <div className='pull-right'>
            <SelectFile onSelectedFile={ ::this.handleSelectedFile } />
          </div>
        </div>
      </header>
    );
  }

}

export default Header;
