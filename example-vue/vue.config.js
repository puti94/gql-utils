/**
 * User: puti.
 * Time: 2020-03-02 17:28.
 */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
        .set('@', resolve('src'))
        .set('lib', resolve('../dist'))
    config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.transpileOptions = {
            transforms: {
              dangerousTaggedTemplateString: true,
            },
          }
          return options
        })
  },

  productionSourceMap: false
};
