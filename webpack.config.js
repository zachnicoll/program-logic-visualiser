const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin-advanced');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['./index.js', './styles/app.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    publicPath: '',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ["@babel/preset-env"] },
        }],
      },
      {
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.bundle.css',
    }),
    new CopyWebpackPlugin([
      {
        from: './assets/**/**',
        flatten: true,
      },
      {
        from: 'index.html'
      },
    ]),
  ],
};