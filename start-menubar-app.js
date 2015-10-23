import path from 'path';
import createMenubar from 'menubar';

const { NODE_ENV = 'developement' } = process.env;

const dir = path.resolve(__dirname, './src');
const html = NODE_ENV === 'development' ? 'index-dev.html' : 'index.html';
const index = `file://${dir}/${html}`;

const menubar = createMenubar({ dir, index });
menubar.on('ready', () => console.log('ready')); /* eslint no-console:0 */
