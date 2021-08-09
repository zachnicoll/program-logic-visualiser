const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin-advanced');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['./index.ts', './styles/app.scss'],
  devtool: 'inline-source-map',
  resolve: { extensions: ['.ts', '.js'] },
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
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
        from: 'index.html',
      },
    ]),
  ],
};
