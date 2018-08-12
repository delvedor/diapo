'use strict'

const path = require('path')
const fs = require('fs')
const cpy = require('cpy')
const minimist = require('minimist')

function init (args) {
  const options = minimist(args)

  const directory = options._[0]

  if (directory) {
    fs.mkdirSync(directory)
    init(directory)
  } else {
    init('./')
  }

  function init (inDirectory) {
    cpy(path.join(__dirname, '../template/*'), inDirectory)
  }
}

module.exports = init
