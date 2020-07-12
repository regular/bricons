const {join} = require('path')

module.exports = function(name) {
  const [iconset, iconname] = name.split('/')
  if (iconset == 'samherbert') {
    return join(
      __dirname,
      'samherbert',
      `${iconname}.svg`
    )
  }
  return join(
    __dirname,
    'node_modules',
    'ionicons',
    'dist',
    'svg',
    `${iconname}.svg`
  )
}
