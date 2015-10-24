import React from 'react';
import cx from 'classnames';
import remote from 'remote';

const dialog = remote.require('dialog');

export default function SelectFile({ className, onSelectedFile, ...props }) {
  const { label = 'add a package' } = props;
  const { properties = [ 'openFile' ] } = props;
  const { filters = [ { name: 'NPM Package', extensions: [ 'json' ] } ] } = props;

  function handleCloseDialog(files) {
    if (files) return onSelectedFile(files[0]);
  }

  function handleClick() {
    dialog.showOpenDialog({ filters, properties }, handleCloseDialog);
  }

  return (
    <span
      className={ cx('label btn btn-primary', className) }
      onClick={ handleClick }>
      <i
        className='fa fa-plus-square'
        style={ { marginRight: 10 } } />
      { label }
    </span>
  );
}

export default SelectFile;
