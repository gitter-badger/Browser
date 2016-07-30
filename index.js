'use strict'

let buffer = require('mako-buffer')
let copy = require('mako-copy')
let css = require('mako-css')
let debug = require('debug')('mako-browser')
let defaults = require('defaults')
let html = require('mako-html')
let js = require('mako-js')
let output = require('mako-output')
let sourcemaps = require('mako-sourcemaps')
let stat = require('mako-stat')
let symlink = require('mako-symlink')
let watch = require('mako-watch')
let write = require('mako-write')

module.exports = function (options) {
  debug('initialize %j', options)
  let config = defaults(options, {
    cssExtensions: null,
    forceCopy: false,
    jsBrowser: null,
    jsBundle: null,
    jsCore: null,
    jsExtensions: null,
    jsModules: null,
    output: 'build',
    read: true,
    resolveOptions: null,
    sourceMaps: false,
    symlink: false,
    watch: false,
    write: true
  })

  return function browser (mako) {
    let assets = [ css.images, css.fonts ]

    if (config.read) {
      debug('adding read plugins')
      if (config.watch) {
        debug('using watch')
        mako.use(watch(config.watch))
      } else {
        debug('using stat')
        mako.use(stat([ 'html', 'js', 'json', 'css', assets ]))
      }
      mako.use(buffer([ 'html', 'js', 'json', 'css' ]))
    }

    mako.use(html())

    mako.use(js({
      browser: config.jsBrowser,
      bundle: config.jsBundle,
      core: config.jsCore,
      extensions: config.jsExtensions,
      modules: config.jsModules,
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
      mako.use(output([ 'html', 'js', 'css', assets ], { dir: config.output }))
      mako.use(write([ 'html', 'js', 'css' ]))

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
