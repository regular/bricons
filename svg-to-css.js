const dataUri = require('./data-uri')
const {parse} = require('path')

module.exports = function(path, svg) {
  const uri = dataUri(svg)
  const css = `:root { --${parse(path).name}: url("${uri}"); }`
  return css
}
