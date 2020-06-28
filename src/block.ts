import { Color } from './color';
import { TypedEmitter } from 'tiny-typed-emitter';

type BlockEvents = {
  'update': (update: BlockUpdate) => void,
};

/**
 * A block which can be used in a tbar.
 *
 * # Anatomy of a block
 *
 * ## Constructor
 *
 * The constructor of a block __should not__ be used to begin the processing of any actions, or to begin sending
 * updates. If a block requires some configuration values, the constructor should be used to set these values up.
 *
 * ## `run()`
 *
 * The `run` method of a block __should__ be used to begin the processing of actions, and to allow the block to begin
 * sending updates. The `run` method will be called exactly once.
 *
 * ## `pause()`
 *
 * The `pause` method of a block optionally defines the logic to temporarily prevent the block from sending updates or
 * performing any actions which may consume resources unecessarily. i3 may send a SIGSTOP to tbar, in which case tbar
 * will ask each block to `pause`. However, regardless of any signals sent by i3, tbar __will not__ call the `pause`
 * method of a block which is already in a paused state. This method may be called zero or more times. If this method is
 * implemented by a block, that block should also implement `resume`.
 *
 * ## `resume()`
 *
 * The `resume` method of a block optionally defines the logic to resume the sending of updates or processing of any
 * actions. i3 may send a SIGCONT to tbar, in which case tbar will ask each block to `resume`. However, regardless of
 * any signals sent by i3, tbar __will not__ call the `resume` method of a block which is already in a running state.
 * This method may be called zero or more times. If this method is implemented by a block, that block should also
 * implement `pause`.
 *
 * ## Sending block updates.
 *
 * When a block wishes to send an update, it may emit an `'update'` event. The `Block` superclass extends
 * `EventEmitter`, so any children classes may use `super.emit('update', ...)` in order to emit an update. Block updates
 * are expected to conform to the `BlockUpdate` interface, but they are not validated. For this reason, blocks written
 * in JavaScript should take extra care to ensure that they conform to the interface.
 */
export abstract class Block extends TypedEmitter<BlockEvents> {
  /**
   * The name of this block. This is used when a click event occurs to determine the block that was clicked on. If this
   * block does not care about click events, the name is not required.
   */
  abstract readonly name?: string;
  /**
   * The instance of this block. There may be multiple blocks of the same type (such as disk usage for two separate
   * mount points), in which case the instance is used to distinguish between these blocks.
   */
  abstract readonly instance?: string;

  /**
   * Setup this block and allow it to start sending updates. Any updates sent by a block which has not yet had its `run`
   * method called will be ignored.
   */
  abstract run(): void;

  /**
   * Stop this block from performing any actions or sending any updates. Any updates sent by a paused block will be
   * ignored anyway, but it is good practice to avoid consuming resources unecessarily.
   */
  // tslint:disable-next-line: no-empty
  pause(): void { }

  /**
   * Allow this block to start performing actions and sending updates again.
   */
  // tslint:disable-next-line: no-empty
  resume(): void { }
}

/**
 * Properties which can have a `Color` enum member as a value.
 */
export const colorProperties: (keyof BlockUpdate)[] = ['color', 'background', 'border'];

/**
 * An update which a block can emit to request that the status bar be updated.
 */
export interface BlockUpdate {
  /**
   * The text which will be displayed on the status line.
   */
  full_text: string;
  /**
   * The text which will be displayed on the status line in the case where the block would take up more space than is
   * available.
   */
  short_text?: string;
  /**
   * The colour of the text. This can either be a value from the `Color` enum, or a colour specified in hexadecimal
   * notation (such as "#ffd17a")
   */
  color?: Color | string;
  /**
   * The background colour of this block. This can either be a value from the `Color` enum, or a colour specified in
   * hexadecimal notation (such as "#ffd17a")
   */
  background?: Color | string;
  /**
   * The colour of this block's border. This can either be a value from the `Color` enum, or a colour specified in
   * hexadecimal notation (such as "#ffd17a")
   */
  border?: Color | string;
  /**
   * The width in pixels of the top border of this block.
   */
  border_top?: number;
  /**
   * The width in pixels of the right border of this block.
   */
  border_right?: number;
  /**
   * The width in pixels of the bottom border of this block.
   */
  border_bottom?: number;
  /**
   * The width in pixels of the left border of this block.
   */
  border_left?: number;
  /**
   * The minimum width in pixels of this block. If the width of this block's `full_text` in pixels is less than that of
   * its `min_width`, padding will be added to the block and the text will be aligned according to its `align` value.
   */
  min_width?: number;
  /**
   * The text alignment of this block. This only applies if the width of this block's `full_text` in pixels is less
   * than that of its `min_width`.
   */
  align?: 'center' | 'right' | 'left';
  /**
   * Whether or not this value is urgent. For example, when the battery charge is less than 1 percent, or there is no
   * more free disk space.
   */
  urgent?: boolean;
  /**
   * Whether or not to draw a separator after this block.
   */
  separator?: boolean;
  /**
   * The number of pixels to leave blank after this block. The separator will be drawn in the middle of the blank area
   * unless this block's `separator` property is false.
   */
  separator_block_width?: number;
}
