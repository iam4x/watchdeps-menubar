import React from 'react';
import { connect } from 'react-redux';

import SelectFile from 'components/Shared/SelectFile';
import { add, refresh } from 'redux/actions/PackagesActions';

function Header({ dispatch, preferences: { withLatest } }) {
  function handleSelected(path) {
    dispatch(add({ path }));
    dispatch(refresh({ path, withLatest }));
  }

  return (
    <header className='app--header'>
      <div className='container-fluid clearfix'>
        <div className='pull-left'>WatchDeps</div>
        <div className='pull-right'>
          <SelectFile onSelectedFile={ handleSelected } />
        </div>
      </div>
    </header>
  );
}

const reducer = ({ preferences }) => ({ preferences });
export default connect(reducer)(Header);
