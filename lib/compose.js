'use strict';

const fs = require('fs');
const cpy = require('cpy');
const path = require('path');
const marked = require('marked');
const mustache = require('mustache');
const minimist = require('minimist');
const chokidar = require('chokidar');

function compose(args) {
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
      title: 'big',
      watch: false
    }
  });

  readAndCompile(options);
  if (options.watch) {
    chokidar.watch('index.md').on('change', () => readAndCompile(options));
  }
}

function readAndCompile(options) {
  try {
    var markdownText = fs.readFileSync('index.md', 'utf8');
  } catch (e) {
    throw new Error(
      'This directory does not contain the required index.md file'
    );
  }

  const divs = markdownText
    .split('---')
    .filter(function(v) {
      return v.replace(/\s/g, '');
    })
    .map(function(markdown) {
      const result = /<!--([\s\S]*?)-->/g.exec(markdown);
      const style = result ? result[1] : null;
      if (style == null) {
        return `<div>${marked(markdown)}</div>`;
      } else {
        const { body, div } = style.split('\n').reduce((acc, val) => {
          if (val.startsWith('class')) {
            acc.div = val.slice(6);
          } else if (val.startsWith('bodyclass')) {
            acc.body = val.slice(10);
          }
          return acc;
        }, {});
        return `<div ${body ? `data-bodyclass="${body}"` : ''} ${
          div ? `class="${div}"` : ''
        }>${marked(markdown)}</div>`;
      }
    })
    .join('\n');

  // copy dependencies to the directory first, making sure not to overwrite
  cpy(path.join(__dirname, '../template/*'), './', { overwrite: false })
    .then(function() {
      var renderedTemplate = mustache.render(
        fs.readFileSync(path.join(__dirname, './template.hbs'), 'utf8'),
        {
          title: options.title,
          slides: divs,
          theme: options.theme
        }
      );
      fs.writeFileSync('index.html', renderedTemplate);
    })
    .catch(function(error) {
      console.error(error);
    });
}

module.exports = compose;
