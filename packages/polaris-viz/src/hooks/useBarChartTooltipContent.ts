import type {AnnotationLookupTable} from 'components/BarChart';
import {ReactNode, useCallback} from 'react';
import type {Color, DataSeries} from '@shopify/polaris-viz-core';

import type {
  RenderTooltipContentData,
  TooltipData,
} from '../components/shared/TooltipContent';

interface Props {
  annotationsLookupTable: AnnotationLookupTable;
  data: DataSeries[];
  seriesColors: Color[];
  renderTooltipContent: (data: RenderTooltipContentData) => ReactNode;
}

export function useBarChartTooltipContent({
  annotationsLookupTable,
  data,
  renderTooltipContent,
  seriesColors,
}: Props) {
  return useCallback(
    (activeIndex: number) => {
      if (activeIndex === -1) {
        return null;
      }

      const tooltipData: TooltipData[] = [
        {
          shape: 'Bar',
          data: [],
        },
      ];
      const annotation = annotationsLookupTable[activeIndex];

      data.forEach(({name, data: seriesData, color}, index) => {
        const {value} = seriesData[activeIndex];

        tooltipData[0].data.push({
          key: `${name}`,
          value,
          color: color ?? seriesColors[index],
        });

        // if (
        //   annotation &&
        //   annotation.dataPointIndex === index &&
        //   annotation.tooltipData !== null
        // ) {
        //   tooltipData.push({
        //     label: annotation.tooltipData?.label ?? '',
        //     color: color ?? seriesColors[index],
        //     value: annotation.tooltipData?.value ?? '',
        //     type: TooltipRowType.Annotation,
        //   });
        // }
      });

      return renderTooltipContent({
        data: tooltipData,
        activeIndex,
        title: `${data[0].data[activeIndex].key}`,
      });
    },
    [annotationsLookupTable, data, seriesColors, renderTooltipContent],
  );
}
