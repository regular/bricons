const {optimize} = require('svgo')
const minisvg = require('mini-svg-data-uri')

module.exports = function(svg) {
  const optimized = optimize(svg)
  const uri = minisvg(optimized.data)
  return uri
}
