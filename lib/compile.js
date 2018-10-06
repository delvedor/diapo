'use strict'

const fs = require('fs')
const cpy = require('cpy')
const path = require('path')
const marked = require('marked')
const mustache = require('mustache')
const minimist = require('minimist')
const chokidar = require('chokidar')

const htmlTemplate = fs.readFileSync(path.join(__dirname, './template.hbs'), 'utf8')

function compileCmd (args) {
  const options = minimist(args, {
    string: ['theme', 'title'],
    boolean: ['watch'],
    alias: {
      theme: 't',
      title: 'T',
      watch: 'w'
    },
    default: {
      theme: 'light',
      title: 'Diapo',
      watch: false
    }
  })

  const markdownText = readFile()
  const presentation = compile(options, markdownText)
  copyToFolder(presentation)

  if (options.watch) {
    chokidar.watch('index.md').on('change', () => {
      const markdownText = readFile()
      const presentation = compile(options, markdownText)
      copyToFolder(presentation)
    })
  }
}

function readFile () {
  try {
    var markdownText = fs.readFileSync('index.md', 'utf8')
  } catch (e) {
    throw new Error('This directory does not contain the required index.md file')
  }
  return markdownText
}

function compile (options, markdownText) {
  const html = markdownText
    .split(/(?<!-)---\n/g)
    .filter(v => v.replace(/\s/g, ''))
    .map(markdown => {
      const result = /<!--([\s\S]*?)-->/g.exec(markdown)
      const style = result ? result[1] : null
      if (style == null) {
        return `<div>${marked(markdown)}</div>`
      }
      const { body, div } = style
        .split('\n')
        .reduce((acc, val) => {
          if (val.startsWith('class')) {
            acc.div = val.slice(6)
          } else if (val.startsWith('bodyclass')) {
            acc.body = val.slice(10)
          }
          return acc
        }, {})

      return `<div ${body ? `data-bodyclass="${body}"` : ''} ${div ? `class="${div}"` : ''}>${marked(markdown)}</div>`
    })
    .join('\n')

  return mustache.render(htmlTemplate, {
    title: options.title,
    slides: html,
    theme: options.theme
  })
}

function copyToFolder (presentation) {
  // copy dependencies to the directory first, making sure not to overwrite
  cpy(path.join(__dirname, '../template/*'), './', { overwrite: false })
    .then(() => fs.writeFileSync('index.html', presentation))
    .catch(err => console.error(err))
}

module.exports = compileCmd
module.exports.compile = compile
