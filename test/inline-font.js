var test = require('tap').test;
var browserify = require('browserify');
const font = require('../font')

var vm = require('vm');
var fs = require('fs');
var path = require('path');
let fontData

font({
  fontName: 'myfont',
  fontHeight: 1000,
  glyphs: {
    'h': 'ionicons/heart-circle'
  }
}, (err, data) => {
  if (err) return console.error(err.message)
  fontData = data
  test('inline svg font', function (t) {
    t.plan(1);

    var b = browserify();
    b.add(__dirname + '/files/inline-font.js');
    b.transform(path.dirname(__dirname));

    b.bundle(function (err, src) {
      if (err) t.fail(err);
      //console.log(src.toString())
      vm.runInNewContext(src, { console: { log: log } });
    });

    function log (msg) {
      //console.log(msg)
      t.equal(msg, fontData);
    }
  });
})

