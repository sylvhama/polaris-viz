import type {InterpolatorFn} from '@react-spring/web';

export interface Data {
  label: string;
  rawValue: number;
}

export interface NullableData {
  label: string;
  rawValue: number | null;
}

export type LineStyle = 'dashed' | 'solid' | 'dotted';

export interface DataSeries<T, C> {
  name: string;
  data: T[];
  color?: C;
}

export interface GradientStop {
  offset: number;
  color: string;
  stopOpacity?: number;
}

export type SeriesColor = Color | GradientStop[];

export type Color = TokensColor | VizPaletteColor;

export type TokensColor =
  | 'colorBlack'
  | 'colorBlue'
  | 'colorBlueDark'
  | 'colorBlueDarker'
  | 'colorBlueLight'
  | 'colorBlueLighter'
  | 'colorBlueText'
  | 'colorGreen'
  | 'colorGreenDark'
  | 'colorGreenDarker'
  | 'colorGreenLight'
  | 'colorGreenLighter'
  | 'colorGreenText'
  | 'colorIndigo'
  | 'colorIndigoDark'
  | 'colorIndigoDarker'
  | 'colorIndigoLight'
  | 'colorIndigoLighter'
  | 'colorIndigoText'
  | 'colorInk'
  | 'colorInkLight'
  | 'colorInkLighter'
  | 'colorInkLightest'
  | 'colorOrange'
  | 'colorOrangeDark'
  | 'colorOrangeDarker'
  | 'colorOrangeLight'
  | 'colorOrangeLighter'
  | 'colorOrangeText'
  | 'colorPurple'
  | 'colorPurpleDark'
  | 'colorPurpleDarker'
  | 'colorPurpleLight'
  | 'colorPurpleLighter'
  | 'colorPurpleText'
  | 'colorRed'
  | 'colorRedDark'
  | 'colorRedDarker'
  | 'colorRedLight'
  | 'colorRedLighter'
  | 'colorRedText'
  | 'colorSky'
  | 'colorSkyDark'
  | 'colorSkyLight'
  | 'colorSkyLighter'
  | 'colorTeal'
  | 'colorTealDark'
  | 'colorTealDarker'
  | 'colorTealLight'
  | 'colorTealLighter'
  | 'colorTealText'
  | 'colorWhite'
  | 'colorYellow'
  | 'colorYellowDark'
  | 'colorYellowDarker'
  | 'colorYellowLight'
  | 'colorYellowLighter';

export type VizPaletteColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'primaryProminent'
  | 'secondaryProminent'
  | 'tertiaryProminent'
  | 'quaternaryProminent'
  | 'pastComparison'
  | 'positive'
  | 'negative'
  | 'darkModePositive'
  | 'darkModeNegative'
  | 'colorGrayDark'
  | 'colorGrayLight'
  | 'colorWhiteTransparent';

export type StringLabelFormatter = (
  value: string,
  index?: number,
  data?: string[],
) => string;

export type NumberLabelFormatter = (value: number) => string;

export interface ActiveTooltip {
  x: number;
  y: number;
  index: number;
}

export interface GradientStop {
  offset: number;
  color: string;
}

export interface YAxisTick {
  value: number;
  formattedValue: string;
  yOffset: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type SparkChartData = number | null;

export type PathInterpolator = InterpolatorFn<readonly number[], string>;
export type NumberInterpolator = InterpolatorFn<readonly number[], number>;

export interface XAxisOptions {
  labelFormatter?: StringLabelFormatter;
  useMinimalLabels?: boolean;
}
export interface YAxisOptions {
  labelFormatter?: NumberLabelFormatter;
  integersOnly?: boolean;
}

// === Theme types === //
export enum BarMargin {
  Small = 0.05,
  Medium = 0.1,
  Large = 0.3,
  None = 0,
}

export interface GridTheme {
  showHorizontalLines: boolean;
  showVerticalLines?: boolean;
  horizontalOverflow: boolean;
  color: string;
  horizontalMargin: number;
}

export interface BarTheme {
  innerMargin: keyof typeof BarMargin;
  outerMargin: keyof typeof BarMargin;
  color: string | GradientStop[];
  hasRoundedCorners: boolean;
  /**
   * @deprecated This prop is experimental and not ready for general use. If you want to use this, come talk to us in #polaris-data-viz
   */
  zeroAsMinHeight: boolean;
}

export interface XAxisTheme {
  showTicks: boolean;
  labelColor: string;
}

export interface YAxisTheme {
  labelColor: string;
  backgroundColor: string;
}
export interface ChartContainerTheme {
  borderRadius: string;
  padding: string;
  backgroundColor: string;
}

export interface PartialTheme {
  chartContainer?: Partial<ChartContainerTheme>;
  bar?: Partial<BarTheme>;
  grid?: Partial<GridTheme>;
  xAxis?: Partial<XAxisTheme>;
  yAxis?: Partial<YAxisTheme>;
}
export interface Theme {
  chartContainer: ChartContainerTheme;
  bar: BarTheme;
  grid: GridTheme;
  xAxis: XAxisTheme;
  yAxis: YAxisTheme;
}
