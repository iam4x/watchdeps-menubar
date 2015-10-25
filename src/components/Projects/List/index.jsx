import isEmpty from 'lodash/lang/isEmpty';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { countOutdated } from 'utils/projects';

import Project from './Project';

@connect(({ projects: { projects }, preferences }) => ({ projects, preferences }))
class List extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
    preferences: PropTypes.object.isRequired
  }

  state = { active: null }

  handleSelect(index) {
    this.setState({ active: index });
  }

  render() {
    const { active } = this.state;
    const { projects, preferences: { withLatest } } = this.props;
    const dependenciesType = withLatest ? 'latest' : 'stable';

    if (isEmpty(projects)) {
      return (
        <div className='app--projects empty'>
          <Link
            to='/create'
            className='alert alert-info text-center'>
            <div className='inside-button'>
              <i className='fa fa-plus' /> Start by adding a project
            </div>
          </Link>
        </div>
      );
    }

    return (
      <div className='app--projects'>
        { projects
          .sort((curr, next) =>
            countOutdated(curr.packageManagers, dependenciesType) <
            countOutdated(next.packageManagers, dependenciesType) )
          .map((project, index) =>
            <Project
              key={ index }
              project={ project }
              dependenciesType={ dependenciesType }
              isActive={ index === active }
              onSelect={ () => this.handleSelect(index) } />) }
      </div>
    );
  }

}

export default List;
