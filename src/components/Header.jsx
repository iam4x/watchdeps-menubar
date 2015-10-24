import React from 'react';
import { connect } from 'react-redux';

import SelectFile from 'components/Shared/SelectFile';
import { addPackage, checkOutdated } from 'redux/actions/PackagesActions';

function Header({ dispatch }) {
  return (
    <header className='app--header'>
      <div className='container-fluid clearfix'>
        <div className='pull-left'>WatchDeps</div>
        <div className='pull-right'>
          <SelectFile
            onSelectedFile={ (file) => {
              dispatch(addPackage(file));
              dispatch(checkOutdated(file));
            } } />
        </div>
      </div>
    </header>
  );
}

export default connect()(Header);
