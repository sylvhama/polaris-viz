import React from 'react';
import {animated, useSpring, config} from 'react-spring';
import tokens from '@shopify/polaris-tokens';
import {Color} from 'types';
import {ScaleLinear} from 'd3-scale';

import {getColorValue} from '../../utilities';
import {ROUNDED_BAR_RADIUS, MIN_BAR_HEIGHT} from '../../constants';

import styles from './Bar.scss';

const MAX_DELAY = tokens.durationSlow;

interface Props {
  color: Color;
  highlightColor: Color;
  isSelected: boolean;
  x: number;
  yScale: ScaleLinear<number, number>;
  rawValue: number;
  width: number;
  index: number;
  onFocus: ({index, cx, cy}: {index: number; cx: number; cy: number}) => void;
  ariaLabel?: string;
  tabIndex: number;
  role?: string;
  numberOfBars: number;
  hasRoundedCorners?: boolean;
}

export function Bar({
  color,
  highlightColor,
  isSelected,
  x,
  rawValue,
  yScale,
  width,
  onFocus,
  index,
  ariaLabel,
  tabIndex,
  role,
  hasRoundedCorners,
  numberOfBars,
}: Props) {
  const currentColor = isSelected
    ? getColorValue(highlightColor)
    : getColorValue(color);

  const animation = useSpring({
    config: {duration: tokens.durationFast},
    immediate: color === highlightColor,
    color: currentColor,
    from: {color: getColorValue(color)},
  });

  const rawHeight = Math.abs(yScale(rawValue) - yScale(0));

  const zeroScale = yScale(0);
  const needsMinHeight = rawHeight < MIN_BAR_HEIGHT && rawHeight !== 0;
  const height = needsMinHeight ? MIN_BAR_HEIGHT : rawHeight;
  const radius = hasRoundedCorners ? ROUNDED_BAR_RADIUS : 0;

  const handleFocus = () => {
    onFocus({index, cx: x, cy: yPosition});
  };

  const isNegative = rawValue < 0;
  const yPosition = isNegative ? zeroScale + height : zeroScale - height;
  const rotation = isNegative ? 'rotate(180deg)' : 'rotate(0deg)';
  const xPosition = isNegative ? x + width : x;

  const {height: animatedHeight, yPosition: animatedYPosition} = useSpring({
    height,
    yPosition,
    from: {height: 0, yPosition: zeroScale},
    delay: (MAX_DELAY / numberOfBars) * index,
    config: config.gentle,
  });

  return (
    <animated.path
      d={animatedHeight.interpolate((height) => {
        return `M${radius} 0h${width -
          radius *
            2} a${radius} ${radius} 0 01${radius} ${radius} v${(height as number) -
          radius} H0 V${radius} a${radius} ${radius} 0 01${radius}-${radius} z`;
      })}
      fill={animation.color}
      aria-label={ariaLabel}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      role={role}
      style={{
        /* stylelint-disable */
        transform: animatedYPosition.interpolate(
          (y) => `translate(${xPosition}px, ${y}px) ${rotation}`,
        ),
        /* stylelint-enable */
      }}
      className={color === highlightColor ? undefined : styles.BarNoOutline}
    />
  );
}
