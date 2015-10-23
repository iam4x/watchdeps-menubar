import path from 'path';
import debug from 'debug';
import { spawn } from 'child_process';

function handleStd(data) {
  const sanatized = data.toString().replace('\n', '');
  debug('dev')('`electron` ' + sanatized);
}

let electron;
function startElectron() {
  const electronBinary = path.join(__dirname, '../../node_modules/.bin/electron');
  const srcPath = path.join(__dirname, '../../index.js');
  electron = spawn(electronBinary, [ srcPath ], { env: { ...process.env } });
  electron.stdout.on('data', handleStd);
  electron.stderr.on('data', handleStd);
}

process.on('exit', () => electron.kill('SIGTERM'));
export default () => electron ? (() => {})() : startElectron();
