const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'client');
const BUILD_DIR = path.resolve(__dirname, 'public')
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

const NODE_ENV = process.env.NODE_ENV;

const config = {
  entry: `${APP_DIR}/main.js`,
  output: {
    path: BUILD_DIR,
    filename: 'assets/js/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [APP_DIR, 'node_modules'],
    alias: {
      // https://github.com/webpack/webpack/issues/4666
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        include: APP_DIR,
      },
      // https://github.com/photonstorm/phaser/issues/2762
      {
        test: /pixi\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'PIXI',
        }],
      },
      {
        test: /phaser-split\.js$/,
        use: [{
          loader: 'expose-loader',
          options: 'Phaser',
        }],
      },
      {
        test: /p2\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'p2',
        }],
      },
    ],
  },
  "externals": {
    "Phaser": "Phaser",
  }
};

module.exports = config;
