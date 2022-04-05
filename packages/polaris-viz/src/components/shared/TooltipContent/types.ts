import type {Color, DataPoint, DataSeries} from '@shopify/polaris-viz-core';
import type {Shape} from '@shopify/polaris-viz-core/src/types';

export interface TooltipData {
  shape: Shape;
  data: {
    key: string;
    value: string;
    color: Color;
    isComparison?: boolean;
  }[];
  name?: string;
}

interface RenderTooltipDataPoint extends DataPoint {
  color: Color;
  isComparison?: boolean;
}

export interface RenderTooltipContentData {
  data: {
    shape: Shape;
    data: RenderTooltipDataPoint[];
    name?: string;
  }[];
  activeIndex: number;
  title?: string;
  dataSeries: DataSeries[];
}
