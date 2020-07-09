var test = require('tap').test;
var browserify = require('browserify');

var vm = require('vm');
var fs = require('fs');
var path = require('path');

const getPath = require('../get-path')
const svg = fs.readFileSync(getPath('ionicons/heart-circle'), 'utf8');
const svgDataUri = require('mini-svg-data-uri')
const url = svgDataUri(svg)

test('inline data URL', function (t) {
    t.plan(1);
    
    var b = browserify();
    b.add(__dirname + '/files/inline-dataurl.js');
    b.transform(path.dirname(__dirname));
    
    b.bundle(function (err, src) {
        if (err) t.fail(err);
        vm.runInNewContext(src, { console: { log: log } });
    });
    
    function log (msg) {
        t.equal(msg, url);
    }
});
