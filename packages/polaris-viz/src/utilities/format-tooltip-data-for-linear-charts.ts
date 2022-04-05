import type {
  XAxisOptions,
  YAxisOptions,
  Direction,
} from '@shopify/polaris-viz-core/src/types';
import type {
  RenderTooltipContentData,
  TooltipData,
} from 'components/shared/TooltipContent';

interface Props {
  data: RenderTooltipContentData;
  xAxisOptions: Required<XAxisOptions>;
  yAxisOptions: Required<YAxisOptions>;
}

export function formatTooltipDataForLinearCharts({
  data,
  xAxisOptions,
  yAxisOptions,
}: Props): {
  formattedData: TooltipData[];
  title: string | undefined;
} {
  const formattedData = data.data.map((data) => {
    return {
      ...data,
      data: data.data.map((values) => {
        return {
          ...values,
          key: `${values.key}`,
          value: xAxisOptions.labelFormatter(values.value),
        };
      }),
    };
  });

  return {
    formattedData,
    title: data.title ? yAxisOptions.labelFormatter(data.title) : undefined,
  };
}
