import React from 'react';

import {LINE_HEIGHT} from '../../constants';

const CHARACTER_WIDTH = 7;

export enum TextAlignment {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

interface Props {
  color: string;
  fontSize: number;
  height: number;
  text: string;
  width: number;
  align?: TextAlignment;
  textOffset?: number;
  transform?: string;
  maxLines?: number;
}

export function TruncatedText({
  align = TextAlignment.Start,
  color,
  fontSize,
  height,
  text,
  textOffset = 0,
  transform,
  maxLines = 3,
  width,
}: Props) {
  const lines = truncateString(text, width, maxLines);

  console.log(textOffset);
  return (
    <text
      fill={color}
      fontSize={fontSize}
      fontVariant="tabular-nums"
      height={height}
      textLength={width}
      transform={transform}
      width={width}
    >
      {lines.map((line) => {
        return (
          <tspan
            dx={textOffset}
            dy={LINE_HEIGHT}
            x="0"
            key={line}
            textAnchor={align}
          >
            {line}
          </tspan>
        );
      })}
    </text>
  );
}

function chunkString(str: string, length: number) {
  // eslint is converting this to use exec which needs
  // to be looped through, so I'm disabling for now
  // eslint-disable-next-line
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function truncateString(val: string, width: number, maxLines = 3) {
  const maxCharacters = Math.ceil(width / CHARACTER_WIDTH);
  const lines = Math.ceil(val.length / maxCharacters);

  if (lines === 1) {
    return [val];
  }

  const chunked = chunkString(val, maxCharacters);

  if (!chunked) {
    return [val];
  }

  const intoLines = chunked.map((line) => line.trim()).slice(0, maxLines);

  const lastIndex = intoLines.length - 1;

  if (intoLines[lastIndex].length > maxCharacters - 4) {
    intoLines[lastIndex] += '...';
  }

  return intoLines;
}
