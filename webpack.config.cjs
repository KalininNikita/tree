const path = require('path')
const webpack = require('webpack');
require('dotenv').config()

module.exports = {
  entry: "./src/index.tsx",
  mode: process.env.MODE,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "./webpack-bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      process: { env: {} }
    })
  ],
  devServer: {
    static: ['img', path.join(__dirname, "public")],
    compress: true,
    port: 3050,
    client: {
      overlay: true
    }
  },
  module: {
    rules: [
      {
        test: /\.m?(js|ts)$/,
        exclude: /(node_modules|bower_components|lib|tscrl.js)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ]
  },
  experiments: {
    topLevelAwait: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: { 
    }
  }
}
