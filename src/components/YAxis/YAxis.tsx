import React from 'react';

import {useTheme} from '../../hooks';
import {LINE_HEIGHT, FONT_SIZE} from '../../constants';
import type {YAxisTick} from '../../types';

interface Props {
  ticks: YAxisTick[];
  textAlign: 'left' | 'right';
  width: number;

  fontSize?: number;
  theme?: string;
}

const PADDING_SIZE = 1;

function Axis({ticks, fontSize = FONT_SIZE, width, textAlign, theme}: Props) {
  const selectedTheme = useTheme(theme);

  return (
    <React.Fragment>
      {ticks.map(({value, formattedValue, yOffset}) => {
        return (
          <text
            key={value}
            transform={`translate(${selectedTheme.grid.horizontalMargin},${
              yOffset + LINE_HEIGHT / 3
            })`}
            width={width + PADDING_SIZE * 2}
            height={LINE_HEIGHT}
            fill={selectedTheme.yAxis.labelColor}
            fontSize={fontSize}
            style={{
              color: selectedTheme.yAxis.labelColor,
              textAlign,
              lineHeight: `${LINE_HEIGHT}px`,

              background: selectedTheme.yAxis.backgroundColor,
              padding: PADDING_SIZE,
              whiteSpace: 'nowrap',
              fontFeatureSettings: 'tnum',
            }}
          >
            {formattedValue}
          </text>
        );
      })}
    </React.Fragment>
  );
}

export const YAxis = React.memo(Axis);
