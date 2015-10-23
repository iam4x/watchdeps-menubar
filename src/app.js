import debug from 'debug';
import { createElement } from 'react';
import { render } from 'react-dom';

import Layout from './layout';

if (process.env.NODE_ENV === 'development') debug.enable('dev');
render(createElement(Layout), document.getElementById('menubar-react-root'));
