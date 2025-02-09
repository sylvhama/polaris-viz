import type {DataSeries} from '@shopify/polaris-viz-core';

import {EMPTY_STATE_CHART_MIN, EMPTY_STATE_CHART_MAX} from '../../../constants';

export function yAxisMinMax(series: DataSeries[]) {
  if (series.length === 0) {
    return {minY: EMPTY_STATE_CHART_MIN, maxY: EMPTY_STATE_CHART_MAX};
  }

  let minY = Infinity;
  let maxY = -Infinity;

  series.forEach(({data}) => {
    data.forEach(({value}) => {
      if (value == null) {
        return;
      }

      minY = Math.min(minY, value);
      maxY = Math.max(maxY, value);
    });
  });

  return {minY, maxY};
}
