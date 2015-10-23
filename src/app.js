import debug from 'debug';

import { createElement } from 'react';
import { render } from 'react-dom';

import Router from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import routes from 'routes';

if (__DEV__ === 'development') debug.enable('dev');

const history = createHashHistory();
const element = createElement(Router, { history, routes });
const container = document.getElementById('menubar-react-root');

render(element, container);
