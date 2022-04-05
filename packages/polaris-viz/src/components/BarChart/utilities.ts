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
  direction: Direction;
  xAxisOptions: Required<XAxisOptions>;
  yAxisOptions: Required<YAxisOptions>;
}

export function formatDataForTooltip({
  data,
  direction,
  xAxisOptions,
  yAxisOptions,
}: Props): {
  formattedData: TooltipData[];
  title: string | undefined;
} {
  const isVertical = direction === 'vertical';

  const valueFormatter = isVertical ? yAxisOptions : xAxisOptions;
  const titleFormatter = isVertical ? xAxisOptions : yAxisOptions;

  const formattedData = data.data.map((data) => {
    return {
      ...data,
      data: data.data.map((values) => {
        return {
          ...values,
          key: `${values.key}`,
          value: valueFormatter.labelFormatter(values.value),
        };
      }),
    };
  });

  return {
    formattedData,
    title: data.title ? titleFormatter.labelFormatter(data.title) : undefined,
  };
}
