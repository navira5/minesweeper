const Uglify = require('uglifyjs-webpack-plugin');
const withTypescript = require('@zeit/next-typescript');

module.exports = withTypescript({
  // webpack(config, options) {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.plugins = config.plugins.filter(
  //       plugin => plugin.constructor.name !== 'UglifyJsPlugin'
  //     );
  //     config.plugins.push(new Uglify());
  //   }
  //   return config;
  // }  
});
