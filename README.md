# diapo

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![Build Status](https://travis-ci.org/delvedor/diapo.svg?branch=master)](https://travis-ci.org/delvedor/diapo)

Easy to use, markdown based presentation framework with sane defaults.

*In a hurry?* Just write your ideas in a markdown file and let `diapo` do the work.<br/>
*Design addict?* You can easily customize your presentation with plain old css classes.

## Install
```
npm i diapo -g
```

## Usage
```
diapo command line interface available commands are:

  - init          Create a new diapo presentation.
  - serve         Serves up your presentation on an arbitrary unused port.
  - compile       compiles the markdown into a valid html file
  - offline       Creates an index.offline.html file with everything that can be included.
  - pdf           Prints the pdf version of your slides
  - version       Prints the version of the cli
  - help          Prints this message

Launch 'diapo help [command]' to learn more about each command.
```

## TODO
- [x] The server should compile the markdown on the fly.
- [ ] Documentation!
- [ ] Improve pdf generation.
- [ ] Add [`update-notifier`](https://www.npmjs.com/package/update-notifier)

## Acknowledgements
This project born as a fork of the awesome [`tmcw/big`](https://github.com/tmcw/big).

## License

See [LICENSE](./LICENSE).
