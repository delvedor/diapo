'use strict';

const spawn = require('child_process').spawn;
const path = require('path');
const http = require('http');
const ecstatic = require('ecstatic');
const minimist = require('minimist');

function pdf(args) {
  const options = minimist(args, {
    string: ['size', 'file'],
    number: ['max-slides'],
    alias: {
      size: 's',
      file: 'f',
      'max-slides': 'm'
    },
    default: {
      size: '1280x720',
      file: 'slides.pdf',
      'max-slides': 0
    }
  });

  serve((err, server, port) => {
    if (err) throw err;
    const decktape = spawn(
      path.join(__dirname, '..', 'node_modules', '.bin', 'decktape'),
      [
        'generic',
        `http://localhost:${port}`,
        options.file,
        '--size',
        options.size,
        '--key=ArrowRight',
        '--max-slides',
        options.m + 1
      ],
      { stdio: 'inherit' }
    );

    decktape.on('close', () => server.close());
  });
}

function serve(options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  }
  options.port = options.port || 0;

  const server = http.createServer(ecstatic({ root: process.cwd(), cache: 1 }));

  server.listen(options.port, function() {
    const port = server.address().port;
    cb(null, server, port);
  });
}

module.exports = pdf;
