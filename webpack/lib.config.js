import path from 'path';
import webpack from 'webpack';
import baseConfig from './base.config';

const config = {
  input: path.join(__dirname, '../src/app/index'),
  output: {
    library: 'RemoteDevApp',
    libraryTarget: 'umd',
    path: path.join(__dirname, '../dist'),
    filename: 'remotedev-app.js'
  },
  plugins: [  
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  globals: {
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  config.output.filename = 'remotedev-app.min.js';
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

export default baseConfig(config);
