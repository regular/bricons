const {join} = require('path')

module.exports = function(name) {
  const [iconset, iconname] = name.split('/')
  return join(
    __dirname,
    'node_modules',
    'ionicons',
    'dist',
    'svg',
    `${iconname}.svg`
  )
}
