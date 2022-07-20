import {useMemo, useState} from 'react';
import {
  Color,
  Dimensions,
  DataGroup,
  Direction,
  LEGENDS_TOP_MARGIN,
} from '@shopify/polaris-viz-core';

import type {LegendData} from '../../../types';

function getAlteredDimensions(
  dimensions: Dimensions | undefined,
  legendsHeight: number,
  legendsWidth: number,
  direction: Direction,
) {
  const {width, height} = dimensions ?? {width: 0, height: 0};
  const isHorizontal = direction === 'horizontal';

  return {
    height: isHorizontal ? height - legendsHeight - LEGENDS_TOP_MARGIN : height,
    width: !isHorizontal ? width - legendsWidth : width,
  };
}

export interface Props {
  showLegend: boolean;
  data: DataGroup[];
  colors?: Color[];
  dimensions?: Dimensions;
  direction?: Direction;
}

export function useLegend({
  colors = [],
  data,
  dimensions = {height: 0, width: 0},
  showLegend,
  direction = 'horizontal',
}: Props) {
  const [legendDimensions, setLegendDimensions] = useState({
    height: 0,
    width: 0,
  });

  const legend: LegendData[] = useMemo(() => {
    if (showLegend === false) {
      return [];
    }

    const legends = data.map(({series, shape}) => {
      return series.map(({name, color, isComparison}) => {
        return {
          name: name ?? '',
          color,
          shape,
          isComparison,
        };
      });
    });

    return legends.flat().map(({color, ...rest}, index) => {
      return {
        ...rest,
        color: color ?? colors[index],
      };
    });
  }, [colors, data, showLegend]);

  const {height, width} = useMemo(() => {
    if (showLegend === false) {
      return dimensions;
    }

    return getAlteredDimensions(
      dimensions,
      legendDimensions.height,
      legendDimensions.width,
      direction,
    );
  }, [
    showLegend,
    dimensions,
    legendDimensions.height,
    legendDimensions.width,
    direction,
  ]);

  return {
    legend,
    height,
    width,
    setLegendDimensions,
    isLegendMounted:
      showLegend &&
      (legendDimensions.height !== 0 || legendDimensions.width !== 0),
  };
}
