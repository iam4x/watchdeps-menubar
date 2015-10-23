import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';

import DevTools from './devTools';
import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';

const { NODE_ENV, BROWSER } = process.env;
const reducer = combineReducers(reducers);

export default function(data) {
  const middleware = createMiddleware();

  let finalCreateStore;
  if (__DEV__) {
    finalCreateStore = compose(
      applyMiddleware(middleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    finalCreateStore = applyMiddleware(middleware)(createStore);
  }

  const store = finalCreateStore(reducer, data);

  if (BROWSER && NODE_ENV === 'developement' && module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers')));
  }

  return store;
}
