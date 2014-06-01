var util = require('util'),
    twitter = require('twitter'),
    _ = require('lodash'),
    http = require("http");
var twit = new twitter({
    consumer_key: 'Uui4NrkShX9x8zFoAENiggPlN',
    consumer_secret: 'eIVwXceI57fJw3RWBxCOQRbFlEYS2W7zL7Q9P9l6yUgQxJzFt9',
    access_token_key: '140177155-9OzRTJSd7GpW1P7WtInEqiIkUaEQ803hJ8aVDjqf',
    access_token_secret: 'DM8OhkJPSObjsO2At0935PiJlizNqSJEIExYVAo7cHnp2'
});
var options = {
  host: '192.168.0.106',
  port: 3000,
  path: '/people',
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
};

twit.stream('statuses/filter', {track:'selfie'}, function(stream) {
    stream.on('data', function(data) {
        if(!data.retweeted_status){
                var joad = {};
          if(data.entities.media && !(_.isUndefined(_.pluck(data.entities.media, 'media_url')))) {
            joad['story'] = (data.text);
            joad['imageUrl'] = _.pluck(data.entities.media, 'media_url')[0];
            joad['location'] = {'time':(new Date(data.created_at)).toISOString(), 'latitude':5.0, 'longitude':23.0};
            joad['tags'] = ['joads'];
            // joad['tags'] = _.pluck(data.entities.hashtags[0], 'text');
            var strjoad = JSON.stringify(joad);
            console.log(joad);
            console.log(strjoad);
            console.log(strjoad.length);
            // options.headers['Content-Length'] = strjoad.length;
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

