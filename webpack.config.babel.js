import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
];

const filename = `redux-sharedworker${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  mode: NODE_ENV === 'production' ? 'production' : 'development',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  

  entry: [
    './src/index',
  ],

  optimization: {
    minimize: NODE_ENV === 'production',
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxSharedWorker',
    libraryTarget: 'umd',
  },

  plugins,
};
