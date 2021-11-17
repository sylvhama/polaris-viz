import React, {ReactNode, useCallback, useMemo, useState} from 'react';

import {GradientDefs, HorizontalGroup} from '../shared';
import {
  useDataForHorizontalChart,
  useHorizontalBarSizes,
  useHorizontalSeriesColors,
  useHorizontalTransitions,
  useHorizontalXScale,
  useTheme,
} from '../../hooks';
import {
  XMLNS,
  BarChartMargin as Margin,
  HORIZONTAL_BAR_GROUP_DELAY,
} from '../../constants';
import {
  eventPointNative,
  formatDataForHorizontalBarChart,
  getHighestSumForStacked,
} from '../../utilities';
import {ChartType, DataSeries, DataType, Dimensions} from '../../types';
import {
  TOOLTIP_POSITION_DEFAULT_RETURN,
  TooltipPosition,
  TooltipPositionParams,
  TooltipWrapper,
} from '../TooltipWrapper';
import type {TooltipData} from '../TooltipContent';

import {getAlteredHorizontalBarPosition} from './utilities';
import {VerticalGridLines, XAxisLabels} from './components';
import type {RenderTooltipContentData, XAxisOptions} from './types';
import styles from './Chart.scss';

interface ChartProps {
  isAnimated: boolean;
  renderTooltipContent: (data: RenderTooltipContentData) => ReactNode;
  series: DataSeries[];
  type: ChartType;
  xAxisOptions: Required<XAxisOptions>;
  dimensions?: Dimensions;
  theme?: string;
}

export function Chart({
  dimensions,
  isAnimated,
  renderTooltipContent,
  series,
  theme,
  type,
  xAxisOptions,
}: ChartProps) {
  const formattedSeries = useMemo(() => {
    return formatDataForHorizontalBarChart(series);
  }, [series]);

  const selectedTheme = useTheme(theme);
  const {labelFormatter} = xAxisOptions;

  const isStacked = type === 'stacked';

  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);

  const {width, height} = dimensions ?? {width: 0, height: 0};

  const {longestSeriesCount, seriesColors} = useHorizontalSeriesColors({
    formattedSeries,
    series,
    theme,
  });

  const {allNumbers, longestLabel, areAllNegative} = useDataForHorizontalChart({
    series: formattedSeries,
    isSimple: false,
    isStacked,
    labelFormatter,
  });

  const highestValueForSeries = useMemo(() => {
    const maxes: number[] = [];

    formattedSeries.forEach(({data}) => {
      const values = data.map(({value}) => value);
      const max = areAllNegative ? Math.min(...values) : Math.max(...values);

      maxes.push(max);
    });

    return maxes;
  }, [formattedSeries, areAllNegative]);

  const highestSumForStackedGroup = useMemo(() => {
    if (!isStacked) {
      return 0;
    }

    return getHighestSumForStacked(formattedSeries);
  }, [formattedSeries, isStacked]);

  const {xScale, xScaleStacked, ticks, ticksStacked} = useHorizontalXScale({
    allNumbers,
    highestSumForStackedGroup,
    isStacked,
    maxWidth: width - longestLabel.negative - longestLabel.positive,
    longestSeriesCount,
  });

  const {
    bandwidth,
    barHeight,
    chartHeight,
    groupBarsAreaHeight,
    groupHeight,
    tallestXAxisLabel,
  } = useHorizontalBarSizes({
    chartDimensions: {width, height},
    isSimple: xAxisOptions.hide,
    isStacked,
    labelFormatter,
    seriesLength: formattedSeries.length,
    singleBarCount: longestSeriesCount,
    ticks: isStacked ? ticksStacked : ticks,
  });

  const getAriaLabel = useCallback(
    (label: string, seriesIndex: number) => {
      const ariaSeries = formattedSeries[seriesIndex].data
        .map(({value, key}) => {
          return `${key} ${labelFormatter(value)}`;
        })
        .join(', ');

      return `${label}: ${ariaSeries}`;
    },
    [formattedSeries, labelFormatter],
  );

  const getTooltipMarkup = useCallback(
    (activeIndex: number) => {
      if (activeIndex === -1) {
        return null;
      }

      const data: TooltipData[] = formattedSeries[activeIndex].data.map(
        ({value, key}, index) => {
          return {
            label: `${key}`,
            value: `${value}`,
            color: formattedSeries[activeIndex].color ?? seriesColors[index],
          };
        },
      );

      return renderTooltipContent({data});
    },
    [formattedSeries, seriesColors, renderTooltipContent],
  );

  const {transitions, isFirstRender} = useHorizontalTransitions({
    series: formattedSeries,
    groupHeight,
    isAnimated,
  });

  const zeroPosition = longestLabel.negative + xScale(0);

  return (
    <div
      className={styles.ChartContainer}
      style={{
        width,
        height,
      }}
    >
      <svg
        className={styles.SVG}
        ref={setSvgRef}
        role="list"
        viewBox={`0 0 ${width} ${height}`}
        xmlns={XMLNS}
      >
        {xAxisOptions.hide === true ? null : (
          <React.Fragment>
            <VerticalGridLines
              chartHeight={chartHeight}
              stroke={selectedTheme.grid.color}
              ticks={isStacked ? ticksStacked : ticks}
              xScale={isStacked ? xScaleStacked! : xScale}
            />
            <XAxisLabels
              bandwidth={bandwidth}
              chartHeight={chartHeight}
              color={selectedTheme.xAxis.labelColor}
              labelFormatter={labelFormatter}
              tallestXAxisLabel={tallestXAxisLabel}
              ticks={isStacked ? ticksStacked : ticks}
              xScale={isStacked ? xScaleStacked! : xScale}
            />
          </React.Fragment>
        )}

        <GradientDefs seriesColors={seriesColors} theme={theme} width={width} />

        {transitions(({opacity, transform}, item, _transition, index) => {
          const name = item.series.name ?? '';
          const ariaLabel = getAriaLabel(name, item.index);

          if (formattedSeries[index] == null) {
            return null;
          }

          const animationDelay =
            isFirstRender && isAnimated
              ? (HORIZONTAL_BAR_GROUP_DELAY * index) / formattedSeries.length
              : 0;

          return (
            <HorizontalGroup
              animationDelay={animationDelay}
              areAllNegative={areAllNegative}
              ariaLabel={ariaLabel}
              barHeight={barHeight}
              index={index}
              isAnimated={isAnimated}
              isSimple={false}
              isStacked={isStacked}
              labelFormatter={labelFormatter}
              name={name}
              opacity={opacity}
              series={item.series}
              theme={theme}
              transform={transform}
              xScale={xScale}
              xScaleStacked={xScaleStacked}
              zeroPosition={zeroPosition}
            />
          );
        })}
      </svg>
      <TooltipWrapper
        bandwidth={groupBarsAreaHeight}
        chartDimensions={{width, height}}
        focusElementDataType={DataType.Bar}
        getAlteredPosition={getAlteredHorizontalBarPosition}
        getMarkup={getTooltipMarkup}
        getPosition={getTooltipPosition}
        margin={Margin}
        onIndexChange={onIndexChange}
        parentRef={svgRef}
      />
    </div>
  );

  function onIndexChange(index: number) {
    const barElements = svgRef?.querySelectorAll(
      `[data-type=${DataType.BarGroup}]`,
    );

    if (!barElements) {
      return;
    }

    if (index == null) {
      barElements.forEach((element: SVGPathElement) => {
        element.style.opacity = '1';
      });
    } else {
      barElements.forEach((el: SVGPathElement) => {
        if (el.dataset.id === `${DataType.BarGroup}-${index}`) {
          el.style.opacity = '1';
        } else {
          el.style.opacity = '0.5';
        }
      });
    }
  }

  function formatPositionForTooltip(index: number): TooltipPosition {
    if (isStacked && xScaleStacked) {
      const x = formattedSeries[index].data.reduce((prev, cur) => {
        return prev + xScaleStacked(cur.value);
      }, 0);

      return {
        x,
        y: groupHeight * index,
        activeIndex: index,
      };
    }

    const highestValue = highestValueForSeries[index];
    const x = xScale(highestValue);

    return {
      x: highestValue < 0 ? -x : x,
      y: groupHeight * index,
      activeIndex: index,
    };
  }

  function getTooltipPosition({
    event,
    index,
    eventType,
  }: TooltipPositionParams): TooltipPosition {
    if (eventType === 'mouse' && event) {
      const point = eventPointNative(event);

      if (point == null) {
        return TOOLTIP_POSITION_DEFAULT_RETURN;
      }

      const {svgY} = point;

      const currentPoint = svgY - 0;
      const currentIndex = Math.floor(currentPoint / groupHeight);

      if (currentIndex < 0 || currentIndex > formattedSeries.length - 1) {
        return TOOLTIP_POSITION_DEFAULT_RETURN;
      }

      return formatPositionForTooltip(currentIndex);
    } else if (index != null) {
      return formatPositionForTooltip(index);
    }

    return TOOLTIP_POSITION_DEFAULT_RETURN;
  }
}
