var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'Uui4NrkShX9x8zFoAENiggPlN',
    consumer_secret: 'eIVwXceI57fJw3RWBxCOQRbFlEYS2W7zL7Q9P9l6yUgQxJzFt9',
    access_token_key: '140177155-9OzRTJSd7GpW1P7WtInEqiIkUaEQ803hJ8aVDjqf',
    access_token_secret: 'DM8OhkJPSObjsO2At0935PiJlizNqSJEIExYVAo7cHnp2'
});

twit.stream('statuses/filter', {track:'foo'}, function(stream) {
    stream.on('data', function(data) {
        console.log(util.inspect(data));
    });
    // Disconnect stream after five seconds
    setTimeout(stream.destroy, 15000);
});


