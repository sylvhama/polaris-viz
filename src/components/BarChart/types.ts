import type {GradientStop} from 'types';

export interface BarChartData {
  barColor?: string | GradientStop;
  label: string;
  rawValue: number;
}

export interface RenderTooltipContentData {
  label: string;
  value: number;
  annotation?: Annotation;
}
export interface Annotation {
  dataIndex: number;
  width: number;
  color: string;
  tooltipData?: {
    label: string;
    value: string;
  };
  ariaLabel?: string;
  xOffset?: number;
}

export interface AnnotationLookupTable {
  [key: number]: Annotation;
}
