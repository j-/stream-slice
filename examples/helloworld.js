var StreamSlice = require('../');
var PassThrough = require('stream').PassThrough;

var input = new PassThrough();

var sliceHello = new StreamSlice({ end: 5 });
input.pipe(sliceHello).on('data', function (chunk) {
	console.log('slice 1: ' + chunk.toString());
});

var sliceWorld = new StreamSlice({ start: 6 });
input.pipe(sliceWorld).on('data', function (chunk) {
	console.log('slice 2: ' + chunk.toString());
});

input.end('hello world');