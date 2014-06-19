stream-slice
============

Pipe some data in and only get the bits you want. Exports a transform stream which slices an input stream like a buffer. Also comes with a command line utility.

## Installing

Use [npm][0] to install.

### Node module

```bash
$ npm install j-/stream-slice --save
```

The module can now be loaded with `require('stream-slice')`.

### Command line

```bash
$ npm install j-/stream-slice --global
```

The executable `slice` will now be available.

## Usage

### Node module

#### Using `new` keyword

`StreamSlice` is a constructor and an instance can be initialized with `new`.

**Syntax**: `new StreamSlice([options])`
* _options_ (optional): Object. Passed through to node's native [`Transform`][1] stream.
    * _start_ (optional): Integer. Start streaming from this byte onwards.
    * _end_ (optional) Integer. Stop streaming after this byte.

```js
var options = { start: 4, end: 9 };
var StreamSlice = require('stream-slice');
process.stdin.pipe(new StreamSlice(options)).pipe(process.stdout);
```

##### Shorthand style

The constructor function will automatically resolve to an instance without need for the `new` keyword if you prefer.

```js
var options = { start: 4, end: 9 };
var streamslice = require('stream-slice');
process.stdin.pipe(streamslice(options)).pipe(process.stdout);
```

#### Convenience function

The module also exports a convenience function called `slice`.

**Syntax**: `slice([start[, end]])`
* _start_ (optional): Integer. Start streaming from this byte onwards.
* _end_ (optional) Integer. Stop streaming after this byte.

```js
var slice = require('stream-slice').slice;
process.stdin.pipe(slice(4, 9)).pipe(process.stdout);
```

### Command line

    Pipe some data in and only get the bits you want.
    
    Usage:
      slice [<start>] [<end>] [< in [> out]]
    
    Options:
      -h, --help      Show this screen
      -V, --version   Show version

`start` and `end` values should be integers. They are both optional. If `end` is omitted then data will be piped until the input stream ends. If both are omitted then the whole stream will be piped.

#### Examples

```bash
$ echo The quick brown fox | slice 4 9
quick

$ slice 13 25 < package.json
stream-slice
```

[0]: https://www.npmjs.org/
[1]: http://nodejs.org/api/stream.html#stream_class_stream_transform_1