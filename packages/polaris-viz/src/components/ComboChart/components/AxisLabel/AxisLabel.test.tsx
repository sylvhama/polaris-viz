import React from 'react';
import {mount} from '@shopify/react-testing';

import {SingleTextLine} from '../../../Labels';

import {AxisLabelProps} from './AxisLabel';

import {AxisLabel} from './';

jest.mock('../../../../hooks/useEstimateStringWidth', () => ({
  useEstimateStringWidth: () => 100,
}));

const MOCK_PROPS: AxisLabelProps = {
  containerWidth: 100,
  height: 100,
  name: 'Primary Axis',
  axis: 'primary',
  x: 0,
  y: 0,
};

describe('<AxisLabel />', () => {
  describe('axis', () => {
    it('renders a primary axis label', () => {
      const component = mount(
        <svg>
          <AxisLabel {...MOCK_PROPS} name="Primary Axis" axis="primary" />
        </svg>,
      );

      expect(component).toContainReactComponent('g', {
        transform: 'translate(0,100) rotate(-90)',
      });
    });

    it('renders a secondary axis label', () => {
      const component = mount(
        <svg>
          <AxisLabel {...MOCK_PROPS} name="Secondary Axis" axis="secondary" />
        </svg>,
      );

      expect(component).toContainReactComponent('g', {
        transform: 'translate(14,0) rotate(90)',
      });
    });
  });

  it('renders rect and <SingleTextLine />', () => {
    const component = mount(
      <svg>
        <AxisLabel {...MOCK_PROPS} name="Primary Axis" axis="primary" />
      </svg>,
    );

    expect(component).toContainReactComponent('rect', {
      width: 100,
      height: 14,
      fill: 'colorGray160',
    });

    expect(component).toContainReactComponent(SingleTextLine, {
      color: 'colorGray30',
      targetWidth: 100,
      text: 'Primary Axis',
      x: 0,
      y: 0,
    });
  });

  describe('x/y', () => {
    it('applies x and y', () => {
      const component = mount(
        <svg>
          <AxisLabel {...MOCK_PROPS} x={10} y={20} />
        </svg>,
      );

      expect(component).toContainReactComponent('g', {
        transform: 'translate(10,120) rotate(-90)',
      });
    });
  });
});
