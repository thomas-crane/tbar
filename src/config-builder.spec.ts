import test from 'ava';
import { FakeReadable, FakeWritable } from '../test/streams';
import { config } from './config-builder';

test('Returns the config with default values.', (t) => {
  const cfg = config().build();
  t.is(cfg.input, process.stdin);
  t.is(cfg.output, process.stdout);
  t.is(cfg.blocks.length, 0);
});

test('Returns the config with the given values.', (t) => {
  const input = new FakeReadable();
  const output = new FakeWritable();
  const cfg = config()
    .input(input)
    .output(output)
    .build();
  t.is(cfg.input, input);
  t.is(cfg.output, output);
});

test('Adding defaults is additive.', (t) => {
  const cfg = config()
    .defaults({ separator: true })
    .defaults({ min_width: 64 })
    .build();
  t.deepEqual(cfg.defaults, { separator: true, min_width: 64 });
});
