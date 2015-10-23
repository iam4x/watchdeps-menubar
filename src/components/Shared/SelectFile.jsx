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
    label: 'Select a `package.json`',
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
        className={ cx('btn btn-sm btn-primary', className) }
        onClick={ ::this.handleClick }>
        { label }
      </span>
    );
  }

}

export default SelectFile;
