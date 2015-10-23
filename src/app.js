import debug from 'debug';

import React from 'react';
import { render } from 'react-dom';

import Router from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { Provider } from 'react-redux';

import createStore from './redux/create';
import routes from './routes';

const store = createStore();
const history = createHashHistory();

const container = document.getElementById('menubar-react-root');

let element;
if (__DEV__) {
  debug.enable('dev');
  const DevTools = require('./redux/devTools');
  element = (
    <div>
      <Provider store={ store }>
        <Router history={ history } routes={ routes } />
      </Provider>
      <Provider store={ store }>
        <DevTools key='dev-tools' />
      </Provider>
    </div>
  );
} else {
  element = (
    <Provider store={ store }>
      <Router history={ history } routes={ routes } />
    </Provider>
  );
}

render(element, container);
