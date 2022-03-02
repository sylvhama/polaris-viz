import React, {useMemo} from 'react';
import type {ScaleLinear} from 'd3-scale';
import {usePolarisVizContext} from '../../hooks';
// import type {SpringValue} from '@react-spring/core';

interface Props {
  x: number;
  yScale: ScaleLinear<number, number>;
  value: number | null;
  width: number;
  // height?: SpringValue<number> | number;
  height?: number;
  fill: string;
  hasRoundedCorners: boolean;
}

export function Bar({
  x,
  value,
  yScale,
  width,
  height,
  fill,
  hasRoundedCorners,
}: Props) {
  const {
    components: {Path},
    // animated,
  } = usePolarisVizContext();

  // const AnimatedPath = animated(Path);

  const zeroScale = yScale(0);
  const isNegative = value != null && value < 0;
  //different on native and web
  const rotation = isNegative ? 180 : 0;
  const xPosition = isNegative ? x + width : x;

  const yPosition = useMemo(() => {
    if (height == null) return;

    const getYPosition = (value: number) =>
      isNegative ? zeroScale + value : zeroScale - value;

    if (typeof height === 'number') {
      return getYPosition(height);
    }
    // return height.to(getYPosition);
  }, [height, isNegative, zeroScale]);

  const style = useMemo(() => {
    if (yPosition == null) return;

    //different for native and web
    const getStyle = (y: number) =>
      `translate(${xPosition} ${y}), rotate(${rotation})`;

    return getStyle(yPosition);

    // return {
    //   transform: yPosition.to(getStyle),
    // };
  }, [yPosition, xPosition, rotation]);

  const path = useMemo(() => {
    if (height == null) return;

    const calculatePath = (heightValue: number) => {
      if (heightValue === 0) {
        return '';
      }

      const arcRadius = hasRoundedCorners ? width / 2 : 0;
      const arcHigherThanHeight = heightValue < arcRadius;
      const arcWidth = arcHigherThanHeight
        ? (heightValue / arcRadius) * width
        : width;
      const barStartY = arcHigherThanHeight ? arcWidth / 2 : arcRadius;
      const arcX = (width - arcWidth) / 2 + arcWidth;

      const moveToStart = `M ${(width - arcWidth) / 2} ${barStartY} `;

      const arc = `A ${arcRadius} ${arcRadius} 0 0 1 ${arcX} ${barStartY} `;

      const moveToEndOfArc = `M ${width} ${barStartY} `;

      const lineRightTopToBottom = !arcHigherThanHeight
        ? `L ${width} ${heightValue} `
        : '';

      const lineBottomRightToLeft = !arcHigherThanHeight
        ? `L 0 ${heightValue} `
        : '';

      const lineLeftFromBottomToStart = `L 0 ${barStartY}`;

      return `${moveToStart}${arc}${moveToEndOfArc}${lineRightTopToBottom}${lineBottomRightToLeft}${lineLeftFromBottomToStart}`;
    };

    if (typeof height === 'number') {
      return calculatePath(height);
    }
    // return height.to(calculatePath);
  }, [height, width, hasRoundedCorners]);

  if (value == null || width < 0) {
    return null;
  }

  return <Path d={path} transform={style} fill={fill} />;
}
