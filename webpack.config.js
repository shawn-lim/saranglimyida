var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // automatically create and include javascript file

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        secure: false
      },
      '/public/videos': {
        target: 'http://localhost:8000',
        secure: false
      },
      '/public/profiles': {
        target: 'http://localhost:8000',
        secure: false
      }
    }
  },
  module: {
    rules: [
      {test: /\.scss$/, loaders: ['style', 'css', 'sass']},
      {test: /\.(js)$/, use: 'babel-loader' },
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
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
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'public', to: 'public' }
    ]),
    //new webpack.ProvidePlugin({
    //$: "jquery",
    //jQuery: "jquery",
    //Tether: 'tether'
    //})
  ]
}
