import { Block, BlockUpdate, colorProperties } from './block';
import { BarConfig } from './config-builder';
import { Color } from './color';

type NamedBlockUpdate = BlockUpdate & {
  name?: string;
  instance?: string;
};

/**
 * A tbar instance.
 */
export class Bar {

  /**
   * The configuration options for this bar.
   */
  private config: BarConfig;
  /**
   * Whether or not the bar is currently running.
   */
  private running: boolean;

  /**
   * The most recently emitted updates for each block.
   */
  private mostRecentUpdates: Map<Block, NamedBlockUpdate>;

  constructor(config: BarConfig) {
    this.config = config;
    this.running = false;
    this.mostRecentUpdates = new Map();

    // attach event listeners.
    for (const block of this.config.blocks) {
      block.on('update', (update) => this.onBlockUpdate(block, update));
    }
  }

  /**
   * Run this bar. This will tell all of the blocks in this bar to start running, and will start writing information to
   * the output stream of this bar.
   */
  run(): void {
    // send the version header.
    this.writeJSON({ version: 1 });
    // and the start of the infinite array.
    this.writeString('[');

    // start all of the blocks.
    for (const block of this.config.blocks) {
      try {
        block.run();
      } catch (err) {
        this.log(`Error while calling run() on ${block.constructor.name}}: `);
        if (err instanceof Error && err.stack !== undefined) {
          this.log(err.stack);
        } else {
          this.log(err);
        }
        this.log('\n');
      }
    }

    // start running and write an initial update.
    this.running = true;
    this.writeUpdates();
  }

  /**
   * Write a log message. This does nothing if there is no log file for this tbar.
   */
  private log(message: string): void {
    if (this.config.log !== undefined) {
      this.config.log.write(message);
    }
  }

  /**
   * Handle the emission of a block update.
   */
  private onBlockUpdate(block: Block, update: BlockUpdate): void {
    const namedUpdate: NamedBlockUpdate = {
      ...this.config.defaults,
      ...update,
      name: block.name,
      instance: block.instance,
    };
    // check if colours need to be replaced.
    for (const prop of colorProperties) {
      if (prop in namedUpdate) {
        if (namedUpdate[prop]! in Color) {
          // NB(thomas-crane): we need `as any` here because there is no overlap between all of the properties and so
          // `namedUpdate[prop]` has type `never`. This is fine here because we know that `prop` will be a property
          // where this assignment is valid.
          (namedUpdate[prop] as any) = this.config.theme[namedUpdate[prop] as Color];
        }
      }
    }
    this.mostRecentUpdates.set(block, namedUpdate);
    if (this.running) {
      this.writeUpdates();
    }
  }

  /**
   * Write all of the most recent updates to output stream.
   */
  private writeUpdates(): void {
    this.writeString('[');
    let hasWritten = false;
    for (const block of this.config.blocks) {
      if (this.mostRecentUpdates.has(block)) {
        if (hasWritten) {
          this.writeString(',');
        }
        this.writeJSON(this.mostRecentUpdates.get(block));
        hasWritten = true;
      }
    }
    this.writeString('],');
  }

  /**
   * Stringifies the given object and writes it to this bar's output.
   */
  private writeJSON(value: any): void {
    this.config.output.write(JSON.stringify(value));
  }

  /**
   * Writes the string to this bar's output.
   */
  private writeString(value: string): void {
    this.config.output.write(value);
  }
}
