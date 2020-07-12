bricons
---
browserify transform for inlining SVG incons and spinners.
Comes with ionicons an Sam Herbert's SVG loaders.

## Usage

``` js
const bricons = require('bricons')
const closeCircle = bricons.svg('ionicons/close-circle')
const spinner = bricons.dataURL('samherbert/oval')
```

``` sh
npm i --save-dev bricons browserify
browserify index.js -t bricons
```

### Output

``` js
const closeCircle = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"512\" height=\"512\" viewBox=\"0 0 512 512\"><title>ionicons-v5-m</title><path d=\"M25 [...]"
const spinner = "data:image/svg+xml,%3c!-- By Sam Herbert (%40sherb)%2c for everyone. More %40 http://goo.gl/7AJzbL --%3e %3csvg width='38' height='38' viewBox='0 [...]"
```

License: MIT
