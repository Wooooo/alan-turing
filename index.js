const
    Crawler     = require('node-webcrawler'),
    url         = require('url'),
    config      = require('./config'),
    mongodb     = require('./mongodb'),
    express     = require('express');


const startUrl = 'https://en.wikipedia.org/wiki/Portal:Mathematics';

setInterval(function () {
    if (typeof gc === 'function') {
        gc();
    }
    console.log('Memory Usage', process.memoryUsage());
}, 60000);

mongodb.init(function() {
    let c = require('./crawler')(startUrl);

    c.start();
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
