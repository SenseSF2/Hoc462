const path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-decorators-legacy', 'transform-object-rest-spread', 'transform-class-properties']
          }
        }
      }
    ]
  },
  devtool: 'source-map'
}
