//setup
  var util = require('util'),
      twitter = require('ntwitter'),
      _ = require('lodash'),
      http = require("http"),
      fs = require('fs'),
			zlib = require('zlib'),
      JSONStream = require('JSONStream');

//read config
  var opt = JSON.parse(fs.readFileSync('config.json', 'utf8'));

  var st = JSON.parse(fs.readFileSync('search-terms.json', 'utf8'));

// init twitter stream
  var twit = new twitter(opt);

// //write a tweetline
//   function writeatweetline(strtweetline){
//   fs.appendFile("my-tweetsz.txt", strtweetline + "\n", function(err) {
//     if(err) {
// 	console.log(err);
//     } else {
// 	console.log("The file was saved!");
//     }
//   });
// }

// init read, write and gzip streams
Readable = require('stream').Readable;
rs = new Readable;
var gzip = zlib.createGzip();
var wstream = fs.createWriteStream('somefile.gz');

rs._read = function(){

}


streamTweet = function(data){
  if(!data.retweeted_status){
    //console.log('i');
    rs.push(JSON.stringify(data));
    // }
  }
}

// Make fake data for testing
// setInterval(function(){
//   console.log("calling home")
//   var fakeData = {
//     "retweeted_status": false,
//     "tweet": "sasdjfklas;fj"
//   }
//   streamTweet(fakeData);
// }, 1000);

//open twitter stream
twit.stream('statuses/filter', {track:st.search_terms}, function(stream) {
    stream.on('data', streamTweet);
  });

//pipe streams together
rs.pipe(gzip).pipe(wstream);

