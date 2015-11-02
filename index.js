
'use strict';

let copy = require('mako-copy');
let css = require('mako-css');
let defaults = require('defaults');
let js = require('mako-js');
let output = require('mako-output');
let stat = require('mako-stat');
let symlink = require('mako-symlink');
let text = require('mako-text');
let write = require('mako-write');


module.exports = function (options) {
  let config = defaults(options, {
    output: 'build',
    read: true,
    root: process.cwd(),
    symlink: false,
    write: true
  });

  return function browser(mako) {
    if (config.read) {
      mako.use(stat([ 'js', 'json', 'css', css.images, css.fonts ]));
      mako.use(text([ 'js', 'json', 'css' ]));
    }

    mako.use(js());
    mako.use(css());

    if (config.write) {
      mako.use(output([ 'js', 'css', css.images, css.fonts ], {
        root: config.root,
        dir: config.output
      }));

      mako.use(write([ 'js', 'css' ]));

      if (config.symlink) {
        mako.use(symlink([ css.images, css.fonts ]));
      } else {
        mako.use(copy([ css.images, css.fonts ]));
      }
    }
  };
};
