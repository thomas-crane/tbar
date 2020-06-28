# tbar

[![Build Status](https://travis-ci.com/thomas-crane/tbar.svg?branch=master)](https://travis-ci.com/thomas-crane/tbar)

An i3status replacement written in TypeScript.

## About

tbar is a status bar generator for i3 which can be used as a replacement for i3status.

Like many other status bar generators, tbar uses the concept of "blocks" to put information into the status bar. The bar
itself consists of zero or more blocks, and each block is responsible for providing a small amount of functionality such
as the current time or system memory usage.

Unlike some other status bar generators, both the blocks *and* the configuration file are written in JS or TS code.
Using code for the config file combined with a builder pattern allows the config to be very concise and readable.

## Installing

The easiest way to install tbar is from npm.

```bash
$ npm install -g tbar
```

This makes the `tbar` command available in your path.

### From source

If you prefer to install from source, you can use the following commands.

```bash
# get the files.
$ git clone https://github.com/thomas-crane/tbar.git
$ cd tbar

# install dependencies and build.
$ npm install
$ npm run compile

# install the package globally.
$ npm link
```

## Usage

```bash
$ tbar --config /path/to/config.js
```

This will start tbar using the configuration file at the provided path. If the file cannot be found, or isn't a valid
config file, tbar will exit with an error status code.

If all is well, tbar will begin writing the i3 status line data to the configured output (defaults to stdout).

## Configuration

tbar is configured through code and uses a builder pattern to construct the config.

The config file is expected to have a single export, which is the config builder. The most minimal config file possible
would be the folliwing.

```js
const tbar = require('tbar');

module.exports = tbar.config();
```

### Adding blocks

The first thing you'll probably want to do is start adding some blocks to your bar. The `addBlock` method of the config
builder can be used to do this. It expects an instance of a `Block`.

```js
const { TimeBlock, DiskUsageBlock, MemoryUsageBlock } = require('/path/to/my/blocks/index.js');
const tbar = require('tbar');

module.exports = tbar.config()
  .addBlock(new DiskUsageBlock())
  .addBlock(new MemoryUsageBlock())
  .addBlock(new TimeBlock());
```

### Block defaults

You might also want to define some default values that all blocks will use. You can either provide them all in one go,
or separately.

```js
// this
module.exports = tbar.config()
  .defaults({ min_width: 100 })
  .defaults({ align: 'right' })

// is equivalent to this
module.exports = tbar.config()
  .defaults({ min_width: 100, align: 'right' })
```

### Themes

tbar uses a theme system to allow the appearance of the status line to be changed without having to modify the blocks
themselves. A theme can be defined using the `theme` method of the config builder.

The theme defines a map from the name of a colour to a hex colour value. If a particular colour is not defined in the
theme, it will simply be replaced with nothing if it is used by a block.

```js
// dracula theme.
module.exports = tbar.config()
  .theme({
    [tbar.Color.Black]: '#282a36',
    [tbar.Color.Red]: '#ff5555',
    [tbar.Color.Green]: '#50fa7b',
    [tbar.Color.Yellow]: '#f1fa8c',
    [tbar.Color.Blue]: '#6272a4',
    [tbar.Color.Magenta]: '#bd93f9'
    [tbar.Color.Cyan]: '#8be9fd',
    [tbar.Color.White]: '#f8f8f2',
  })
  .addBlock(/* ... */);
```

There are also some predefined tbar themes for common colour schemes.

*(this is a planned feature. It's not available right now).*

```js
module.exports = tbar.config()
  .theme(tbar.themes.dracula)
  .addBlock(/* ... */);
```
