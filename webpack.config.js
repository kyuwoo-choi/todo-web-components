const path = require('path');
const webpack = require('webpack');

const DIST_DIR_NAME = 'dist';
const DIST_PATH = path.join(__dirname, DIST_DIR_NAME);
const DIST_FILE = `TodoApp.js`;
const PUBLIC_PATH = `http://localhost:8080/${DIST_DIR_NAME}/`;

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: DIST_PATH,
    filename: DIST_FILE
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: ['last 1 versions']
                  },
                  useBuiltIns: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  // plugins: [new webpack.optimize.UglifyJsPlugin()],
  devtool: 'inline-source-map',
  devServer: {
    publicPath: PUBLIC_PATH
  }
};
