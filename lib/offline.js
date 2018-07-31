/* eslint-disable no-new */
'use strict';

const Inliner = require('inliner');
const http = require('http');
const ecstatic = require('ecstatic');
const fs = require('fs');

function offline() {
  const server = http.createServer(ecstatic({ root: process.cwd() }));
  server.listen(0, function() {
    const url = 'http://localhost:' + server.address().port;
    new Inliner(url, function(error, html) {
      if (error) throw error;
      // compressed and inlined HTML page
      fs.writeFileSync('./index.offline.html', html);
      console.log('Done! Wrote index.offline.html with inlined resources');
      server.close();
    });
  });
}

module.exports = offline;
