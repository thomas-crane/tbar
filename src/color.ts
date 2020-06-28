/**
 * Values which can be used in a block update where a colour is expected. If the bar config has a theme, these values
 * will be replaced with the value from the theme before the update is emitted.
 *
 * Block developers should prefer using `Color` enum values instead of hardcoded colors, since it allows the user of the
 * bar to change the overall look of their bar without needing to modify the source code of the blocks.
 */
export enum Color {
  Black,
  Red,
  Green,
  Yellow,
  Blue,
  Magenta,
  Cyan,
  White,
}
