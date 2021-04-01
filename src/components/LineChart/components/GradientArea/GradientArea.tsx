import React, {useMemo, useState, useEffect} from 'react';
import {ScaleLinear} from 'd3-scale';
import {area, curveMonotoneX} from 'd3-shape';

import {uniqueId, getColorValue, rgbToRgba} from '../../../../utilities';
import {usePrefersReducedMotion} from '../../../../hooks';
import {Data} from '../../../../types';
import {Series} from '../../types';

import {getGradientDetails} from './utilities/get-gradient-details';
import styles from './GradientArea.scss';

interface Props {
  series: Series;
  yScale: ScaleLinear<number, number>;
  xScale: ScaleLinear<number, number>;
  hasSpline: boolean;
  isAnimated: boolean;
  index: number;
}

export function GradientArea({
  series,
  yScale,
  xScale,
  hasSpline,
  isAnimated,
  index,
}: Props) {
  const id = useMemo(() => uniqueId('gradient'), []);
  const {prefersReducedMotion} = usePrefersReducedMotion();
  const [display, setDisplay] = useState<'none' | 'block'>('none');

  const {data, color} = series;

  const areaGenerator = area<Data>()
    .x((_: Data, index: number) => xScale(index))
    .y0(yScale(0))
    .y1(({rawValue}: {rawValue: number}) => yScale(rawValue));

  if (hasSpline) {
    areaGenerator.curve(curveMonotoneX);
  }

  const areaShape = areaGenerator(data);

  useEffect(() => {
    const timer = setTimeout(() => setDisplay('block'), index * 250);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  if (areaShape == null || color == null) {
    return null;
  }

  const rgb = getColorValue(color);
  const gradientStops = getGradientDetails(data);
  const immediate = !isAnimated || prefersReducedMotion;

  return (
    <React.Fragment>
      <defs>
        <linearGradient id={`${id}`} x1="0%" x2="100%" y1="0%" y2="0%">
          {/* {gradientStops.map(({percent, alpha}) => (
            <stop
              key={percent}
              offset={`${percent}%`}
              stopColor={rgbToRgba({rgb, alpha})}
            />
          ))} */}
          <stop stopColor="#8F68FF" offset="21%" stopOpacity="0.05" />
          <stop stopColor="#4BB591" offset="62%" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <path
        d={areaShape}
        fill={`url(#${id})`}
        strokeWidth="0"
        stroke={series.color}
        style={{display: immediate ? 'block' : display}}
        className={immediate ? null : styles.Area}
      />
    </React.Fragment>
  );
}
