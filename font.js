const fs = require('fs');
const getPath = require('./get-path')
const bl = require('bl')
const Icons2Font = require('svgicons2svgfont')
const once = require('once')

/*
font({
  fontName: 'myfont',
  fontHeight: 1000,
  glyphs: {
    'h': 'ionicons/heart-circle'
  }
}, (err, data) => {
  if (err) return console.error(err.message)
  console.log(data)
})
*/

module.exports = font

function font(opts, cb) {
  cb = once(cb)
  const {glyphs} = opts
  opts = Object.assign({fontHeight: 1000}, opts)
  delete opts.glyphs
  const fontStream = new Icons2Font(opts)
  const outbuf = bl()
  fontStream.pipe(outbuf)
    .on('error', err => {
      cb(err) 
    })
    .on('finish', ()=>{
      cb(null, outbuf.toString())
    })
  Object.entries(glyphs).forEach( ([unicode, name]) =>{
    const filepath = getPath(name)
    const stream = fs.createReadStream(filepath)
    stream.metadata = {unicode: arr(unicode), name}
    fontStream.write(stream)
  })
  fontStream.end()
}

function arr(x) {
  return Array.isArray(x) ? x : [x]
}
