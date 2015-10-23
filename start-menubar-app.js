import path from 'path';
import createMenubar from 'menubar';

const isDev = (process.env.NODE_ENV === 'development');

const dir = path.resolve(__dirname, './src');
const html = isDev ? 'index-dev.html' : 'index.html';
const index = `file://${dir}/${html}`;

const menubar = createMenubar({ dir, index, 'always-on-top': isDev });
menubar.on('ready', () => console.log('ready')); /* eslint no-console:0 */
