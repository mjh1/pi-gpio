var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

var url = require('url');
var gpio = require('rpi-gpio');
var async = require('async');

const spawn = require('child_process').spawn;

app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

gpio.setMode(gpio.MODE_RPI);
async.parallel([
    function(callback) {
        gpio.setup(37, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(33, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(15, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(13, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(31, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(29, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(7, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(12, gpio.DIR_OUT, callback)
    },
], function(err, results) {
    console.log("err:");
    console.log(err);
    console.log("results:");
    console.log(results);
    console.log('Pins set up');
});

app.get('/switch', function (req, res) {
    async.parallel([
        function(callback) {
            gpio.read(37, callback)
        },
        function(callback) {
            gpio.read(33, callback)
        },
        function(callback) {
            gpio.read(15, callback)
        },
        function(callback) {
            gpio.read(13, callback)
        },
        function(callback) {
            gpio.read(31, callback)
        },
        function(callback) {
            gpio.read(29, callback)
        },
        function(callback) {
            gpio.read(7, callback)
        },
        function(callback) {
            gpio.read(12, callback)
        },
    ], function(err, results) {
        console.log("err:");
        console.log(err);
        console.log("results:");
        console.log(results);
        console.log('reads complete');
        res.render('switch', {
            bedroomOn: results[0] && results[1] && results[2] && results[3],
            kitchenOn: results[4] && results[5] && results[6] && results[7]
       });
    });
});

function delayedWrite(pin, value, callback) {
    console.log("write pin: " + pin + " value: " + value);
    gpio.write(pin, value, callback);
}

app.get('/toggle', function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var room = query['room'];
    var operation = query['switch'];
    console.log(query);

    if (operation == '1') {
        operation = 1;
    } else {
        operation = 0;
    }

    if (room == 'kitchen') {
        console.log('switch kitchen ' + operation);
        async.parallel([
            function(callback) {
                delayedWrite(31, operation, callback);
            },
            function(callback) {
                delayedWrite(29, operation, callback);
            },
            function(callback) {
                delayedWrite(7, operation, callback);
            },
            function(callback) {
                delayedWrite(12, operation, callback);
            },
        ], function(err, results) {
            console.log("err:");
            console.log(err);
            console.log("results:");
            console.log(results);
            console.log('Writes complete');
        });
    } else if (room == 'bedroom') {
        async.parallel([
            function(callback) {
                delayedWrite(37, operation, callback);
            },
            function(callback) {
                delayedWrite(33, operation, callback);
            },
            function(callback) {
                delayedWrite(15, operation, callback);
            },
            function(callback) {
                delayedWrite(13, operation, callback);
            },
        ], function(err, results) {
            console.log("err:");
            console.log(err);
            console.log("results:");
            console.log(results);
            console.log('Writes complete');
        });
    }

    res.render('toggle', { pattern: null });
});

app.listen(process.env.PORT || 3000);
console.log("Listening on port: " + (process.env.PORT || 3000));
