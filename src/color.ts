/**
 * Values which can be used in a block update where a colour is expected. If the bar config has a theme, these values
 * will be replaced with the value from the theme before the update is emitted.
 *
 * Block developers should prefer using `Color` enum values instead of hardcoded colors, since it allows the user of the
 * bar to change the overall look of their bar without needing to modify the source code of the blocks.
 */
export const enum Color {
  Black = 'COLOR_BLACK',
  Red = 'COLOR_RED',
  Green = 'COLOR_GREEN',
  Yellow = 'COLOR_YELLOW',
  Blue = 'COLOR_BLUE',
  Magenta = 'COLOR_MAGENTA',
  Cyan = 'COLOR_CYAN',
  White = 'COLOR_WHITE',
}
