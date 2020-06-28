#!/usr/bin/env node

import * as minimist from 'minimist';
import { Bar } from './bar';
import { isBuilder } from './config-builder';

const args = minimist(process.argv.slice(2), {
  string: ['config'],
  alias: {
    c: 'config',
  },
});

if (typeof args.config !== 'string') {
  process.stderr.write('Missing config flag.\n');
  process.exit(1);
}

// tslint:disable-next-line: no-var-requires
const builder = require(args.config);
if (!isBuilder(builder)) {
  process.stderr.write(`The module.exports of '${args.config}' is not a ConfigBuilder`);
  process.exit(1);
}

const cfg = builder.build();

const bar = new Bar(cfg);
bar.run();
