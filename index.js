var staticModule = require('static-module');
var quote = require('quote-stream');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var resolve = require('resolve');
const getPath = require('./get-path')
const svgDataUri = require('mini-svg-data-uri')
const bl = require('bl')

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
    
    var sm = staticModule(
        {
            bricons: {
                svg,
                dataURL
            }
        },
        {
            vars: vars,
            varModules: { path: path },
            parserOpts: opts && opts.parserOpts,
            sourceMap: opts && (opts.sourceMap || opts._flags && opts._flags.debug),
            inputFilename: file
        }
    );
    return sm;
    
    function svg(name) {
      return transform(name, x=>x)
    }
    function dataURL(name) {
      return transform(name, b=>Buffer.from(
        svgDataUri(b.toString('utf8'))
      ))
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
            this.push(f(list.slice()))
            this.push(null);
            sm.emit('file', file);
            next();
        }
    }
};
