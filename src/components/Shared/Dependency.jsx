import React, { Component, PropTypes } from 'react';

class Dependency extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired
  }

  render() {
    const { name, data } = this.props;
    const { required, stable, latest, warn } = data;

    if (warn) {
      return (
        <tr>
          <td>{ name }</td>
          <td colSpan='3'>
            <span className='label label-danger'>
              Cant check for update
            </span>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td>{ name }</td>
        <td className='text-left'>
          <div className='label label-default'>
            { required }
          </div>
        </td>
        <td className='text-left'>
          <span className='label label-success'>
            { stable }
          </span>
        </td>
        <td className='text-left'>
          <span className='label label-warning'>
            { latest }
          </span>
        </td>
      </tr>
    );
  }

}

export default Dependency;
