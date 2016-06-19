'use strict'

let buffer = require('mako-buffer')
let copy = require('mako-copy')
let css = require('mako-css')
let debug = require('debug')('mako-browser')
let defaults = require('defaults')
let js = require('mako-js')
let output = require('mako-output')
let sourcemaps = require('mako-sourcemaps')
let stat = require('mako-stat')
let symlink = require('mako-symlink')
let write = require('mako-write')

module.exports = function (options) {
  debug('initialize %j', options)
  let config = defaults(options, {
    cssExtensions: null,
    forceCopy: false,
    jsBundle: null,
    jsExtensions: null,
    output: 'build',
    read: true,
    resolveOptions: null,
    sourceMaps: false,
    symlink: false,
    write: true
  })

  return function browser (mako) {
    let assets = [ css.images, css.fonts ]

    if (config.read) {
      debug('adding read plugins')
      mako.use(stat([ 'js', 'json', 'css', assets ]))
      mako.use(buffer([ 'js', 'json', 'css' ]))
    }

    mako.use(js({
      bundle: config.jsBundle,
      extensions: config.jsExtensions,
      resolveOptions: config.resolveOptions,
      sourceMaps: !!config.sourceMaps
    }))

    mako.use(css({
      extensions: config.cssExtensions,
      resolveOptions: config.resolveOptions,
      sourceMaps: !!config.sourceMaps
    }))

    if (config.sourceMaps) {
      mako.use(sourcemaps([ 'js', 'css' ], {
        inline: config.sourceMaps === 'inline'
      }))
    }

    if (config.write) {
      debug('adding write plugins')
      mako.use(output([ 'js', 'css', assets ], { dir: config.output }))
      mako.use(write([ 'js', 'css' ]))

      if (config.sourceMaps) {
        mako.use(output('map', { dir: config.output }))
        mako.use(write('map'))
      }

      if (config.symlink) {
        mako.use(symlink(assets))
      } else {
        mako.use(copy(assets, { force: config.forceCopy }))
      }
    }
  }
}
