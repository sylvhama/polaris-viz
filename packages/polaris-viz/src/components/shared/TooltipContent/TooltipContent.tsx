import React, {useState} from 'react';
import {FONT_SIZE, useTheme} from '@shopify/polaris-viz-core';

import {COLOR_VISION_SINGLE_ITEM} from '../../../constants';
import {
  getOpacityStylesForActive,
  useWatchColorVisionEvents,
} from '../../../hooks';
import {changeColorOpacity, classNames} from '../../../utilities';
import {ShapePreview} from '../ShapePreview';

import {useGetLongestLabelFromData} from './hooks/getLongestLabelFromData';
import type {TooltipData} from './types';
import styles from './TooltipContent.scss';

export interface TooltipContentProps {
  data: TooltipData[];
  title?: string;
  theme?: string;
}

const FONT_SIZE_OFFSET = 1.2;
const SPACE_BETWEEN_LABEL_AND_VALUE = 64;
const PREVIEW_WIDTH = 20;

export function TooltipContent({data, theme, title}: TooltipContentProps) {
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  const selectedTheme = useTheme(theme);
  const {keyWidth, valueWidth} = useGetLongestLabelFromData(data);

  useWatchColorVisionEvents({
    type: COLOR_VISION_SINGLE_ITEM,
    onIndexChange: ({detail}) => setActiveLineIndex(detail.index),
  });

  const leftWidth = keyWidth * FONT_SIZE_OFFSET;
  const rightWidth = valueWidth * FONT_SIZE_OFFSET;

  return (
    <div
      className={styles.Container}
      style={{
        background: changeColorOpacity(
          selectedTheme.tooltip.backgroundColor,
          0.8,
        ),
        maxWidth:
          PREVIEW_WIDTH +
          leftWidth +
          SPACE_BETWEEN_LABEL_AND_VALUE +
          rightWidth,
      }}
    >
      {title != null && (
        <p
          className={styles.Title}
          style={{color: selectedTheme.tooltip.titleColor}}
        >
          {title}
        </p>
      )}

      {data.map(({data: series, name, shape}, index) => {
        return (
          <div className={styles.Series} key={index}>
            <p
              className={styles.AxisTitle}
              style={{
                color: selectedTheme.tooltip.titleColor,
                fontSize: FONT_SIZE,
              }}
            >
              {name}
            </p>
            {series.map(({key, value, color, isComparison}, index) => {
              return (
                <div
                  className={styles.Row}
                  key={`row-${index}`}
                  style={getOpacityStylesForActive({
                    activeIndex: activeLineIndex,
                    index,
                  })}
                >
                  <ShapePreview
                    color={color}
                    isComparison={isComparison}
                    shape={shape}
                    theme={theme}
                  />
                  <span
                    className={styles.Text}
                    style={{
                      marginLeft: 4,
                      color: selectedTheme.tooltip.textColor,
                      marginRight: SPACE_BETWEEN_LABEL_AND_VALUE,
                    }}
                  >
                    {key}
                  </span>
                  <span
                    className={classNames(styles.Text, styles.Value)}
                    style={{
                      color: selectedTheme.tooltip.textColor,
                    }}
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
