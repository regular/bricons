var staticModule = require('static-module');
var quote = require('quote-stream');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var resolve = require('resolve');
const getPath = require('./get-path')
const svgDataUri = require('mini-svg-data-uri')
const bl = require('bl')
const makeFont = require('./font')
const svgToCss = require('./svg-to-css')

module.exports = function (file, opts) {
  if (/\.json$/.test(file)) return through();

  function resolver (p) {
    return resolve.sync(p, { basedir: path.dirname(file) });
  }
  var vars = {
    __filename: file,
    __dirname: path.dirname(file),
    require: { resolve: resolver }
  };
  if (!opts) opts = {};
  if (opts.vars) Object.keys(opts.vars).forEach(function (key) {
    vars[key] = opts.vars[key];
  });

  var sm = staticModule( {
    bricons: {
      svg,
      dataURL,
      font,
      css
    }
  }, {
    vars: vars,
    varModules: { path: path },
    parserOpts: opts && opts.parserOpts,
    sourceMap: opts && (opts.sourceMap || opts._flags && opts._flags.debug),
    inputFilename: file
  })
  return sm;
    
  function svg(name) {
    return transform(name, f)
    function f(b, cb) {
      cb(null, b)
    }
  }
  function dataURL(name) {
    return transform(name,  f)
    function f(b, cb) {
      cb(null, Buffer.from(
        svgDataUri(b.toString('utf8'))
      ))
    }
  }
  function font(opts) {
    const stream = bl().pipe(through(write, end))
    return stream

    function write(buf, enc, next) { next() }

    function end(next) {
      makeFont(opts, (err, fontObj) => {
        if (err) return sm.emit('error', err)
        this.push(Buffer.from(JSON.stringify(fontObj)))
        this.push(null)
        next()
      })
    }
  }
  function css(name) {
    return transform(name,  f)
    function f(b, cb) {
      cb(null, Buffer.from(
        svgToCss(name, b.toString('utf8'))
      ))
    }
  }
  
  function transform(name, f) {
    const filepath = getPath(name)
    const list = bl()

    var isBuffer = false;
    var stream = fs.createReadStream(filepath, 'utf8')
      .on('error', function (err) { sm.emit('error', err) })
      .pipe(through(write, end)).pipe(quote())
    ;
    return stream;

    function write (buf, enc, next) {
      list.append(buf);
      next();
    }
    function end (next) {
      f(list.slice(), (err, data) =>{
        if (err) return sm.emit('error', err)
        this.push(data)
        this.push(null);
        sm.emit('file', file);
        next();
      })
    }
  }
};

function arr(x) {
  return Array.isArray(x) ? x : [x]
}
