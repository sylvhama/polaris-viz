import React, {useMemo} from 'react';
import type {ScaleLinear} from 'd3-scale';

import {useTheme} from '../../hooks';
import {RightAngleTriangle} from '../../utilities';
import {
  TICK_SIZE,
  SPACING_EXTRA_TIGHT,
  DIAGONAL_ANGLE,
  LINE_HEIGHT,
  BELOW_X_AXIS_MARGIN,
} from '../../constants';
import {TruncatedText} from '../TruncatedText';

import styles from './LinearXAxis.scss';

interface XAxisDetails {
  maxXLabelHeight: number;
  maxDiagonalLabelLength: number;
  needsDiagonalLabels: boolean;
  ticks: number[];
  horizontalLabelWidth: number;
}

interface Props {
  xScale: ScaleLinear<number, number>;
  labels: string[] | null;
  drawableWidth: number;
  fontSize: number;
  xAxisDetails: XAxisDetails;
  drawableHeight: number;
  ariaHidden: boolean;

  theme?: string;
}

function Axis({
  xScale,
  labels,
  xAxisDetails,
  fontSize,
  drawableWidth,
  drawableHeight,
  ariaHidden,
  theme,
}: Props) {
  const selectedTheme = useTheme(theme);

  const {
    maxDiagonalLabelLength,
    maxXLabelHeight,
    needsDiagonalLabels,
    ticks,
    horizontalLabelWidth,
  } = xAxisDetails;

  const tickDetails = useMemo(() => {
    if (labels == null) {
      return [];
    }

    return ticks.map((value) => {
      return {
        value: labels[value],
        xOffset: xScale(value),
        firstLabel: value === 0,
      };
    });
  }, [labels, ticks, xScale]);

  const textHeight = needsDiagonalLabels ? LINE_HEIGHT : maxXLabelHeight;

  return (
    <React.Fragment>
      {tickDetails.map(({value, xOffset, firstLabel}, index) => {
        const textWidth = needsDiagonalLabels
          ? maxDiagonalLabelLength
          : horizontalLabelWidth;

        const firstLabelAdjustment = firstLabel ? textWidth / 2 : 0;
        const adjustedLastLabel =
          Math.floor(xOffset + horizontalLabelWidth / 2) > drawableWidth;

        const horizontalXPosition = adjustedLastLabel
          ? -horizontalLabelWidth
          : -horizontalLabelWidth / 2;

        return (
          <g key={index} transform={`translate(${xOffset}, 0)`}>
            {selectedTheme.xAxis.showTicks ? (
              <line y2={TICK_SIZE} stroke={selectedTheme.grid.color} />
            ) : null}
            {selectedTheme.grid.showVerticalLines ? (
              <line
                y1="0"
                y2={-drawableHeight}
                stroke={selectedTheme.grid.color}
                strokeDasharray="3 2"
              />
            ) : null}
            <TruncatedText
              color={selectedTheme.xAxis.labelColor}
              fontSize={fontSize}
              height={textHeight}
              text={value}
              transform={`translate(${
                horizontalXPosition + firstLabelAdjustment
              } 19)`}
              width={textWidth}
            />
          </g>
        );
      })}
    </React.Fragment>
  );
}

export const LinearXAxis = React.memo(Axis);
