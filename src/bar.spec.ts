import test, { ExecutionContext } from 'ava';
import { FakeWritable } from '../test/streams';
import { Bar } from './bar';
import { ConfigBuilder, config } from './config-builder';
import { BlockUpdate, Block } from './block';
import { Color } from './color';

function testBlockEmit(t: ExecutionContext, cfg: ConfigBuilder, update: BlockUpdate, expected: BlockUpdate) {
  // extend the config with a block that will emit the update once.
  cfg.addBlock(new class extends Block {
    name = undefined;
    instance = undefined;
    run(): void {
      this.emit('update', update);
    }
  }());
  const output = new FakeWritable();
  cfg.output(output);

  // run the bar.
  const bar = new Bar(cfg.build());
  bar.run();

  // get the output. cut off the header.
  const emitted = output.text.slice(15, -2);
  t.is(emitted, JSON.stringify(expected));
}

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

test(
  'Colors are replaced with their theme value.',
  testBlockEmit,
  config()
    .theme({ [Color.Cyan]: '#000000' }),
  { full_text: 'a', color: Color.Cyan },
  { full_text: 'a', color: '#000000' },
);

test(
  'Colors are replaced with nothing if there is no theme value for them.',
  testBlockEmit,
  config(),
  { full_text: 'a', color: Color.White },
  { full_text: 'a' },
);
