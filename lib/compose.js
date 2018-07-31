'use strict';

const fs = require('fs');
const cpy = require('cpy');
const path = require('path');
const marked = require('marked');
const mustache = require('mustache');
const minimist = require('minimist');

function compose(args) {
  const options = minimist(args, {
    string: ['theme', 'title'],
    alias: {
      theme: 't',
      title: 'T'
    },
    default: {
      theme: 'light',
      title: 'big'
    }
  });

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
    .map(function(v) {
      return '<div>' + marked(v) + '</div>';
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
