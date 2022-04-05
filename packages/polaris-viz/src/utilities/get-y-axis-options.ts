import type {YAxisOptions} from '@shopify/polaris-viz-core/src/types';

import {filterObject} from './filter-object';

export function getYAxisOptions(
  yAxisOptions: Partial<YAxisOptions> = {},
): Required<YAxisOptions> {
  const yAxisOptionsFiltered = filterObject(yAxisOptions);

  return {
    labelFormatter: (value: number) => `${value}`,
    integersOnly: false,
    ...yAxisOptionsFiltered,
  };
}
