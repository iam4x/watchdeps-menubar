import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import remote from 'remote';

const dialog = remote.require('dialog');

class SelectFile extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
    onSelected: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  state = { isOpen: false }

  handleCloseDialog(files) {
    const { onSelected } = this.props;
    if (files) onSelected(files[0]);

    return this.setState({ isOpen: false });
  }

  handleClick() {
    const { properties } = this.props;
    dialog.showOpenDialog({ properties }, ::this.handleCloseDialog);
  }

  render() {
    const { label, className } = this.props;

    return (
      <span
        className={ cx('btn btn-sm btn-secondary', className) }
        onClick={ ::this.handleClick }>
        <i
          className='fa fa-folder'
          style={ { marginRight: 10 } } />
        { label }
      </span>
    );
  }

}

export default SelectFile;
