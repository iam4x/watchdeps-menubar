import at from 'redux/constants/ActionTypes';

const initialState = { projects: [] };

export default function projects(state = initialState, action) {
  const { type, result } = action;

  switch (type) {
  case at.PROJECT_CREATE:
    return { ...state, projects: [ ...state.projects, result.project ] };

  case at.PROJECT_REMOVE:
    return { ...state, projects: state.projects
      .filter(({ id }) => id !== result.project.id) };

  case at.PROJECT_REFRESH:
  case at.PROJECT_REFRESH_SUCCESS:
  case at.PROJECT_UPDATE:
  case at.PROJECT_UPDATE_SUCCESS:
    return { ...state, projects: state.projects.map(project =>
      project.id === result.project.id ? result.project : project) };

  case at.PROJECT_REFRESH_FAIL:
  case at.PROJECT_UPDATE_FAIL:
    return { ...state, projects: state.projects.map(project =>
      project.id === result.project.id ?
        { ...project, refreshing: false, updating: false } : project ) };

  default:
    return { ...state };
  }
}
