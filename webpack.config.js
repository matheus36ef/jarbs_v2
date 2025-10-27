const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  // Main process configuration
  {
    mode: 'development',
    entry: './src/main/main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  // Renderer process configuration
  {
    mode: 'development',
    entry: './src/renderer/index.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ],
        },
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'renderer.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  }
];
