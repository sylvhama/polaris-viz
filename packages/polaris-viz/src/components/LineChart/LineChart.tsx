import React, {useRef} from 'react';
import type {DataSeries} from '@shopify/polaris-viz-core';
import {isGradientType, uniqueId} from '@shopify/polaris-viz-core';
import {formatTooltipDataForLinearCharts} from 'utilities/format-tooltip-data-for-linear-charts';
import type {
  XAxisOptions,
  YAxisOptions,
} from '@shopify/polaris-viz-core/src/types';

import type {RenderTooltipContentData} from '../../components/shared/TooltipContent';
import {TooltipContent} from '../../components/shared/TooltipContent';
import {ChartContainer} from '../../components/ChartContainer';
import {useThemeSeriesColors} from '../../hooks/use-theme-series-colors';
import {changeColorOpacity, getAverageColor} from '../../utilities';
import {SkipLink} from '../SkipLink';
import {usePrefersReducedMotion, useTheme} from '../../hooks';

import {Chart} from './Chart';
import type {DataWithDefaults} from './types';

export interface LineChartProps {
  data: DataSeries[];

  emptyStateText?: string;
  isAnimated?: boolean;
  renderTooltipContent?: (data: RenderTooltipContentData) => React.ReactNode;
  showLegend?: boolean;
  skipLinkText?: string;
  theme?: string;
  xAxisOptions?: Partial<XAxisOptions>;
  yAxisOptions?: Partial<YAxisOptions>;
}

export function LineChart({
  data,
  renderTooltipContent,
  showLegend = true,
  skipLinkText,
  emptyStateText,
  isAnimated = false,
  xAxisOptions,
  yAxisOptions,
  theme,
}: LineChartProps) {
  const selectedTheme = useTheme(theme);
  const seriesColors = useThemeSeriesColors(data, selectedTheme);
  const {prefersReducedMotion} = usePrefersReducedMotion();

  const skipLinkAnchorId = useRef(uniqueId('lineChart'));

  const xAxisOptionsWithDefaults: Required<XAxisOptions> = {
    labelFormatter: (value: string) => value,
    xAxisLabels: [],
    hide: false,
    ...xAxisOptions,
  };

  const yAxisOptionsWithDefaults: Required<YAxisOptions> = {
    labelFormatter: (value: number) => value.toString(),
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

    const {formattedData, title} = formatTooltipDataForLinearCharts({
      data: tooltipData,
      xAxisOptions: xAxisOptionsWithDefaults,
      yAxisOptions: yAxisOptionsWithDefaults,
    });

    // const formattedData = tooltipData.map((data) => {
    //   return {
    //     ...data,
    //     data: data.data.map((values) => {
    //       return {
    //         ...values,
    //         value: yAxisOptions.labelFormatter(values.value),
    //       };
    //     }),
    //   };
    // });

    return <TooltipContent title={title} data={formattedData} theme={theme} />;
  }

  // I noticed that on charts that have several series, the accumulation
  // of semi-transparent areas turns quite solid.
  // maybe we should define then opacity based on the amount of series
  // on the chart? 🤔
  const getOpacityByDataLength = (dataLength: number) => {
    if (dataLength <= 4) {
      return 0.25;
    }

    if (dataLength <= 7) {
      return 0.1;
    }

    return 0;
  };

  const areaOpacity = getOpacityByDataLength(data.length);

  const dataWithDefaults: DataWithDefaults[] = data.map((series, index) => {
    const seriesColor = seriesColors[index];

    const areaColor = isGradientType(seriesColor)
      ? getAverageColor(
          seriesColor[0].color,
          seriesColor[seriesColor.length - 1].color,
        )
      : seriesColor;

    return {
      lineStyle: series.isComparison ? 'dotted' : selectedTheme.line.style,
      ...series,
      areaColor: series.isComparison
        ? undefined
        : changeColorOpacity(areaColor as string, areaOpacity),
      // We want to override the color, not set a default
      // so it has to come last
      color: series.isComparison
        ? seriesColors[index]
        : series.color ?? seriesColors[index],
    };
  });

  return (
    <React.Fragment>
      {skipLinkText == null ||
      skipLinkText.length === 0 ||
      data.length === 0 ? null : (
        <SkipLink anchorId={skipLinkAnchorId.current}>{skipLinkText}</SkipLink>
      )}
      <ChartContainer theme={theme}>
        <Chart
          data={dataWithDefaults}
          xAxisOptions={xAxisOptionsWithDefaults}
          yAxisOptions={yAxisOptionsWithDefaults}
          isAnimated={isAnimated && !prefersReducedMotion}
          renderTooltipContent={renderTooltip}
          showLegend={showLegend}
          emptyStateText={emptyStateText}
        />
      </ChartContainer>

      {skipLinkText == null || skipLinkText.length === 0 ? null : (
        <SkipLink.Anchor id={skipLinkAnchorId.current} />
      )}
    </React.Fragment>
  );
}
