import React, {useMemo} from 'react';
import type {ScaleBand, ScaleLinear} from 'd3-scale';
import {
  Color,
  getColorVisionEventAttrs,
  DataType,
  COLOR_VISION_GROUP_ITEM,
  getColorVisionStylesForActiveIndex,
} from '@shopify/polaris-viz-core';

import {formatAriaLabel} from '../../../VerticalBarChart/utilities';
import {BAR_SPACING} from '../../../VerticalBarChart/constants';
import type {AccessibilitySeries} from '../../../VerticalBarChart/types';
import type {StackedSeries} from '../../../../types';
import {useStackedGapsForVerticalChart} from '../../hooks';

import {Stack} from './components';
import styles from './StackedBarGroups.scss';

interface StackedBarGroupsProps {
  accessibilityData: AccessibilitySeries[];
  activeBarGroup: number;
  colors: Color[];
  drawableHeight: number;
  gapWidth: number;
  id: string;
  labels: string[];
  stackedValues: StackedSeries[];
  xScale: ScaleBand<string>;
  yScale: ScaleLinear<number, number>;
}

export function StackedBarGroups({
  accessibilityData,
  activeBarGroup,
  drawableHeight,
  gapWidth,
  id,
  labels,
  stackedValues,
  xScale,
  yScale,
}: StackedBarGroupsProps) {
  const width = xScale.bandwidth() - BAR_SPACING;

  const formattedStackedValues = useMemo(() => {
    return labels.map((_, labelIndex) => {
      return stackedValues.map((data) => {
        return data[labelIndex];
      });
    });
  }, [labels, stackedValues]);

  const gaps = useStackedGapsForVerticalChart({
    stackedValues,
    labels,
  });

  return (
    <React.Fragment>
      {formattedStackedValues.map((item, groupIndex) => {
        const x = xScale(groupIndex.toString()) ?? 0;
        const groupAriaLabel = formatAriaLabel(accessibilityData[groupIndex]);

        return (
          <g
            key={groupIndex}
            {...getColorVisionEventAttrs({
              type: COLOR_VISION_GROUP_ITEM,
              index: groupIndex,
            })}
            className={styles.Group}
            style={getColorVisionStylesForActiveIndex({
              activeIndex: activeBarGroup,
              index: groupIndex,
            })}
            aria-label={groupAriaLabel}
            role="list"
            data-type={DataType.BarGroup}
            data-index={groupIndex}
            aria-hidden="false"
          >
            <rect
              height={drawableHeight}
              fill="transparent"
              x={x - gapWidth / 2}
              width={xScale.bandwidth() + gapWidth}
              aria-hidden="true"
            />
            <Stack
              activeBarGroup={activeBarGroup}
              data={item}
              gaps={gaps}
              groupIndex={groupIndex}
              id={id}
              width={width}
              x={x}
              yScale={yScale}
            />
          </g>
        );
      })}
    </React.Fragment>
  );
}
