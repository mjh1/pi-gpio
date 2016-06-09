var gpio = require('rpi-gpio');

gpio.on('export', function(channel) {
    console.log('Channel set: ' + channel);
});

gpio.setup(7, gpio.DIR_OUT);
gpio.setup(15, gpio.DIR_OUT);
gpio.setup(16, gpio.DIR_OUT, pause);

function pause(err, results) {
        console.log("err:");
        console.log(err);
        console.log("results:");
        console.log(results);
    setTimeout(closePins, 2000);
}

function closePins() {
    gpio.destroy(function() {
        console.log('All pins unexported');
    });
}
