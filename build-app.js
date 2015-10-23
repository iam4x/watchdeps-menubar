/* from: https://github.com/chentsulin/electron-react-boilerplate/blob/master/package.js */
/* eslint no-shadow: 0, func-names: 0, no-unused-vars: 0, no-console: 0 */

import os from 'os';
import del from 'del';
import packager from 'electron-packager';
import webpack from 'webpack';
import { exec } from 'child_process';

import config from './webpack/build.config';

const argv = require('minimist')(process.argv.slice(2));
const devDeps = Object.keys(require('./package.json').devDependencies);

const appName = argv.name || argv.n || 'WatchDeps';
const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '/webpack($|/)',
    '/release($|/)'
  ].concat(devDeps.map(function(name) { return '/node_modules/' + name + '($|/)'; }))
};

// const icon = argv.icon || argv.i || 'app/app.icns';
// if (icon) DEFAULT_OPTS.icon = icon;

const version = argv.version || argv.v;

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  const opts = {
    ...DEFAULT_OPTS,
    platform: plat,
    arch: arch,
    out: 'release/' + plat + '-' + arch
  };

  packager(opts, cb);
}

function log(plat, arch) {
  return function(err, filepath) {
    if (err) return console.error(err);
    console.log(plat + '-' + arch + ' finished!');
  };
}

function startPack() {
  console.log('start pack...');
  webpack(config, function runWebpackBuild(err, stats) {
    if (err) return console.error(err);
    del('release')
    .then(function(paths) {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach(function(plat) {
          archs.forEach(function(arch) {
            pack(plat, arch, log(plat, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(function(err) {
      console.error(err);
    });
  });
}

if (version) {
  DEFAULT_OPTS.version = version;
  startPack();
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list | grep electron-prebuilt', function(err, stdout, stderr) {
    if (err) {
      DEFAULT_OPTS.version = '0.34.0';
    } else {
      DEFAULT_OPTS.version = stdout.split('@')[1].replace(/\s/g, '');
    }
    startPack();
  });
}
