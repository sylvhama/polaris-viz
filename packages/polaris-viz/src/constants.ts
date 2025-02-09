export {
  BASE_ANIMATION_DURATION,
  XMLNS,
  LOAD_ANIMATION_DURATION,
  SHAPE_ANIMATION_HEIGHT_BUFFER,
  DEFAULT_BORDER_RADIUS,
  MIN_WIDTH_BORDER_RADIUS,
  HORIZONTAL_BAR_LABEL_HEIGHT,
  HORIZONTAL_BAR_LABEL_OFFSET,
  HORIZONTAL_GROUP_LABEL_HEIGHT,
  HORIZONTAL_SPACE_BETWEEN_SETS,
  HORIZONTAL_SPACE_BETWEEN_SINGLE,
  HORIZONTAL_SPACE_BETWEEN_CHART_AND_AXIS,
  MAX_X_AXIS_LINES,
  LINE_ANIMATION_FAST_DURATION,
  LINE_ANIMATION_SLOW_DURATION,
  LINE_ANIMATION_FAST_COUNT,
  LINE_ANIMATION_DURATION_STEP,
  TICK_SIZE,
  FONT_SIZE,
  BELOW_X_AXIS_MARGIN,
  DIAGONAL_ANGLE,
  MIN_HORIZONTAL_LABEL_SPACE,
  DEFAULT_LABEL_RATIO,
  MIN_HORIZONTAL_TICKS,
  LINE_HEIGHT,
  LABEL_ELLIPSIS_LENGTH,
  SMALL_LABEL_WIDTH,
  LABEL_SPACE_MINUS_FIRST_AND_LAST,
  DEFAULT_MAX_Y,
  MIN_BAR_HEIGHT,
  EMPTY_STATE_CHART_MIN,
  EMPTY_STATE_CHART_MAX,
  SPACING_TIGHT,
  SPACING_EXTRA_TIGHT,
  SPACING,
  SPACING_BASE_TIGHT,
  ChartMargin,
  BARS_TRANSITION_CONFIG,
  BARS_SORT_TRANSITION_CONFIG,
  BARS_LOAD_ANIMATION_CONFIG,
  LINES_LOAD_ANIMATION_CONFIG,
  MAX_TRAIL_DURATION,
  HORIZONTAL_BAR_GROUP_DELAY,
  MASK_HIGHLIGHT_COLOR,
  MASK_SUBDUE_COLOR,
  colorWhite,
  colorBlack,
  colorPurpleDark,
  colorTeal,
  NEUTRAL_SINGLE_GRADIENT,
  DEFAULT_THEME,
  LIGHT_THEME,
  PRINT_THEME,
  STACKED_BAR_GAP,
  LABEL_AREA_TOP_SPACING,
  HORIZONTAL_LABEL_MIN_WIDTH,
  ELLIPSIS,
  MAX_DIAGONAL_LABEL_WIDTH,
  MAX_DIAGONAL_VISIBLE_HEIGHT,
  VERTICAL_LABEL_TARGET_WIDTH,
  DIAGONAL_LABEL_MIN_WIDTH,
  HORIZONTAL_LABEL_TARGET_HEIGHT,
  VERTICAL_LABEL_MIN_WIDTH,
  Y_AXIS_CHART_SPACING,
} from '@shopify/polaris-viz-core';

export const DEFAULT_LEGEND_HEIGHT = 24;
export const DEFAULT_LEGEND_WIDTH = 29;
export const LEGEND_ICON_SIZE = 12;
export const BAR_CONTAINER_TEXT_HEIGHT = 48;
export const ANNOTATIONS_LABELS_OFFSET = 10;
export const TOOLTIP_BG_OPACITY = 0.8;
export const COLLAPSED_ANNOTATIONS_COUNT = 3;
export const PREVIEW_ICON_SIZE = 12;
export const ARC_PAD_ANGLE = 0.02;
export const ZERO_VALUE_LINE_HEIGHT = 6;
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const WARN_FOR_DEVELOPMENT = IS_DEVELOPMENT && !IS_TEST;
export const HOVER_TARGET_ZONE = 48;
export const CROSSHAIR_ID = 'Crosshair';
