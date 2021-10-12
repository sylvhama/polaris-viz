import React from 'react';

import {useTheme} from '../../hooks';
import {LINE_HEIGHT, FONT_SIZE} from '../../constants';
import type {YAxisTick} from '../../types';
import {TruncatedText} from '../TruncatedText';

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
          <TruncatedText
            key={value}
            transform={`translate(${
              selectedTheme.grid.horizontalMargin + width
            },${yOffset - LINE_HEIGHT / 1.5})`}
            width={width + PADDING_SIZE * 2}
            height={LINE_HEIGHT}
            color={selectedTheme.yAxis.labelColor}
            fontSize={fontSize}
            text={formattedValue}
            align="end"
          />
        );
      })}
    </React.Fragment>
  );
}

export const YAxis = React.memo(Axis);
