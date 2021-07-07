var test = require('tap').test;
var browserify = require('browserify');

var vm = require('vm');
var fs = require('fs');
var path = require('path');

const getPath = require('../get-path')
const svg = fs.readFileSync(getPath('ionicons/heart-circle'), 'utf8');
const svgDataUri = require('../data-uri')
const url = svgDataUri(svg)

test('css variable', function (t) {
  t.plan(1);
  
  var b = browserify();
  b.add(__dirname + '/files/css.js');
  b.transform(path.dirname(__dirname));
  
  b.bundle(function (err, src) {
    if (err) t.fail(err);
    vm.runInNewContext(src, { console: { log: log } });
  })
  
  function log (msg) {
    const expect = `:root { --heart-circle: url("${url}"); }`
    t.equal(msg, expect);
  }
})
