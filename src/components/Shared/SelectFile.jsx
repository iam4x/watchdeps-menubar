import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import remote from 'remote';

const dialog = remote.require('dialog');

class SelectFile extends Component {

  static propTypes = {
    onSelectedFile: PropTypes.func.isRequired,
    properties: PropTypes.array,
    filters: PropTypes.array,
    className: PropTypes.string,
    label: PropTypes.string
  }

  static defaultProps = {
    label: 'add a package',
    properties: [ 'openFile' ],
    filters: [ { name: 'NPM Package', extensions: [ 'json' ] } ]
  }

  handleClick() {
    const { filters, properties } = this.props;
    dialog.showOpenDialog({ filters, properties }, ::this.handleCloseDialog);
  }

  handleCloseDialog(files) {
    if (files) {
      const { onSelectedFile } = this.props;
      return onSelectedFile(files[0]);
    }
  }

  render() {
    const { className, label } = this.props;
    return (
      <span
        className={ cx('label btn btn-primary', className) }
        onClick={ ::this.handleClick }>
        <i
          className='fa fa-plus-square'
          style={ { marginRight: 10 } } />
        { label }
      </span>
    );
  }

}

export default SelectFile;
