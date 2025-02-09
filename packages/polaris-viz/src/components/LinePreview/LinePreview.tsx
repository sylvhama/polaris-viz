import React, {useRef} from 'react';
import type {Color, LineStyle} from '@shopify/polaris-viz-core';
import {
  LinearGradientWithStops,
  isGradientType,
  uniqueId,
} from '@shopify/polaris-viz-core';

import {PREVIEW_ICON_SIZE, XMLNS} from '../../constants';

import {
  DASHED_STROKE_DASHARRAY,
  DOTTED_LINE_PREVIEW_CY,
  DOTTED_LINE_PREVIEW_RADIUS,
  DOT_SPACING,
} from './constants';
import styles from './LinePreview.scss';

export interface LinePreviewProps {
  color: Color;
  lineStyle: LineStyle;
}

const HEIGHT = 2;

export function LinePreview({color, lineStyle}: LinePreviewProps) {
  const gradientId = useRef(uniqueId('linePreviewGradient'));

  const linePreviewColor = isGradientType(color)
    ? `url(#${gradientId.current})`
    : color;

  return (
    <span className={styles.Container} style={{height: HEIGHT}}>
      <svg
        xmlns={XMLNS}
        width={`${PREVIEW_ICON_SIZE}px`}
        height={`${HEIGHT}px`}
      >
        {isGradientType(color) ? (
          <defs>
            <LinearGradientWithStops
              id={gradientId.current}
              gradient={color}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            />
          </defs>
        ) : null}
        {getLinePreview(linePreviewColor, lineStyle)}
      </svg>
    </span>
  );
}

function getLinePreview(color: string, lineStyle: LineStyle) {
  const solidLine = (
    <path
      d="M1,1L13.5,1"
      stroke={color}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2"
    />
  );

  const dashedLine = (
    <path
      d="M0,1L15,1"
      stroke={color}
      strokeWidth="2"
      strokeDasharray={DASHED_STROKE_DASHARRAY}
    />
  );

  const dottedLine = (
    <g fill={color}>
      {[...Array(3)].map((_, index) => {
        return (
          <circle
            key={index}
            cx={1 + index * DOT_SPACING}
            cy={DOTTED_LINE_PREVIEW_CY}
            r={DOTTED_LINE_PREVIEW_RADIUS}
          />
        );
      })}
    </g>
  );

  switch (lineStyle) {
    case 'dashed':
      return dashedLine;
    case 'dotted':
      return dottedLine;
    default:
      return solidLine;
  }
}
