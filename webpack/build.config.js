import path from 'path';
import webpack from 'webpack';
import webpackTargetElectronRenderer from 'webpack-target-electron-renderer';

const JS_REGEX = /\.js|\.jsx/;
const FILE_REGEX = /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/;

const config = {
  devtool: 'source-map',
  entry: { app: './src/app.js' },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    publicPath: '/dist/'
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
    new webpack.DefinePlugin({
      '__DEV__': false,
      'process.env': JSON.stringify('production')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
  }
};

config.target = webpackTargetElectronRenderer(config);

export default config;
