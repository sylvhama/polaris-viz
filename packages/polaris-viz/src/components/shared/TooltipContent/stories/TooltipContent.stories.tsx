import React from 'react';
import type {Story, Meta} from '@storybook/react';

import {TooltipContent, TooltipContentProps} from '../TooltipContent';
import type {TooltipData} from '../types';
import {DEFAULT_THEME} from '@shopify/polaris-viz-core';
import {ChartContext} from '../../../ChartContainer';
import characterWidths from '../../../../data/character-widths.json';

export default {
  title: 'shared/Subcomponents/TooltipContent',
  component: TooltipContent,
  parameters: {
    controls: {sort: 'requiredFirst', expanded: true},
    docs: {
      description: {
        component: '',
      },
      yScale: {
        controls: null,
      },
      xScale: {
        controls: null,
      },
    },
  },
  argTypes: {},
} as Meta;

const Template: Story<TooltipContentProps> = (args: TooltipContentProps) => {
  return (
    <div
      style={{
        width: '100wh',
        height: '100vh',
        padding: 80,
        background:
          'url(https://9to5mac.com/wp-content/uploads/sites/6/2021/10/Monterey-Graphic-7-dragged.jpeg?quality=82&strip=all&w=1000)',
      }}
    >
      <ChartContext.Provider value={{characterWidths, id: 'none'}}>
        <TooltipContent {...args} />
      </ChartContext.Provider>
    </div>
  );
};

const DATA: TooltipData[] = [
  {
    name: 'Sessions',
    shape: 'Line',
    data: [
      {
        key: 'Sessions from Google ads',
        value: 5250,
        color: DEFAULT_THEME.seriesColors.fromFiveToSeven[0],
      },
      {
        key: 'Sessions from Facebook ads',
        value: 650,
        color: DEFAULT_THEME.seriesColors.fromFiveToSeven[1],
        isComparison: true,
      },
    ],
  },
  {
    name: 'Sales',
    shape: 'Bar',
    data: [
      {
        key: 'POS',
        value: 4999,
        color: DEFAULT_THEME.seriesColors.fromFiveToSeven[2],
      },
      {
        key: 'Online',
        value: 10000,
        color: DEFAULT_THEME.seriesColors.fromFiveToSeven[3],
      },
      {
        key: 'Mobile',
        value: 16500,
        color: DEFAULT_THEME.seriesColors.fromFiveToSeven[4],
      },
    ],
  },
];

export const Default: Story<TooltipContentProps> = Template.bind({});
Default.args = {
  data: DATA,
  title: 'Tuesday',
};

export const NoTitle: Story<TooltipContentProps> = Template.bind({});
NoTitle.args = {
  data: DATA,
};

export const NoSeriesName: Story<TooltipContentProps> = Template.bind({});
NoSeriesName.args = {
  title: 'Tuesday',
  data: [
    {
      shape: 'Line',
      data: [
        {
          key: 'Sessions from Google ads',
          value: 5250,
          color: DEFAULT_THEME.seriesColors.fromFiveToSeven[0],
        },
        {
          key: 'Sessions from Facebook ads',
          value: 650,
          color: DEFAULT_THEME.seriesColors.fromFiveToSeven[1],
        },
      ],
    },
  ],
};
