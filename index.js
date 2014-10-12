//setting shit up
  var util = require('util'),
      twitter = require('twitter'),
      fs = require('fs'),
      _ = require('lodash'),
      http = require("http"),
      fs = require('fs');

//read config stuff
  var opt = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// open twitter stream
  var twit = new twitter(opt);

//make a tweetline
  function makeEntry(data){
    var tweetline = {};
    tweetline['story'] = (data.text);
    tweetline['imageUrl'] = _.pluck(data.entities.media, 'media_url')[0];
    tweetline['location'] = {'time':(new Date(data.created_at)).toISOString(), 'latitude':5.0, 'longitude':23.0};
    tweetline['tags'] = ['tweetlines'];
    // tweetline['tags'] = _.pluck(data.entities.hashtags[0], 'text');
    var strtweetline = JSON.stringify(tweetline);
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

twit.stream('statuses/filter', {track:'depression, depressed'}, function(stream) {
    stream.on('data', function(data) {
        if(!data.retweeted_status){
          if(data.entities.media && !(_.isUndefined(_.pluck(data.entities.media, 'media_url')))) {
            // options.headers['Content-Length'] = strtweetline.length;
            strtweetline = makeEntry(data);
            writeatweetline(strtweetline);
          };
        };
    });

    // Disconnect stream after five seconds
    setTimeout(stream.destroy, 120000);
});

