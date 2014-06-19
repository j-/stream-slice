var Transform = require('stream').Transform;
var inherits = require('util').inherits;

var StreamSlice = function (options) {
	if (!(this instanceof StreamSlice)) {
		return new StreamSlice(options);
	}
	Transform.call(this, options);
	this._sliceStart = options && options.start || 0;
	this._sliceEnd = options && options.end || Infinity;
	this._sliceIndex = 0;
};
inherits(StreamSlice, Transform);

StreamSlice.prototype._transform = function (chunk, encoding, done) {
	var index = this._sliceIndex;
	var start = this._sliceStart - index;
	var end = this._sliceEnd - index;
	var length = chunk.length;
	var slice;
	if (end > 0) {
		start = Math.max(start, 0);
		end = Math.min(end, length);
		slice = chunk.slice(start, end);
		this.push(slice);
	}
	this._sliceIndex += length;
	done();
};

StreamSlice.prototype._flush = function (done) {
	done();
};

module.exports = StreamSlice;
module.exports.StreamSlice = StreamSlice;
module.exports.slice = function (start, end) {
	return new StreamSlice({
		start: start,
		end: end
	});
};