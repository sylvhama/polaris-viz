import React from 'react';

import type {YAxisTick} from '../../types';

interface Props {
  ticks: YAxisTick[];
  color: string;
  transform: {x: number; y: number};
  width: number;
}

export const HorizontalGridLines = React.memo(function HorizontalGridLines({
  ticks,
  color,
  transform,
  width,
}: Props) {
  return (
    <React.Fragment>
      {ticks.map(({yOffset}, index) => (
        <line
          key={index}
          x2={width}
          stroke={color}
          transform={`translate(${transform.x},${transform.y + yOffset})`}
        />
      ))}
    </React.Fragment>
  );
});
