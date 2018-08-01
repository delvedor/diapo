'use strict';

const http = require('http');
const ip = require('ip');
const ecstatic = require('ecstatic');
const minimist = require('minimist');

function serve(args) {
  const options = minimist(args, {
    number: ['port'],
    alias: {
      port: 'p'
    },
    default: {
      port: 0
    }
  });

  console.log(options);

  const server = http.createServer(ecstatic({ root: process.cwd(), cache: 1 }));
  server.listen(options.port, function() {
    const port = server.address().port;

    var message = 'Serving!\n\n';
    message += '- http://localhost:' + port;

    try {
      var ipAddress = ip.address();
      var networkURL = 'http://' + ipAddress + ':' + port;

      message += '\n- On your network: ' + networkURL;
    } catch (err) {}

    console.log(message);
  });
}

module.exports = serve;
