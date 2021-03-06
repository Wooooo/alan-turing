const
    Crawler     = require('node-webcrawler'),
    url         = require('url'),
    config      = require('./config'),
    mongodb     = require('./mongodb'),
    path        = require('path');

setInterval(function () {
    if (typeof gc === 'function') {
        gc();
    }

    console.log('Memory Usage', process.memoryUsage());
}, 30000);

mongodb.init(function() {
    let pendingTime = Math.floor(Math.random()*10000);

    setTimeout(function() {
        mongodb.findStartUrl(function(startUrl) {
            let c = require('./crawler')(startUrl);

            console.log(`Start crawling from '${startUrl}' with pending ${pendingTime}`);

            c.start();
        });
    }, pendingTime);

});

let exitHandler = function(options, error) {
    if(error) {
        console.log(error);
    }

    mongodb.close();
    process.exit();
};

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
