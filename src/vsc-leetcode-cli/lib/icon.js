'use strict';
var _ = require('underscore');

var file = require('./file');

const icons = {
  yes: '✔',
  no: '✘',
  like: '★',
  unlike: '☆',
  lock: '🔒',
  nolock: '　',
  empty: ' ',
  ac: '▣',
  notac: '▤',
  none: '⬚',

  themes: new Map()
};

icons.setTheme = function (name) {
  const defaultName = 'default';
  const theme = this.themes.get(name) || this.themes.get(defaultName) || {};
  _.extendOwn(this, theme);
};

icons.init = function () {
  // for (let f of file.listCodeDir('icons'))
  icons.themes.set("default", icons);
};

module.exports = icons;
