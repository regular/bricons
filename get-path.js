const {join, dirname} = require('path')

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
    dirname(require.resolve('ionicons')),
    'svg',
    `${iconname}.svg`
  )
}
