/* eslint no-console:0 */
const path = require('path');
const createMenubar = require('menubar');

require('electron-debug')();
require('crash-reporter').start();

const isDev = (process.env.NODE_ENV === 'development');

const dir = path.resolve(__dirname, './src');
const html = isDev ? 'index-dev.html' : 'index.html';
const index = 'file://' + dir + '/' + html;

const defaultOpts = { dir, index, width: 800, height: 400 };
const opts = Object.assign({}, defaultOpts, { 'always-on-top': isDev });
const menubar = createMenubar(opts);

menubar.on('ready', function() {
  if (isDev) console.log('ready');
});
