'use strict'

const { readFile } = require('fs')
const http = require('http')
const serveHandler = require('serve-handler')
const minimist = require('minimist')
const { compile } = require('./compile')

function serve (args, getServer) {
  const options = minimist(args, {
    number: ['port'],
    string: ['theme', 'title'],
    alias: {
      theme: 't',
      title: 'T',
      port: 'p'
    },
    default: {
      theme: 'light',
      title: 'Diapo',
      port: 0
    }
  })

  const serveHandlerOpts = {
    headers: [{
      source: '**/*.@(js|css|html|png|jpg)',
      headers: [{
        key: 'Cache-Control',
        value: 'no-cache'
      }]
    }]
  }

  const server = http.createServer((req, res) => {
    const { url } = req
    if (url === '/' || url.slice(-10) === 'index.html') {
      readFile('index.md', 'utf8', (err, markdownText) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(err.message)
          return
        }

        const html = compile(options, markdownText)
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
      })
    } else {
      serveHandler(req, res, serveHandlerOpts).catch(console.log)
    }
  })

  if (getServer) {
    return server
  }

  server.listen(options.port, () => {
    const port = server.address().port
    console.log(`Serving!\n\nhttp://localhost:${port}`)
  })
}

module.exports = serve
