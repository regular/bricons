const fs = require('fs');
const getPath = require('./get-path')
const bl = require('bl')
const Icons2Font = require('svgicons2svgfont')
const once = require('once')
const svg2ttf = require('svg2ttf')

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
  const ttfOpts = Object.assign({fontHeight: 1000}, opts)
  delete ttfOpts.glyphs
  const fontStream = new Icons2Font(ttfOpts)
  const outbuf = bl()
  fontStream.pipe(outbuf)
    .on('error', err => {
      cb(err) 
    })
    .on('finish', ()=>{
      const svgFontStr = outbuf.toString()
      const ttfData = Buffer.from(svg2ttf(svgFontStr, {}).buffer)
      const s = ttfData.toString('base64')
      cb(null, Object.assign({}, opts, {
        type: 'font/ttf',
        data: s
      }))
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
