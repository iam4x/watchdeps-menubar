import React from 'react';
import Toggle from 'react-toggle';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { update } from 'redux/actions/PreferencesActions';

function Header({ dispatch, withLatest }) {
  function handleCheckboxChange({ target: { checked } }) {
    dispatch(update({ withLatest: checked }));
  }

  return (
    <header className='app--header'>
      <div className='container-fluid clearfix'>
        <div className='pull-left'>WatchDeps</div>
        <div className='pull-right'>
          <div className='clearfix'>
            <div
              className='pull-left'
              style={ { paddingTop: 1, marginRight: 10 } }>
              <Toggle
                defaultChecked={ withLatest }
                onChange={ handleCheckboxChange } />
            </div>
            <Link
              to='/create'
              className='btn btn-sm btn-secondary'>
              <i className='fa fa-plus' /> add project
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default connect(({ preferences }) => ({ preferences }))(Header);
