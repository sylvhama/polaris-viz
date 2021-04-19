import React, {useState, useMemo, useRef, useCallback} from 'react';
import throttle from 'lodash.throttle';
import {line, curveMonotoneX} from 'd3-shape';

import {useLinearXAxisDetails, useLinearXScale} from '../../hooks';
import {
  SMALL_SCREEN,
  SMALL_FONT_SIZE,
  FONT_SIZE,
  SPACING_TIGHT,
  Margin,
  CROSSHAIR_WIDTH,
} from '../../constants';
import {VisuallyHiddenRows} from '../VisuallyHiddenRows';
import {LinearXAxis} from '../LinearXAxis';
import {YAxis} from '../YAxis';
import {Point} from '../Point';
import {eventPoint, uniqueId} from '../../utilities';
import {Crosshair} from '../Crosshair';
import {
  StringLabelFormatter,
  NumberLabelFormatter,
  ActiveTooltip,
} from '../../types';
import {TooltipContainer} from '../TooltipContainer';

import {Series, RenderTooltipContentData, TooltipData} from './types';
import {useYScale, useLineChartAnimations} from './hooks';
import {Line, GradientArea} from './components';
import styles from './Chart.scss';

interface Props {
  series: Required<Series>[];
  xAxisLabels: string[];
  formatXAxisLabel: StringLabelFormatter;
  formatYAxisLabel: NumberLabelFormatter;
  dimensions: DOMRect;
  renderTooltipContent: (data: RenderTooltipContentData) => React.ReactNode;
  hideXAxisLabels: boolean;
  hasSpline: boolean;
  emptyStateText?: string;
  isAnimated: boolean;
}

export function Chart({
  series,
  dimensions,
  xAxisLabels,
  formatXAxisLabel,
  formatYAxisLabel,
  renderTooltipContent,
  hideXAxisLabels,
  hasSpline,
  emptyStateText,
  isAnimated,
}: Props) {
  const [tooltipDetails, setTooltipDetails] = useState<ActiveTooltip | null>(
    null,
  );

  const tooltipId = useRef(uniqueId('lineChart'));

  const fontSize =
    dimensions.width < SMALL_SCREEN ? SMALL_FONT_SIZE : FONT_SIZE;

  const emptyState = series.length === 0;

  const {ticks: initialTicks} = useYScale({
    fontSize,
    drawableHeight: dimensions.height - Margin.Top,
    series,
    formatYAxisLabel,
  });

  const xAxisDetails = useLinearXAxisDetails({
    series,
    fontSize,
    chartDimensions: dimensions,
    formatXAxisLabel,
    initialTicks,
    xAxisLabels: xAxisLabels == null || hideXAxisLabels ? [] : xAxisLabels,
  });

  const marginBottom =
    xAxisLabels == null
      ? SPACING_TIGHT
      : Number(Margin.Bottom) + xAxisDetails.maxXLabelHeight;

  const drawableHeight = dimensions.height - Margin.Top - marginBottom;

  const formattedLabels = useMemo(() => xAxisLabels.map(formatXAxisLabel), [
    formatXAxisLabel,
    xAxisLabels,
  ]);

  const {axisMargin, ticks, yScale} = useYScale({
    fontSize,
    drawableHeight,
    series,
    formatYAxisLabel,
  });

  const handleFocus = useCallback(
    (details: ActiveTooltip | null) => {
      if (details == null) {
        setTooltipDetails(null);
      } else {
        const {x, y, index} = details;
        setTooltipDetails({index, y, x: x + axisMargin});
      }
    },
    [axisMargin],
  );

  const tooltipMarkup = useMemo(() => {
    if (tooltipDetails == null) {
      return null;
    }

    const data = series.reduce<TooltipData[]>(
      (accumulator, {data, name, color, lineStyle}) => {
        const currentDataPoint = data[tooltipDetails.index];
        if (currentDataPoint != null) {
          accumulator.push({
            point: {
              label: currentDataPoint.label,
              value: currentDataPoint.rawValue,
            },
            name,
            color,
            lineStyle,
          });
        }
        return accumulator;
      },
      [],
    );

    if (data == null) {
      return null;
    }

    return renderTooltipContent({data});
  }, [renderTooltipContent, series, tooltipDetails]);

  const reversedSeries = useMemo(() => series.slice().reverse(), [series]);

  const drawableWidth =
    axisMargin == null ? null : dimensions.width - Margin.Right - axisMargin;

  const longestSeriesIndex = useMemo(
    () =>
      reversedSeries.reduce((maxIndex, currentSeries, currentIndex) => {
        return reversedSeries[maxIndex].data.length < currentSeries.data.length
          ? currentIndex
          : maxIndex;
      }, 0),
    [reversedSeries],
  );

  const longestSeriesLength = reversedSeries[longestSeriesIndex]
    ? reversedSeries[longestSeriesIndex].data.length - 1
    : 0;

  const {xScale} = useLinearXScale({
    drawableWidth,
    longestSeriesLength,
  });

  const lineGenerator = useMemo(() => {
    const generator = line<{rawValue: number}>()
      .x((_, index) => (xScale === null ? 0 : xScale(index)))
      .y(({rawValue}) => yScale(rawValue));

    if (hasSpline) {
      generator.curve(curveMonotoneX);
    }
    return generator;
  }, [hasSpline, xScale, yScale]);

  const activeIndex =
    tooltipDetails === null || tooltipDetails.index == null
      ? null
      : tooltipDetails.index;

  const animatePoints = isAnimated && longestSeriesLength < 1000;

  const {animatedCoordinates} = useLineChartAnimations({
    series: reversedSeries,
    lineGenerator,
    activeIndex,
    xScale,
    isAnimated: animatePoints,
  });

  if (xScale == null || drawableWidth == null || axisMargin == null) {
    return null;
  }

  const handleMouseInteraction = throttle(
    (
      event:
        | React.MouseEvent<SVGSVGElement>
        | React.TouchEvent<SVGSVGElement>
        | null,
    ) => {
      handleInteraction(event);
    },
    50,
    {leading: true},
  );

  function handleInteraction(
    event:
      | React.MouseEvent<SVGSVGElement>
      | React.TouchEvent<SVGSVGElement>
      | null,
  ) {
    if (axisMargin == null || xScale == null) {
      return;
    }

    if (event === null) {
      setTooltipDetails(null);
      return;
    }

    const point = eventPoint(event);

    if (point == null) {
      return;
    }

    const {svgX, svgY} = point;
    if (svgX < axisMargin) {
      return;
    }

    const closestIndex = Math.round(xScale.invert(svgX - axisMargin));
    const activeIndex = Math.min(
      reversedSeries[longestSeriesIndex].data.length - 1,
      closestIndex,
    );

    setTooltipDetails({
      x: svgX,
      y: svgY,
      index: activeIndex,
    });
  }

  return (
    <div className={styles.Container}>
      <svg
        role={emptyState ? 'img' : 'table'}
        width="100%"
        height="100%"
        onMouseMove={(event) => {
          event.persist();
          handleMouseInteraction(event);
        }}
        onTouchMove={(event) => {
          event.persist();
          handleInteraction(event);
        }}
        onTouchEnd={() => handleInteraction(null)}
        onMouseLeave={() => handleMouseInteraction(null)}
        aria-label={emptyState ? emptyStateText : undefined}
      >
        <g
          transform={`translate(${axisMargin},${dimensions.height -
            marginBottom})`}
        >
          <LinearXAxis
            xAxisDetails={xAxisDetails}
            xScale={xScale}
            labels={hideXAxisLabels ? null : formattedLabels}
            drawableWidth={drawableWidth}
            fontSize={fontSize}
            drawableHeight={drawableHeight}
            ariaHidden
          />
        </g>

        <g transform={`translate(${axisMargin},${Margin.Top})`}>
          <YAxis
            ticks={ticks}
            drawableWidth={drawableWidth}
            fontSize={fontSize}
          />
        </g>

        {emptyState || tooltipDetails == null ? null : (
          <g transform={`translate(${axisMargin},${Margin.Top})`}>
            <Crosshair
              x={
                animatePoints &&
                animatedCoordinates !== null &&
                animatedCoordinates[longestSeriesIndex] !== null
                  ? animatedCoordinates[longestSeriesIndex].interpolate(
                      (coord: SVGPoint) => coord.x - CROSSHAIR_WIDTH / 2,
                    )
                  : xScale(activeIndex === null ? 0 : activeIndex) -
                    CROSSHAIR_WIDTH / 2
              }
              height={drawableHeight}
              opacity={1}
            />
          </g>
        )}

        {emptyState ? null : (
          <VisuallyHiddenRows
            formatYAxisLabel={formatYAxisLabel}
            xAxisLabels={formattedLabels}
            series={series}
          />
        )}

        <g transform={`translate(${axisMargin},${Margin.Top})`}>
          {reversedSeries.map((singleSeries, index) => {
            const {data, name, showArea, color} = singleSeries;
            const isFirstLine = index === series.length - 1;

            return (
              <React.Fragment key={`${name}-${index}`}>
                <Line
                  series={singleSeries}
                  isAnimated={isAnimated}
                  index={index}
                  lineGenerator={lineGenerator}
                />
                <Point
                  color={color}
                  cx={
                    animatedCoordinates === null
                      ? 0
                      : animatedCoordinates[longestSeriesIndex].interpolate(
                          (coord: SVGPoint) => coord.x,
                        )
                  }
                  cy={
                    animatedCoordinates === null
                      ? 0
                      : animatedCoordinates[index].interpolate(
                          (coord: SVGPoint) => coord.y,
                        )
                  }
                  active={tooltipDetails !== null}
                  index={index}
                  tabIndex={-1}
                  isAnimated={animatePoints}
                  visuallyHidden={
                    !animatePoints ||
                    animatedCoordinates === null ||
                    tooltipDetails === null ||
                    Number(activeIndex) >= data.length
                  }
                  ariaHidden
                />

                {data.map(({rawValue}, dataIndex) => {
                  return (
                    <Point
                      key={`${name}-${index}-${dataIndex}`}
                      color={color}
                      cx={xScale(dataIndex)}
                      cy={yScale(rawValue)}
                      active={activeIndex === dataIndex}
                      onFocus={handleFocus}
                      index={dataIndex}
                      tabIndex={isFirstLine ? 0 : -1}
                      ariaLabelledby={tooltipId.current}
                      isAnimated={false}
                      ariaHidden={false}
                      visuallyHidden={animatePoints || tooltipDetails === null}
                    />
                  );
                })}

                {showArea ? (
                  <GradientArea
                    series={singleSeries}
                    yScale={yScale}
                    xScale={xScale}
                    hasSpline={hasSpline}
                    isAnimated={isAnimated}
                    index={index}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </g>
      </svg>

      {tooltipDetails === null || emptyState ? null : (
        <TooltipContainer
          activePointIndex={tooltipDetails.index}
          currentX={tooltipDetails.x}
          currentY={tooltipDetails.y}
          chartDimensions={dimensions}
          margin={Margin}
          id={tooltipId.current}
        >
          {tooltipMarkup}
        </TooltipContainer>
      )}
    </div>
  );
}
