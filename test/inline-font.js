var test = require('tap').test;
var browserify = require('browserify');
const font = require('../font')

var vm = require('vm');
var fs = require('fs');
var path = require('path');
let fontObj

font({
  fontName: 'myfont',
  glyphs: {
    'h': 'ionicons/heart-circle'
  }
}, (err, obj) => {
  if (err) return console.error(err.message)
  fontObj = obj
  fs.writeFileSync('bla.ttf', Buffer.from(obj.data, 'base64'))
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
      console.log(msg)
      t.deepEqual(JSON.parse(msg), fontObj);
    }
  });
})

