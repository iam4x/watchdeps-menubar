import path from 'path';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

import startElectron from './utils/start-electron';

const JS_REGEX = /\.js|\.jsx/;
const FILE_REGEX = /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/;

const { PORT = 3000 } = process.env;

const config = {
  server: {
    port: PORT,
    options: {
      publicPath: `http://localhost:${PORT}/dist/`,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  },
  webpack: {
    devtool: 'cheap-modules-sourcemap',
    entry: {
      app: [
        `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
        './src/app.js'
      ]
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'app.js',
      libraryTarget: 'commonjs2',
      publicPath: `http://localhost:${PORT}/dist/`
    },
    module: {
      preLoaders: [
        { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
      ],
      loaders: [
        { test: JS_REGEX, exclude: /node_modules/, loader: 'babel' },
        { test: FILE_REGEX, loader: 'url' },
        { test: /\.css$/, loader: 'style!css!postcss' }
      ]
    },
    postcss: [
      require('postcss-import')(),
      require('postcss-url')(),
      require('precss')()
    ],
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': JSON.stringify('development')
      }),
      new webpack.optimize.DedupePlugin(),
      function() { this.plugin('done', startElectron); }
    ],
    resolve: {
      extensions: ['', '.js', '.json', '.jsx'],
      modulesDirectories: ['node_modules', 'src']
    }
  }
};

config.webpack.target = webpackTargetElectronRenderer(config.webpack);

export default config;
