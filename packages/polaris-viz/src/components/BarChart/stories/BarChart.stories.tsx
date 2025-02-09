import React from 'react';
import type {Story, Meta} from '@storybook/react';
import type {DataSeries} from '@shopify/polaris-viz-core';

import {BarChart, BarChartProps} from '../../../components';

import {PolarisVizProvider} from '../../../';
import {
  DIRECTION_CONTROL_ARGS,
  LEGEND_CONTROL_ARGS,
  RENDER_TOOLTIP_DESCRIPTION,
  THEME_CONTROL_ARGS,
  TYPE_CONTROL_ARGS,
  CHART_STATE_CONTROL_ARGS,
  ANNOTATIONS_ARGS,
} from '../../../storybook';

import {generateMultipleSeries} from '../../Docs/utilities';
import {PageWithSizingInfo} from '../../Docs/stories/components/PageWithSizingInfo';
import {DATA, TOOLTIP_CONTENT} from './utilities';

const DATA_WITH_COLOR: DataSeries[] = [
  {
    name: 'Breakfast',
    color: 'lime',
    data: [
      {key: 'Monday', value: 3},
      {key: 'Tuesday', value: -7},
      {key: 'Wednesday', value: 4},
      {key: 'Thursday', value: 8},
      {key: 'Friday', value: 50},
      {key: 'Saturday', value: 0},
      {key: 'Sunday', value: 0.1},
    ],
  },
  {
    name: 'Lunch',
    data: [
      {key: 'Monday', value: 4},
      {key: 'Tuesday', value: 0},
      {key: 'Wednesday', value: 5},
      {key: 'Thursday', value: 15},
      {key: 'Friday', value: 8},
      {key: 'Saturday', value: 50},
      {key: 'Sunday', value: 0.1},
    ],
  },
  {
    name: 'Dinner',
    data: [
      {key: 'Monday', value: 7},
      {key: 'Tuesday', value: 0},
      {key: 'Wednesday', value: 6},
      {key: 'Thursday', value: 12},
      {key: 'Friday', value: 50},
      {key: 'Saturday', value: 5},
      {key: 'Sunday', value: 0.1},
    ],
  },
];

export default {
  title: 'polaris-viz/Charts/BarChart',
  component: BarChart,
  parameters: {
    docs: {
      page: PageWithSizingInfo,
      description: {
        component:
          'Used to show comparison of different types, across categories or time. Bars can be stacked or side by side.',
      },
    },
    controls: {
      sort: 'requiredFirst',
      expanded: true,
    },
  },
  decorators: [(Story) => <div style={{height: '500px'}}>{Story()}</div>],
  argTypes: {
    annotations: ANNOTATIONS_ARGS,
    data: {
      description:
        'A collection of named data sets to be rendered in the chart. An optional color can be provided for each series, to overwrite the theme `seriesColors` defined in `PolarisVizProvider`',
    },
    emptyStateText: {
      description:
        'Used to indicate to screen readers that a chart with no series data has been rendered, in the case that an empty array is passed as the data. If the series prop could be an empty array, it is strongly recommended to include this prop.',
    },
    isAnimated: {
      description:
        'Whether to animate the bars when the chart is initially rendered and its data is updated. Even if `isAnimated` is set to true, animations will not be displayed for users with reduced motion preferences. Note: animations are currently only available for the non-stacked bar chart.',
    },
    skipLinkText: {
      description:
        'If provided, renders a `<SkipLink/>` button with the string. Use this for charts with large data sets, so keyboard users can skip all the tabbable data points in the chart.',
    },
    xAxisOptions: {
      description: 'An object that defines the xAxis and its options.',
    },
    yAxisOptions: {
      description: 'An object that defines the yAxis and its options.',
    },
    renderTooltipContent: {
      options: Object.keys(TOOLTIP_CONTENT),
      mapping: TOOLTIP_CONTENT,
      control: {
        type: 'select',
        labels: {
          empty: 'Default',
          Annotation: 'Custom',
        },
      },
      description: RENDER_TOOLTIP_DESCRIPTION,
    },
    direction: DIRECTION_CONTROL_ARGS,
    theme: THEME_CONTROL_ARGS,
    state: CHART_STATE_CONTROL_ARGS,
    type: TYPE_CONTROL_ARGS,
    showLegend: LEGEND_CONTROL_ARGS,
  },
} as Meta;

const Template: Story<BarChartProps> = (args: BarChartProps) => {
  return (
    <PolarisVizProvider
      themes={{
        Default: {
          chartContainer: {
            padding: '20px',
          },
        },
      }}
    >
      <BarChart {...args} />
    </PolarisVizProvider>
  );
};

export const Default: Story<BarChartProps> = Template.bind({});

Default.args = {
  data: DATA,
  xAxisOptions: {},
  isAnimated: true,
  showLegend: true,
};

export const SingleBar: Story<BarChartProps> = Template.bind({});

SingleBar.args = {
  data: [
    {
      name: 'Breakfast',
      data: [
        {key: 'Monday', value: 3},
        {key: 'Tuesday', value: -7},
        {key: 'Wednesday', value: 4},
        {key: 'Thursday', value: 8},
        {key: 'Friday', value: 50},
        {key: 'Saturday', value: 0},
        {key: 'Sunday', value: 0.1},
      ],
    },
  ],
  xAxisOptions: {},
  isAnimated: true,
};

export const Horizontal: Story<BarChartProps> = Template.bind({});

Horizontal.args = {
  data: [
    {
      name: 'Breakfast',
      data: [
        {key: 'Monday', value: 3},
        {key: 'Tuesday', value: -7},
        {key: 'Wednesday', value: 4},
        {key: 'Thursday', value: 8},
        {key: 'Friday', value: 50},
        {key: 'Saturday', value: 0},
        {key: 'Sunday', value: 0.1},
      ],
    },
  ],
  xAxisOptions: {},
  isAnimated: true,
  direction: 'horizontal',
};

const NoOverflowStyleTemplate: Story<BarChartProps> = (args: BarChartProps) => {
  return (
    <PolarisVizProvider
      themes={{
        Default: {
          chartContainer: {
            padding: '20px',
          },
          grid: {
            horizontalOverflow: false,
            horizontalMargin: 0,
          },
        },
      }}
    >
      <BarChart {...args} />
    </PolarisVizProvider>
  );
};

export const NoOverflowStyle = NoOverflowStyleTemplate.bind({});
NoOverflowStyle.args = {
  data: DATA,
  xAxisOptions: {},
};

export const HideXAxisLabels = Template.bind({});
HideXAxisLabels.args = {
  data: DATA,
  xAxisOptions: {hide: true},
};

const WithoutRoundedCornersTemplate: Story<BarChartProps> = (
  args: BarChartProps,
) => {
  return (
    <PolarisVizProvider
      themes={{
        Default: {
          bar: {
            borderRadius: 0,
          },
          chartContainer: {
            padding: '20px',
          },
        },
      }}
    >
      <BarChart {...args} />
    </PolarisVizProvider>
  );
};

export const WithoutRoundedCorners: Story<BarChartProps> =
  WithoutRoundedCornersTemplate.bind({});
WithoutRoundedCorners.args = {
  data: DATA,
  xAxisOptions: {},
};

export const Stacked: Story<BarChartProps> = Template.bind({});
Stacked.args = {
  data: DATA,
  xAxisOptions: {},
  type: 'stacked',
  isAnimated: true,
};

export const OverwrittenSeriesColors: Story<BarChartProps> = Template.bind({});
OverwrittenSeriesColors.args = {
  data: DATA_WITH_COLOR,
  xAxisOptions: {},
  type: 'stacked',
};

export const IntegersOnly: Story<BarChartProps> = Template.bind({});
IntegersOnly.args = {
  data: [
    {
      name: 'Breakfast',
      data: [
        {key: 'Monday', value: 2},
        {key: 'Tuesday', value: 0.1},
        {key: 'Wednesday', value: 0.78},
        {key: 'Thursday', value: 0.12},
        {key: 'Friday', value: 0.7},
        {key: 'Saturday', value: 0.3},
        {key: 'Sunday', value: 0.6},
      ],
    },
    {
      name: 'Lunch',
      data: [
        {key: 'Monday', value: 0},
        {key: 'Tuesday', value: 0.1},
        {key: 'Wednesday', value: 0.12},
        {key: 'Thursday', value: 0.34},
        {key: 'Friday', value: 1.6},
        {key: 'Saturday', value: 0.21},
        {key: 'Sunday', value: 0.1},
      ],
    },
    {
      name: 'Dinner',
      data: [
        {key: 'Monday', value: 1.23},
        {key: 'Tuesday', value: 1.42},
        {key: 'Wednesday', value: 2},
        {key: 'Thursday', value: 1.2},
        {key: 'Friday', value: 0.5},
        {key: 'Saturday', value: 0.12},
        {key: 'Sunday', value: 2},
      ],
    },
  ],
  xAxisOptions: {},
  yAxisOptions: {integersOnly: true},
};

export const NegativeOnly = Template.bind({});
NegativeOnly.args = {
  data: [
    {
      name: 'Breakfast',
      data: (IntegersOnly.args.data as DataSeries[])[0].data.map(
        ({key, value}) => {
          return {key, value: value! * -1};
        },
      ),
    },
    {
      name: 'Lunch',
      data: (IntegersOnly.args.data as DataSeries[])[1].data.map(
        ({key, value}) => {
          return {key, value: value! * -1};
        },
      ),
    },
    {
      name: 'Dinner',
      data: (IntegersOnly.args.data as DataSeries[])[2].data.map(
        ({key, value}) => {
          return {key, value: value! * -1};
        },
      ),
    },
  ],
  isAnimated: true,
  xAxisOptions: {},
  yAxisOptions: {integersOnly: true},
};

export const SeriesColorsUpToFour = Template.bind({});

SeriesColorsUpToFour.args = {
  data: generateMultipleSeries(4),
};

export const SeriesColorsFromFiveToSeven = Template.bind({});

SeriesColorsFromFiveToSeven.args = {
  data: generateMultipleSeries(7),
};

export const SeriesColorsUpToFourteen = Template.bind({});

SeriesColorsUpToFourteen.args = {
  data: generateMultipleSeries(7),
};
