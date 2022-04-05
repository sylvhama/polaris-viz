import {useContext} from 'react';

import {estimateStringWidth} from '../../../../utilities';
import {ChartContext} from '../../../ChartContainer';
import type {TooltipData} from '../types';

export function useGetLongestLabelFromData(data: TooltipData[] = []) {
  const {characterWidths} = useContext(ChartContext);

  const keys: string[] = [];
  const values: string[] = [];

  data.forEach(({name, data}) => {
    if (name != null) {
      keys.push(name);
    }

    data.forEach(({key, value}) => {
      keys.push(`${key}`);
      values.push(`${value}`);
    });
  });

  return {
    keyWidth: getLongestString(keys.flat(), characterWidths),
    valueWidth: getLongestString(values.flat(), characterWidths),
  };
}

function getLongestString(array, characterWidths) {
  return array.reduce((prev, cur) => {
    const width = estimateStringWidth(cur, characterWidths);

    if (prev < width) {
      return width;
    }

    return prev;
  }, 0);
}
