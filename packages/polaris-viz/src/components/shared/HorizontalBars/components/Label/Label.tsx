import React from 'react';
import {animated, useSpring} from '@react-spring/web';
import {useChartContext} from '@shopify/polaris-viz-core';

import {
  HORIZONTAL_BAR_LABEL_HEIGHT,
  BARS_TRANSITION_CONFIG,
  FONT_SIZE,
} from '../../../../../constants';

export interface LabelProps {
  barHeight: number;
  color: string;
  label: string;
  labelWidth: number;
  x: number;
  y: number;
  animationDelay?: number;
}

export function Label({
  animationDelay,
  barHeight,
  color,
  label,
  labelWidth,
  x,
  y,
}: LabelProps) {
  const {shouldAnimate} = useChartContext();
  const labelYOffset = (barHeight - HORIZONTAL_BAR_LABEL_HEIGHT) / 2;

  const spring = useSpring({
    from: {transform: 'translateX(0px)', opacity: 0},
    to: {opacity: 1, transform: `translateX(${x}px)`},
    delay: shouldAnimate ? animationDelay : 0,
    config: BARS_TRANSITION_CONFIG,
    default: {immediate: !shouldAnimate},
  });

  return (
    // animating the foreignObject does not work on Safari,
    // so we need to use a g instead
    <animated.g
      style={{
        opacity: spring.opacity,
        transform: spring.transform,
      }}
    >
      <foreignObject
        height={FONT_SIZE}
        width={labelWidth}
        aria-hidden="true"
        y={y + labelYOffset}
      >
        <div
          style={{
            fontSize: `${FONT_SIZE}px`,
            color,
            lineHeight: `${HORIZONTAL_BAR_LABEL_HEIGHT}px`,
            height: HORIZONTAL_BAR_LABEL_HEIGHT,
          }}
        >
          {label}
        </div>
      </foreignObject>
    </animated.g>
  );
}
