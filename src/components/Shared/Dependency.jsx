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
      return (<li>{ name } <small>Cant check for update</small></li>);
    }

    return (<li>{ name + ' - ' + required + ' - ' + stable + ' - ' + latest }</li>);
  }

}

export default Dependency;
