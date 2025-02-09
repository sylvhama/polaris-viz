import React, {useState} from 'react';
import type {Meta, StoryFn} from '@storybook/react';

import {
  THEME_CONTROL_ARGS,
  CHART_STATE_CONTROL_ARGS,
  LEGEND_POSITION_ARGS,
} from '../../storybook';
import {DonutChart} from '.';
import type {DonutChartProps} from './DonutChart';
import {ChartState} from '@shopify/polaris-viz-core';

const meta: Meta<DonutChartProps> = {
  title: 'polaris-viz/Charts/DonutChart',
  component: DonutChart,
  parameters: {
    a11y: {disable: true},
    controls: {
      sort: 'requiredFirst',
      expanded: true,
    },
    docs: {
      description: {
        component:
          'Circular statistical graphic, which is divided into slices to illustrate numerical proportion.',
      },
    },
  },
  argTypes: {
    data: {
      description:
        'A collection of named data sets to be rendered in the chart. An optional color can be provided for each series, to overwrite the theme `seriesColors` defined in `PolarisVizProvider`',
    },
    legendPosition: LEGEND_POSITION_ARGS,
    theme: THEME_CONTROL_ARGS,
    state: CHART_STATE_CONTROL_ARGS,
  },
  decorators: [
    (Story) => <div style={{width: 550, height: 400}}>{Story()}</div>,
  ],
};

export default meta;

const Template: StoryFn<DonutChartProps> = (args: DonutChartProps) => {
  return <DonutChart {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  data: [
    {
      name: 'Shopify Payments',
      data: [{key: 'april - march', value: 50000}],
    },
    {
      name: 'Paypal',
      data: [{key: 'april - march', value: 25000}],
    },
    {
      name: 'Other',
      data: [{key: 'april - march', value: 10000}],
    },
    {
      name: 'Amazon Pay',
      data: [{key: 'april - march', value: 4000}],
    },
  ],
  comparisonMetric: {
    metric: '10%',
    trend: 'negative',
    accessibilityLabel: 'trending down 10%',
  },
};

export const SingleDataPoint = Template.bind({});

SingleDataPoint.args = {
  data: [
    {
      name: 'Engagement',
      data: [{key: 'april - march', value: 25000}],
    },
  ],
  comparisonMetric: {
    metric: '6%',
    trend: 'positive',
    accessibilityLabel: 'trending up 6%',
  },
  legendPosition: 'left',
};

export const ErrorState = Template.bind({});

ErrorState.args = {
  data: [
    {
      name: 'Engagement',
      data: [{key: 'april - march', value: 25000}],
    },
  ],
  comparisonMetric: {
    metric: '6%',
    trend: 'positive',
    accessibilityLabel: 'trending up 6%',
  },
  state: ChartState.Error,
};

export const CustomColors = Template.bind({});

CustomColors.args = {
  data: [
    {
      name: 'Shopify Payments',
      data: [{key: 'april - march', value: 50000}],
    },
    {
      name: 'Paypal',
      data: [{key: 'april - march', value: 25000}],
      color: 'lime',
    },
    {
      name: 'Amazon Pay',
      data: [{key: 'april - march', value: 4000}],
    },
  ],
  comparisonMetric: {
    metric: '6%',
    trend: 'positive',
    accessibilityLabel: 'trending up 6%',
  },
};

export const DynamicData = () => {
  const [data, setData] = useState([
    {
      name: 'Shopify Payments',
      data: [{key: 'april - march', value: 50000}],
    },
    {
      name: 'Paypal',
      data: [{key: 'april - march', value: 25000}],
    },
    {
      name: 'Amazon Pay',
      data: [{key: 'april - march', value: 4000}],
    },
    {
      name: 'Other',
      data: [{key: 'april - march', value: 4000}],
    },
  ]);

  const onClick = () => {
    const newData = data.map((item) => {
      const newValue = Math.floor(Math.random() * 200);
      return {
        ...item,
        data: [
          {
            ...item.data[0],
            value: newValue,
          },
        ],
      };
    });
    setData(newData);
  };

  return (
    <>
      <DonutChart data={data} />
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
        onClick={onClick}
      >
        Change Data
      </button>
    </>
  );
};
