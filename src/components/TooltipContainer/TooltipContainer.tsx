import React, {useEffect, useRef, useState, ReactNode} from 'react';
import {useSpring, animated} from 'react-spring';

import {clamp} from '../../utilities';
import {Dimensions} from '../../types';

import styles from './TooltipContainer.scss';

interface Props {
  children: ReactNode;
  margin: {Top: number; Left: number; Right: number; Bottom: number};
  activePointIndex: number;
  currentX: number;
  currentY: number;
  currentValue?: number;
  chartDimensions: Dimensions;
  position?: 'center' | 'auto';
  id?: string;
}

// The space between the cursor and the tooltip
const TOOLTIP_MARGIN = 10;

export function TooltipContainer({
  activePointIndex,
  currentX,
  currentY,
  currentValue = 0,
  chartDimensions,
  children,
  margin,
  position = 'auto',
  id = '',
}: Props) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipDimensions, setTooltipDimensions] = useState<Dimensions | null>(
    null,
  );
  const firstRender = useRef(true);

  const spring: any = useSpring({
    from: {
      translate: [0, 0, 0],
      opacity: 0,
    },
    to: async (next: any) => {
      if (tooltipDimensions == null) {
        return;
      }

      const chartLeftBound = margin.Left;
      const chartRightBound = chartDimensions.width - margin.Right;

      const naturalLeftBound =
        currentX - tooltipDimensions.width - TOOLTIP_MARGIN;
      const hasSpaceToLeft = naturalLeftBound > chartLeftBound;

      const naturalRightBound =
        currentX + tooltipDimensions.width + TOOLTIP_MARGIN;
      const hasSpaceToRight = naturalRightBound < chartRightBound;

      let xTranslation = 0;

      if (position === 'center') {
        xTranslation = clamp({
          amount: currentX - tooltipDimensions.width / 2,
          max: chartRightBound - tooltipDimensions.width,
          min: chartLeftBound,
        });
      } else if (hasSpaceToLeft) {
        xTranslation = naturalLeftBound;
      } else if (hasSpaceToRight) {
        xTranslation = currentX + TOOLTIP_MARGIN;
      } else {
        const centeredLeftBound = currentX - tooltipDimensions.width / 2;
        const centeredRightBound = currentX + tooltipDimensions.width / 2;

        if (centeredRightBound > chartRightBound) {
          xTranslation = chartRightBound - tooltipDimensions.width;
        } else if (centeredLeftBound < chartLeftBound) {
          xTranslation = chartLeftBound;
        } else {
          xTranslation = centeredLeftBound;
        }
      }

      const shouldRenderImmediate = firstRender.current;
      firstRender.current = false;

      const yTranslation =
        currentValue >= 0
          ? Math.max(
              margin.Top,
              currentY + margin.Top - tooltipDimensions.height - TOOLTIP_MARGIN,
            )
          : Math.min(
              chartDimensions.height + margin.Top - tooltipDimensions.height,
              currentY + margin.Top + TOOLTIP_MARGIN,
            );

      const zeroYPosition = TOOLTIP_MARGIN + margin.Top;

      // react-spring docs do not return the `next` callback
      // eslint-disable-next-line callback-return
      await next({
        translate: [
          xTranslation,
          currentY === 0 ? zeroYPosition : yTranslation,
          0,
        ],
        opacity: 1,
        immediate: shouldRenderImmediate,
      });
    },
  });

  useEffect(() => {
    if (tooltipRef.current == null) {
      return;
    }

    setTooltipDimensions(tooltipRef.current.getBoundingClientRect());
  }, [activePointIndex]);

  return (
    <animated.div
      id={id}
      className={styles.Container}
      style={{
        top: 0,
        left: 0,
        opacity: spring.opacity,
        transform: spring.translate.interpolate(
          // eslint-disable-next-line id-length
          (x: number, y: number, z: number) =>
            `translate3d(${x}px, ${y}px, ${z}px)`,
        ),
      }}
      ref={tooltipRef}
      aria-hidden="true"
    >
      {children}
    </animated.div>
  );
}
