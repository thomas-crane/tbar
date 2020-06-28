import { Readable, Writable } from 'stream';
import { Block, BlockUpdate } from './block';
import { Color } from './color';

type Theme = { [K in Color]: string };

/**
 * Configuration options for a tbar.
 */
export interface BarConfig {
  /**
   * The stream from which this bar will read.
   */
  input: Readable;
  /**
   * The stream which this bar will write to.
   */
  output: Writable;
  /**
   * An optional stream which this bar will write logs to.
   */
  log?: Writable;
  /**
   * A theme which will be used to replace `Color` enum values with real colors in hexadecimal format.
   */
  theme: Partial<Theme>;
  /**
   * Block update values that should be applied to all block updates.
   */
  defaults: Partial<BlockUpdate>;
  /**
   * The blocks in this bar.
   */
  blocks: Block[];
}


/**
 * Create a new `ConfigBuilder`.
 */
export function config() {
  return new ConfigBuilder();
}

/**
 * Returns whether or not the `builder` is a `ConfigBuilder` instance.
 */
export function isBuilder(builder: any): builder is ConfigBuilder {
  return builder instanceof ConfigBuilder;
}

export class ConfigBuilder {

  private barConfig: BarConfig;

  constructor() {
    // defaults.
    this.barConfig = {
      input: process.stdin,
      output: process.stdout,
      theme: {},
      defaults: {},
      blocks: [],
    };
  }

  /**
   * Adds the given `block` to this config.
   */
  addBlock(block: Block): this {
    this.barConfig.blocks.push(block);
    return this;
  }

  /**
   * Sets the `input` property of this config.
   */
  input(stream: Readable): this {
    this.barConfig.input = stream;
    return this;
  }

  /**
   * Sets the `output` property of this config.
   */
  output(stream: Writable): this {
    this.barConfig.output = stream;
    return this;
  }

  /**
   * Sets the `log` property of this config.
   */
  log(stream: Writable): this {
    this.barConfig.log = stream;
    return this;
  }

  /**
   * Adds the provided values to the default block update values.
   */
  defaults(value: Partial<BlockUpdate>): this {
    // merge the existing defaults and this one.
    this.barConfig.defaults = {
      ...this.barConfig.defaults,
      ...value,
    };
    return this;
  }

  /**
   *  Sets the theme of this config.
   */
  theme(theme: Partial<Theme>): this {
    this.barConfig.theme = theme;
    return this;
  }

  /**
   * Returns the config which has been built.
   */
  build(): BarConfig {
    return this.barConfig;
  }
}
