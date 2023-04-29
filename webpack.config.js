const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWabpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

console.log('isDev:', isDev);

const optimization = () => {
  const config = {runtimeChunk: 'single'}
    if (!isDev) {
      config.minimizer = [
        new CssMinimizerWabpackPlugin(),
        new TerserWebpackPlugin()
      ]
    }
  
  return config;
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  devtool:'inline-source-map',

  entry: {
    main: path.join(__dirname,'src','index.ts')
  },

  devtool: 'inline-source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: !isDev,
      }
    }),
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CssMinimizerWabpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource', 
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  target: 'web',

  optimization: optimization(),

  devServer: {
    static: './dist',
    port:3000,
    open:true,
    compress:true,
    hot:false,
    liveReload:true,
    
  },
};