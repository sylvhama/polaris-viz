import React, {ReactNode} from 'react';
import type {DataSeries, ChartType} from '@shopify/polaris-viz-core';
import type {
  XAxisOptions,
  YAxisOptions,
} from '@shopify/polaris-viz-core/src/types';

import type {RenderTooltipContentData} from '../shared/TooltipContent';
import type {AnnotationLookupTable} from '../BarChart';
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
        type={type}
        xAxisOptions={xAxisOptions}
        yAxisOptions={yAxisOptions}
      />
    </ChartContainer>
  );
}
