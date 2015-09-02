
var zlib = require('zlib');
var Readable = require('stream').Readable;

var Writeable = require('stream').Writeable;



var gzip = zlib.createGzip();

var rs = new Readable;
rs._read = function(){
	rs.push("this is \n");
	console.log(this);
	rs.push("something longer");
}


rs.pipe(process.stdout);