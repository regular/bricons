const {join, dirname, resolve} = require('path')

module.exports = function(name) {
  const [iconset, iconname] = name.split('/')
  if (iconset == 'samherbert') {
    return join(
      __dirname,
      'samherbert',
      `${iconname}.svg`
    )
  }
  if (iconset == 'ionicons') {
    return join(
      dirname(require.resolve('ionicons')),
      'svg',
      `${iconname}.svg`
    )
  }
  return resolve(name)
}
