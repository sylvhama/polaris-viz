import React, {useRef} from 'react';
import {uniqueId, ChartType, DataSeries} from '@shopify/polaris-viz-core';
import type {Direction} from '@shopify/polaris-viz-core';
import type {
  XAxisOptions,
  YAxisOptions,
} from '@shopify/polaris-viz-core/src/types';

import type {RenderTooltipContentData} from '../../components/shared/TooltipContent/types';
import {TooltipContent} from '../shared';
import {SkipLink} from '../SkipLink';
import {normalizeData} from '../../utilities';
import {HorizontalBarChart} from '../HorizontalBarChart';
import {VerticalBarChart} from '../VerticalBarChart';

import type {Annotation} from './types';
import {formatDataForTooltip} from './utilities';

export interface BarChartProps {
  data: DataSeries[];
  renderTooltipContent?(data: RenderTooltipContentData): React.ReactNode;

  annotations?: Annotation[];
  direction?: Direction;
  emptyStateText?: string;
  isAnimated?: boolean;
  showLegend?: boolean;
  skipLinkText?: string;
  theme?: string;
  type?: ChartType;
  xAxisOptions?: Partial<XAxisOptions>;
  yAxisOptions?: Partial<YAxisOptions>;
}

export function BarChart({
  annotations = [],
  data,
  direction = 'vertical',
  emptyStateText,
  isAnimated = false,
  renderTooltipContent,
  showLegend = true,
  skipLinkText,
  theme,
  type = 'default',
  xAxisOptions,
  yAxisOptions,
}: BarChartProps) {
  const skipLinkAnchorId = useRef(uniqueId('BarChart'));

  const emptyState = data.length === 0;
  const hideSkipLink =
    skipLinkText == null || skipLinkText.length === 0 || emptyState;

  const xAxisOptionsForChart: Required<XAxisOptions> = {
    labelFormatter: (value: string) => `${value}xx`,
    hide: false,
    ...xAxisOptions,
  };

  const yAxisOptionsForChart: Required<YAxisOptions> = {
    labelFormatter: (value: number) => `${value}yy`,
    integersOnly: false,
    ...yAxisOptions,
  };

  function renderTooltip(tooltipData: RenderTooltipContentData) {
    if (renderTooltipContent != null) {
      return renderTooltipContent({
        data: tooltipData.data,
        activeIndex: tooltipData.activeIndex,
        dataSeries: data,
      });
    }

    const {title, formattedData} = formatDataForTooltip({
      data: tooltipData,
      direction,
      xAxisOptions: xAxisOptionsForChart,
      yAxisOptions: yAxisOptionsForChart,
    });

    return <TooltipContent title={title} data={formattedData} theme={theme} />;
  }
  const annotationsLookupTable = normalizeData(annotations, 'dataSeriesIndex');

  return (
    <React.Fragment>
      {hideSkipLink ? null : (
        <SkipLink anchorId={skipLinkAnchorId.current}>{skipLinkText}</SkipLink>
      )}

      {direction === 'vertical' ? (
        <VerticalBarChart
          annotationsLookupTable={annotationsLookupTable}
          data={data}
          emptyStateText={emptyStateText}
          isAnimated={isAnimated}
          renderTooltipContent={renderTooltip}
          showLegend={showLegend}
          theme={theme}
          type={type}
          xAxisOptions={xAxisOptionsForChart}
          yAxisOptions={yAxisOptionsForChart}
        />
      ) : (
        <HorizontalBarChart
          annotationsLookupTable={annotationsLookupTable}
          data={data}
          isAnimated={isAnimated}
          renderTooltipContent={renderTooltip}
          showLegend={showLegend}
          theme={theme}
          type={type}
          xAxisOptions={xAxisOptionsForChart}
          yAxisOptions={yAxisOptionsForChart}
        />
      )}

      {hideSkipLink ? null : <SkipLink.Anchor id={skipLinkAnchorId.current} />}
    </React.Fragment>
  );
}
