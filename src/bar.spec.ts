import test from 'ava';
import { FakeWritable } from '../test/streams';
import { Bar } from './bar';

test('The initial handshake is sent.', (t) => {
  const output = new FakeWritable();
  const bar = new Bar({
    blocks: [],
    input: process.stdin,
    theme: {},
    defaults: {},
    output,
  });
  bar.run();
  t.is(output.text, '{"version":1}[[],');
});
