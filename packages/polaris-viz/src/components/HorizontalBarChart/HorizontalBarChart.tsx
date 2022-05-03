import React, {ReactNode} from 'react';
import type {
  DataSeries,
  ChartType,
  XAxisOptions,
  YAxisOptions,
} from '@shopify/polaris-viz-core';

import type {
  AnnotationLookupTable,
  RenderTooltipContentData,
} from '../../types';
import {ChartContainer} from '../../components/ChartContainer';
import {usePrefersReducedMotion} from '../../hooks';

import {Chart} from './Chart';

export interface HorizontalBarChartProps {
  data: DataSeries[];
  renderTooltipContent: (data: RenderTooltipContentData) => ReactNode;
  showLegend: boolean;
  xAxisOptions: Required<XAxisOptions>;
  yAxisOptions: Required<YAxisOptions>;
  annotationsLookupTable?: AnnotationLookupTable;
  isAnimated?: boolean;
  theme?: string;
  type?: ChartType;
}

export function HorizontalBarChart({
  annotationsLookupTable = {},
  data,
  isAnimated = true,
  renderTooltipContent,
  showLegend,
  theme,
  type = 'default',
  xAxisOptions,
  yAxisOptions,
}: HorizontalBarChartProps) {
  const {prefersReducedMotion} = usePrefersReducedMotion();

  return (
    <ChartContainer theme={theme}>
      <Chart
        annotationsLookupTable={annotationsLookupTable}
        data={data}
        isAnimated={isAnimated && !prefersReducedMotion}
        renderTooltipContent={renderTooltipContent}
        showLegend={showLegend}
        theme={theme}
        type={type}
        xAxisOptions={xAxisOptions}
        yAxisOptions={yAxisOptions}
      />
    </ChartContainer>
  );
}
