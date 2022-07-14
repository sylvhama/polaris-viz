import React, {useEffect, useRef, useState} from 'react';
import type {
  XAxisOptions,
  YAxisOptions,
  ChartProps,
  WithRequired,
} from '@shopify/polaris-viz-core';
import {
  uniqueId,
  ChartState,
  DEFAULT_CHART_PROPS,
} from '@shopify/polaris-viz-core';
// eslint-disable-next-line import/no-webpack-loader-syntax
import NormalizerWorker from 'workerize-loader!../../workers/normalizer.worker';

import {getLineChartDataWithDefaults} from '../../utilities/getLineChartDataWithDefaults';
import {ChartContainer} from '../../components/ChartContainer';
import {ChartSkeleton} from '../../components/ChartSkeleton';
import {useThemeSeriesColors} from '../../hooks/useThemeSeriesColors';
import {
  getXAxisOptionsWithDefaults,
  getYAxisOptionsWithDefaults,
} from '../../utilities';
import {SkipLink} from '../SkipLink';
import {useRenderTooltipContent, useTheme} from '../../hooks';
import type {
  Annotation,
  AnnotationLookupTable,
  TooltipOptions,
} from '../../types';

import {Chart} from './Chart';

export type LineChartProps = {
  annotations?: Annotation[];
  state?: ChartState;
  errorText?: string;
  emptyStateText?: string;
  tooltipOptions?: TooltipOptions;
  showLegend?: boolean;
  skipLinkText?: string;
  xAxisOptions?: Partial<XAxisOptions>;
  yAxisOptions?: Partial<YAxisOptions>;
} & ChartProps;

export function LineChart(props: LineChartProps) {
  const {
    annotations = [],
    data,
    state,
    errorText,
    tooltipOptions,
    showLegend = true,
    skipLinkText,
    emptyStateText,
    isAnimated,
    xAxisOptions,
    yAxisOptions,
    theme,
  }: WithRequired<LineChartProps, 'theme'> = {
    ...DEFAULT_CHART_PROPS,
    ...props,
  };

  const [annotationsLookupTable, setAnnotationsLookupTable] = useState({});

  useEffect(() => {
    const workerInstance = new NormalizerWorker();

    workerInstance
      .normalize(annotations, 'startKey')
      .then((message: AnnotationLookupTable) => {
        setAnnotationsLookupTable(message);
      })
      .catch((error: any) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, [annotations]);

  const selectedTheme = useTheme(theme);
  const seriesColors = useThemeSeriesColors(data, selectedTheme);

  const skipLinkAnchorId = useRef(uniqueId('lineChart'));

  const xAxisOptionsWithDefaults = getXAxisOptionsWithDefaults(xAxisOptions);
  const yAxisOptionsWithDefaults = getYAxisOptionsWithDefaults(yAxisOptions);

  const renderTooltip = useRenderTooltipContent({tooltipOptions, theme, data});
  // const annotationsLookupTable = normalizeData(annotations, 'startKey');

  const dataWithDefaults = getLineChartDataWithDefaults(data, seriesColors);

  return (
    <React.Fragment>
      {skipLinkText == null ||
      skipLinkText.length === 0 ||
      data.length === 0 ? null : (
        <SkipLink anchorId={skipLinkAnchorId.current}>{skipLinkText}</SkipLink>
      )}
      <ChartContainer data={data} theme={theme} isAnimated={isAnimated}>
        {state !== ChartState.Success ? (
          <ChartSkeleton state={state} errorText={errorText} theme={theme} />
        ) : (
          <Chart
            annotationsLookupTable={annotationsLookupTable}
            data={dataWithDefaults}
            xAxisOptions={xAxisOptionsWithDefaults}
            yAxisOptions={yAxisOptionsWithDefaults}
            renderTooltipContent={renderTooltip}
            showLegend={showLegend}
            emptyStateText={emptyStateText}
          />
        )}
      </ChartContainer>

      {skipLinkText == null || skipLinkText.length === 0 ? null : (
        <SkipLink.Anchor id={skipLinkAnchorId.current} />
      )}
    </React.Fragment>
  );
}
