'use strict'
const path = require('path')

function resolve(dir) {
  console.log('配置', dir)
  return path.join(__dirname, dir)
}

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.alias['@'] = resolve('src')
  config.resolve.alias['lib'] = resolve('../dist')
  config.resolve.plugins = [config.resolve.plugins[0]]
  return config
}
