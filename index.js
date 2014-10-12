//setting shit up
  var util = require('util'),
      twitter = require('twitter'),
      _ = require('lodash'),
      http = require("http"),
      fs = require('fs');

//read config stuff
  var opt = JSON.parse(fs.readFileSync('config.json', 'utf8'));

  var st = JSON.parse(fs.readFileSync('search-terms.json', 'utf8'));

// open twitter stream
  var twit = new twitter(opt);

//make a tweetline
  function makeEntry(data){
    // tweetline['tags'] = _.pluck(data.entities.hashtags[0], 'text');
    var strtweetline = JSON.stringify(data);
    console.log(strtweetline);
    console.log(strtweetline.length);
    return strtweetline;
  }

//write a tweetline
  function writeatweetline(strtweetline){
  fs.appendFile("my-tweetsz.txt", strtweetline + "\n", function(err) {
    if(err) {
	console.log(err);
    } else {
	console.log("The file was saved!");
    }
  });
}

twit.stream('statuses/filter', {track:st.search_terms}, function(stream) {
    stream.on('data', function(data) {
        if(!data.retweeted_status){
//          if(data.entities.media && !(_.isUndefined(_.pluck(data.entities.media, 'media_url')))) {
            // options.headers['Content-Length'] = strtweetline.length;
            strtweetline = makeEntry(data);
            writeatweetline(strtweetline);
//          };
        };
    });

    // Disconnect stream after five seconds
    //setTimeout(stream.destroy, 120000);
});

