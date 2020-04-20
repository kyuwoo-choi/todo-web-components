const path = require('path');
const webpack= require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ['./src/index.js'],
  output: {
    library: "TodoApp",
    libraryTarget: "umd",
    filename: "TodoApp.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        exclude: /node_modules\/(?!(lit-element|lit-html)\/).*/,
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
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
      minify: false,
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {}
};
