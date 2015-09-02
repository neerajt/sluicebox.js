//setting shit up
  var _          = require('lodash'),
      fs         = require('fs'),
			JSONStream = require('JSONStream');

//read search terms
var st = JSON.parse(fs.readFileSync('search-terms.json', 'utf8'));

//function to tag tweets
function tagTerm(text, searchTerms){
  var searchText = text.toUpperCase();
	function mapToUpper(item){
		 return item.toUpperCase(); 
	};
	var compareTerms = _.map(searchTerms, mapToUpper);
	//var tag = _.intersection(compareWords, searchCompare);
	var tag = compareTerms.filter( function (s) { return searchText.indexOf(s) > -1; });
	return tag;
}

//write a tweetline
function writeatweetline(strtweetline){
	fs.appendFile("coords.txt", strtweetline + "\n", function(err) {
		if(err) {
			console.log(err);
		} else {
			//console.log("The file was saved!");
		}
	});
}

//read stream stuff
  var opt = fs.createReadStream('hascoords.txt');
opt.setEncoding('utf8');
//make a tweetline
function extractCoords(data){
	var tag = tagTerm(data.text, st.search_terms.split(','));
	var coords = data.geo.coordinates;
	var id = data.id;
	var followers_count = data.user.followers_count;
	var str = id + "," + tag[0] + "," + coords[0] + "," + coords[1] + "," + followers_count;
	//console.log(str + "\n");
	return str;
} 


var Writable = require('stream').Writable;
var ws = Writable({ objectMode: true });
ws._write = function (chunk, enc, next) {
	var tweetline = extractCoords(chunk);
  writeatweetline(tweetline);
	next();
};


opt.pipe(JSONStream.parse()).pipe(ws);

