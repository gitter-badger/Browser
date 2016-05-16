# mako-browser

> A mako plugin bundle for front-end workflows.

[![npm version](https://img.shields.io/npm/v/mako-browser.svg)](https://www.npmjs.com/package/mako-browser)
[![npm dependencies](https://img.shields.io/david/makojs/browser.svg)](https://david-dm.org/makojs/browser)
[![npm dev dependencies](https://img.shields.io/david/dev/makojs/browser.svg)](https://david-dm.org/makojs/browser#info=devDependencies)
[![build status](https://img.shields.io/travis/makojs/browser.svg)](https://travis-ci.org/makojs/browser)
[![coverage](https://img.shields.io/coveralls/makojs/browser.svg)](https://coveralls.io/github/makojs/browser)

## Usage

This plugin is designed for front-end build workflows, namely handling JS and CSS. (including the
assets linked to in your CSS) A lot of concepts are merged from [Component](https://github.com/componentjs/component),
[Duo](https://github.com/duojs/duo) and [Browserify](https://github.com/substack/browserify).

## JS

You can simply write your JS using CommonJS modules. (like you would in node)

```js
// index.js
var sum = require('./sum');
console.log(sum(2, 2));
// > 4

// sum.js
module.exports = function (a, b) {
  return a + b;
};
```

When you run `index.js` through mako, it will bundle all the dependencies you've linked to
recursively into a single file. (by default, that file will be `build/index.js`)

For working with 3rd-party code, this plugin allows you to use npm to manage your dependencies.
If you're familiar with Node, your JS code will be identical. (in fact, the goal will be to make
that code able to run in both environments)

```js
// index.js
var _ = require('lodash');
console.log(_.fill(Array(3), 'a'));
// > [ 'a', 'a', 'a' ]
```

The `lodash` module will be looked for in `node_modules`, so make sure you've used
`$ npm install lodash` before you run mako.

## CSS

Up until now, there is no benefit to using this over Browserify. That changes here, as this plugin
also gives the same power to your CSS!

```css
/* index.css */
@import "./base";

h1 {
  text-decoration: underline;
}

/* base.css */
* {
  box-sizing: border-box;
}
```

When you run `index.css` through mako, it will bundle all your CSS dependencies recursively into
a single file. (by default, that file will be `build/index.css`) Additionally, any images/fonts
you link to will also be copied over to the `build` directory, and the necessary URLs will be
rewritten.

CSS can also be distributed via npm, using the same resolve semantics as for JS. (in fact, it is
the [same module](https://www.npmjs.com/package/resolve) under the hood!) Where you would use an
`index.js`, an `index.css` will be looked for instead. (it will even consider the `package.json`
during resolution, such as the `main` property)

```css
@import "normalize.css";
```

This will simply import [normalize.css](https://github.com/necolas/normalize.css) from your
`node_modules` directory, in the same way as your JS packages get resolved.


## API

### browser([options])

Initializes the plugin, available `options` include:

 - `cssExtensions` additional CSS extensions (eg: `.styl`, `.less`, etc)
 - `forceCopy` when using copy, override the conditional behavior
 - `jsBundle` filename for shared JS bundle (relative to `root`)
 - `jsExtensions` additional JS extensions (eg: `.coffee`, `.es`, etc)
 - `output` sets the output directory name (default: `build`)
 - `read` if turned off, it will not attach any read plugins (allowing you to define your own)
 - `resolveOptions` additional arguments passed to [resolve](https://www.npmjs.com/package/resolve) in css/js
 - `root` sets the root project directory (default: `process.cwd()`)
 - `sourceMaps` allows turning on source-maps for js
 - `symlink` turn on to symlink assets instead of copying (faster for development)
 - `write` if turned off, it will not attach any write plugins (useful when used in a server)
