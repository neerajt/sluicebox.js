var util = require('util'),
    twitter = require('twitter'),
    _ = require('lodash');
var twit = new twitter({
    consumer_key: 'Uui4NrkShX9x8zFoAENiggPlN',
    consumer_secret: 'eIVwXceI57fJw3RWBxCOQRbFlEYS2W7zL7Q9P9l6yUgQxJzFt9',
    access_token_key: '140177155-9OzRTJSd7GpW1P7WtInEqiIkUaEQ803hJ8aVDjqf',
    access_token_secret: 'DM8OhkJPSObjsO2At0935PiJlizNqSJEIExYVAo7cHnp2'
});

twit.stream('statuses/filter', {track:'manu'}, function(stream) {
    stream.on('data', function(data) {
        if(!data.retweeted_status){
 								var joad = {};
        	if(data.entities.media && !(_.isUndefined(_.pluck(data.entities.media, 'media_url')))) {
        		joad['story'] = (data.text);
        		joad['image'] = _.pluck(data.entities.media, 'media_url')[0];
        		joad['location'] = {'time':data.created_at, 'latitude':0, 'longitude':23};
        		console.log(joad);
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

