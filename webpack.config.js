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
        // exclude: /node_modules/,
        exclude: /node_modules\/(?!(@webcomponents\/shadycss|lit-element|lit-html)\/).*/,
        loader: "babel-loader",
        options: {
          plugins: ["@babel/plugin-transform-runtime"],
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: 3,
                targets: ["last 2 versions", "android >= 4.2"],
              },
            ],
          ],
        },
      },
    ]
  },
  // plugins: [new webpack.optimize.UglifyJsPlugin()],
  devtool: 'inline-source-map',
  devServer: {
    publicPath: PUBLIC_PATH
  }
};
