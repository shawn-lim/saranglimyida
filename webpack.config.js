var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // automatically create and include javascript file

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  devServer: {
    historyApiFallback: true,
    // Proxy Settings used for development. Redirect all local requests to a given API server.
    //proxy: {
      //'/api': {
        //target: 'http://localhost:8000',
        //secure: false
      //},
    //}
  },
  module: {
    rules: [
      {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties', 'transform-object-rest-spread']
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      favicon: 'public/images/favicon.ico'
    }),
    new CopyWebpackPlugin([
      { from: 'public', to: 'public' }
    ]),
  ]
}
