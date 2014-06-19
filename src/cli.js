var fs = require('fs');
const USAGE = fs.readFileSync(__dirname + '/../USAGE', 'utf8');

var docopt = require('docopt').docopt;
var options = docopt(USAGE, {
	help: true,
	version: require('../package').version
});

var StreamSlice = require('./StreamSlice');
var input = process.stdin;
var output = process.stdout;
var middle = new StreamSlice({
	start: options['<start>'],
	end: options['<end>']
});

input.pipe(middle).pipe(output);