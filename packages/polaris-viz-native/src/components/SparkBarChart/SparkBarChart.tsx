import React from 'react';
import {View} from 'react-native';
import {useTransition} from '@react-spring/native';
import {
  usePolarisVizContext,
  SparkBarChartProps,
  ANIMATION_MARGIN,
  SparkBarSeries,
  DEFAULT_THEME_NAME,
} from '@shopify/polaris-viz-core';

import {usePrefersReducedMotion} from '../../hooks';
import {ChartContainer} from '../ChartContainer';

export function SparkBarChart({
  data,
  accessibilityLabel,
  isAnimated = false,
  dataOffsetRight = 0,
  dataOffsetLeft = 0,
  theme = DEFAULT_THEME_NAME,
}: SparkBarChartProps) {
  return (
    <ChartContainer theme={theme} sparkChart>
      <Chart
        data={data}
        accessibilityLabel={accessibilityLabel}
        isAnimated={isAnimated}
        dataOffsetLeft={dataOffsetLeft}
        dataOffsetRight={dataOffsetRight}
      />
    </ChartContainer>
  );
}

function Chart({
  data,
  dimensions,
  accessibilityLabel,
  dataOffsetRight = 0,
  dataOffsetLeft = 0,
  theme = DEFAULT_THEME_NAME,
  isAnimated,
}: SparkBarChartProps) {
  const {
    components: {Svg},
  } = usePolarisVizContext();

  const {prefersReducedMotion} = usePrefersReducedMotion();
  const {width, height} = dimensions ?? {width: 0, height: 0};
  const shouldAnimate = Boolean(!prefersReducedMotion && isAnimated);

  const viewboxHeight = height + ANIMATION_MARGIN * 2;

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg
        viewBox={`0 -${ANIMATION_MARGIN} ${width} ${viewboxHeight}`}
        height={height}
        width={width}
        transform={[{translateY: -1 * ANIMATION_MARGIN}] as any}
      >
        <SparkBarSeries
          data={data}
          dataOffsetLeft={dataOffsetLeft}
          dataOffsetRight={dataOffsetRight}
          height={height}
          shouldAnimate={shouldAnimate}
          theme={theme}
          useTransition={useTransition}
          width={width}
        />
      </Svg>
    </View>
  );
}
