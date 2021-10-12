import React from 'react';
import type {ScaleLinear} from 'd3-scale';

import {MAX_X_AXIS_LINES, SPACE_BETWEEN_CHART_AND_AXIS} from '../../constants';
import {FONT_SIZE} from '../../../../constants';
import type {LabelFormatter} from '../../types';
import {TextAlignment, TruncatedText} from '../../../TruncatedText';

interface XAxisLabelsProps {
  bandwidth: number;
  chartHeight: number;
  color: string;
  labelFormatter: LabelFormatter;
  tallestXAxisLabel: number;
  ticks: number[];
  xScale: ScaleLinear<number, number>;
}

function getTextAlign({isFirst, isLast}: {isFirst: boolean; isLast: boolean}) {
  if (isFirst) {
    return TextAlignment.Start;
  } else if (isLast) {
    return TextAlignment.End;
  } else {
    return TextAlignment.Middle;
  }
}

export const XAxisLabels = ({
  bandwidth,
  chartHeight,
  color,
  labelFormatter,
  tallestXAxisLabel,
  ticks,
  xScale,
}: XAxisLabelsProps) => {
  return (
    <g
      transform={`translate(0,${chartHeight + SPACE_BETWEEN_CHART_AND_AXIS})`}
      aria-hidden="true"
    >
      {ticks.map((value, index) => {
        const label = labelFormatter(value);
        const isFirstItem = index === 0;
        const isLastItem = index === ticks.length - 1;
        const textOffset = bandwidth / 2;

        const width = isFirstItem || isLastItem ? bandwidth / 2 : bandwidth;

        return (
          <TruncatedText
            align={getTextAlign({
              isFirst: isFirstItem,
              isLast: isLastItem,
            })}
            color={color}
            fontSize={FONT_SIZE}
            height={tallestXAxisLabel}
            key={index}
            maxLines={MAX_X_AXIS_LINES}
            text={label}
            textOffset={isFirstItem ? 0 : textOffset}
            transform={`translate(${
              isFirstItem ? 0 : xScale(value) - textOffset
            },0)`}
            width={width}
          />
        );
      })}
    </g>
  );
};
