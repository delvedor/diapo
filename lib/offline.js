/* eslint-disable no-new */
'use strict'

const fs = require('fs')
const Inliner = require('inliner')
const serve = require('./serve')

function offline (args) {
  const server = serve(args, true)
  server.listen(0, () => {
    console.log('Loading...')
    const url = `http://localhost:${server.address().port}`
    new Inliner(url, (err, html) => {
      if (err) return console.log(err)
      // compressed and inlined HTML page
      fs.writeFileSync('./index.offline.html', html)
      console.log('Done! Wrote index.offline.html with inlined resources')
      server.close()
    })
  })
}

module.exports = offline
