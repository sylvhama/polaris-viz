import {ReactNode, useCallback} from 'react';
import type {RenderTooltipContentData} from 'components/shared/TooltipContent/types';

import type {DataWithDefaults} from '../components/LineChart/types';
import type {TooltipData} from '../components/shared/TooltipContent';

interface Props {
  data: DataWithDefaults[];
  renderTooltipContent: (data: RenderTooltipContentData) => ReactNode;
}

export function useLineChartTooltipContent({
  data,
  renderTooltipContent,
}: Props) {
  return useCallback(
    (activeIndex: number) => {
      if (activeIndex === -1) {
        return null;
      }

      const tooltipData: TooltipData[] = [
        {
          shape: 'Line',
          data: [],
        },
      ];

      data.forEach(({name, data: seriesData, color, lineStyle}) => {
        const {value} = seriesData[activeIndex];

        tooltipData[0].data.push({
          key: `${name}`,
          value,
          color: color!,
          isComparison: lineStyle === 'dotted',
        });
      });

      return renderTooltipContent({
        data: tooltipData,
        activeIndex,
        title: `${data[0].data[activeIndex].key}`,
      });
    },
    [data, renderTooltipContent],
  );
}
