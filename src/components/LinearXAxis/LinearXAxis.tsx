import React, {useMemo} from 'react';
import type {ScaleLinear} from 'd3-scale';

import {useTheme} from '../../hooks';
import {TICK_SIZE, LINE_HEIGHT} from '../../constants';
import {TextAlignment, TruncatedText} from '../TruncatedText';

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

  theme?: string;
}

function getAlignment({isFirst, isLast}: {isFirst: boolean; isLast: boolean}) {
  if (isFirst) {
    return TextAlignment.Start;
  }

  if (isLast) {
    return TextAlignment.End;
  }

  return TextAlignment.Middle;
}

function Axis({
  xScale,
  labels,
  xAxisDetails,
  fontSize,
  drawableWidth,
  drawableHeight,
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

        const adjustedLastLabel =
          Math.floor(xOffset + horizontalLabelWidth / 2) > drawableWidth;

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
              transform={`translate(${0} 19)`}
              width={textWidth}
              align={getAlignment({
                isFirst: firstLabel,
                isLast: adjustedLastLabel,
              })}
            />
          </g>
        );
      })}
    </React.Fragment>
  );
}

export const LinearXAxis = React.memo(Axis);
