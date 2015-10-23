import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import persistLocal from 'redux-localstorage';

import DevTools from './devTools';
import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';

const reducer = combineReducers(reducers);

export default function(data) {
  const middleware = createMiddleware();

  let finalCreateStore;
  if (__DEV__) {
    finalCreateStore = compose(
      applyMiddleware(middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      persistLocal(null, { key: 'user-preferences' })
    )(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(middleware),
      persistLocal(null, { key: 'user-preferences' })
    )(createStore);
  }

  const store = finalCreateStore(reducer, data);

  if (__DEV__ && module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers')));
  }

  return store;
}
