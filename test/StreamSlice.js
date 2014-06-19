var assert = require('assert');
var StreamSlice = require('../');
var PassThrough = require('stream').PassThrough;

describe('StreamSlice', function () {
	it('should stream all data when no start or end is given when writing 1 chunk', function () {
		var input = new PassThrough();
		var test = new StreamSlice();
		var chunks = [];
		input.pipe(test);
		test.on('data', function (data) {
			chunks.push(data);
		});
		test.on('end', function () {
			assert.equal(chunks.length, 1);
			assert.equal(chunks[0].toString(), 'test data');
		});
		input.end('test data');
	});
	it('should stream all data when no start or end is given when writing 2 chunks', function () {
		var input = new PassThrough();
		var test = new StreamSlice();
		var chunks = [];
		input.pipe(test);
		test.on('data', function (data) {
			chunks.push(data);
		});
		test.on('end', function () {
			assert.equal(chunks.length, 2);
			assert.equal(chunks[0].toString(), 'test');
			assert.equal(chunks[1].toString(), 'data');
		});
		input.write('test');
		input.write('data');
		input.end();
	});
	it('should take a start option', function () {
		var input = new PassThrough();
		var test = new StreamSlice({ start: 5 });
		input.pipe(test).on('data', function (data) {
			assert.equal(data.toString(), 'data');
		});
		input.end('test data');
	});
	it('should take an end option', function () {
		var input = new PassThrough();
		var test = new StreamSlice({ end: 4 });
		input.pipe(test).on('data', function (data) {
			assert.equal(data.toString(), 'test');
		});
		input.end('test data');
	});
	it('should take both a start and an end option', function () {
		var input = new PassThrough();
		var test = new StreamSlice({ start: 3, end: 6 });
		input.pipe(test).on('data', function (data) {
			assert.equal(data.toString(), 'test');
		});
		input.end('t d');
	});
	it('should pipe multiple chunks', function () {
		var input = new PassThrough();
		var test = new StreamSlice({ start: 6, end: 18 });
		var result = [];
		input.pipe(test);
		test.on('data', function (buffer) {
			result.push(buffer);
		});
		test.on('end', function () {
			var concatenated = Buffer.concat(result);
			var string = concatenated.toString();
			assert.equal(string, 'ghijklmnopqr');
		});
		input.write('abcde');
		input.write('fghij');
		input.write('klmno');
		input.write('pqrst');
		input.write('uvwxy');
		input.write('z');
		input.end();
	});
	it('should pipe to multiple outputs', function () {
		var input = new PassThrough();
		var test = new StreamSlice({ start: 4, end: 9 });
		var output1 = new PassThrough();
		var output2 = new PassThrough();
		input.pipe(test);
		test.pipe(output1).on('data', function (data) {
			assert.equal(data.toString(), 'quick');
		});
		test.pipe(output2).on('data', function (data) {
			assert.equal(data.toString(), 'quick');
		});
		input.end('The quick brown fox');
	});
	it('should work when piping to another StreamSlice', function () {
		var input = new PassThrough();
		var test1 = new StreamSlice({ end: 9 });
		var test2 = new StreamSlice({ start: 4 });
		input.pipe(test1).pipe(test2).on('data', function (data) {
			assert.equal(data.toString(), 'quick');
		});
		input.end('The quick brown fox');
	});
});
describe('slice', function () {
	var slice = StreamSlice.slice;
	it('should return a StreamSlice object', function () {
		var stream = slice();
		assert.equal(stream.constructor, StreamSlice);
	});
	it('should behave like StreamSlice', function () {
		var input = new PassThrough();
		var test = slice(4, 9);
		input.pipe(test).on('data', function (data) {
			assert.equal(data.toString(), 'quick');
		});
		input.end('The quick brown fox');
	});
	it('should not require an end parameter', function () {
		var input = new PassThrough();
		var test = slice(4);
		input.pipe(test).on('data', function (data) {
			assert.equal(data.toString(), 'quick brown fox');
		});
		input.end('The quick brown fox');
	});
});