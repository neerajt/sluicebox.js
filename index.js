//setting shit up
  var util = require('util'),
      twitter = require('twitter'),
      fs = require('fs'),
      _ = require('lodash'),
      http = require("http"),
      fs = require('fs');

  var options = {
    'host': "192.168.0.106",
    'port': 3000,
    'path': "/people",
    'method': "POST",
    'headers': {'Content-Type': "application/json"}
  }

//read config stuff
var opt = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// open twitter stream
  var twit = new twitter(opt);

  function sendtoapi(strjoad){
    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(strjoad);
    req.end();
  };



//make a joad
  function makeEntry(data){
    var joad = {};
    joad['story'] = (data.text);
    joad['imageUrl'] = _.pluck(data.entities.media, 'media_url')[0];
    joad['location'] = {'time':(new Date(data.created_at)).toISOString(), 'latitude':5.0, 'longitude':23.0};
    joad['tags'] = ['joads'];
    // joad['tags'] = _.pluck(data.entities.hashtags[0], 'text');
    var strjoad = JSON.stringify(joad);
    console.log(strjoad);
    console.log(strjoad.length);
    return strjoad;
  }

//write a joad
  function writeajoad(strjoad){
  fs.appendFile("myJoads.txt", strjoad + "\n", function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
  });
  }

twit.stream('statuses/filter', {track:'selfie'}, function(stream) {
    stream.on('data', function(data) {
        if(!data.retweeted_status){
          if(data.entities.media && !(_.isUndefined(_.pluck(data.entities.media, 'media_url')))) {
            // options.headers['Content-Length'] = strjoad.length;
            strjoad = makeEntry(data);
            sendtoapi(strjoad);
            writeajoad(strjoad);
          };
        };
    });

    // Disconnect stream after five seconds
    setTimeout(stream.destroy, 120000);
});


// {
//     "name" : "Jane Doe",
//     "tags" : [ "homeless", "devloper", "veteran" ],
//     "story" : "Jane worked for Silicon Graphics, and then was foreced out of her house.",
//     "location" : {
//                     "time" : <ISO 8601 timestamp>,
//                     "latitude" : -54.34532323,
//                     "longitude" : 23.4242122
//                  }
//     "image" : "http://localhost:3000/sad_sgi_engineer.jpeg"
// }

