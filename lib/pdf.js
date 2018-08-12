'use strict'

const spawn = require('child_process').spawn
const path = require('path')
const minimist = require('minimist')
const serve = require('./serve')

function pdf (args) {
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
  })

  if (!options['max-slides']) {
    console.log('Missing required parameter \'--max-slides\'')
    return
  }

  const server = serve(args, true)
  server.listen(0, () => {
    const decktape = spawn(
      path.join(__dirname, '..', 'node_modules', '.bin', 'decktape'),
      [
        'generic',
        `http://localhost:${server.address().port}`,
        options.file,
        '--size',
        options.size,
        '--key=ArrowRight',
        '--max-slides',
        options.m + 1
      ],
      { stdio: 'inherit' }
    )

    decktape.on('close', () => server.close())
  })
}

module.exports = pdf
