import React from 'react';

import {addParameters} from '@storybook/react';
import {DocsPage, DocsContainer} from '@storybook/addon-docs';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

export const parameters = {
  options: {
    storySort: {
      order: ['Docs', 'Charts', 'Subcomponents'],
    },
  },
};

export const decorators = [
  (Story) => (
    <div
      style={{
        padding: '20px',
        boxSizing: 'border-box',
        height: '400px',
        overflow: 'hidden',
      }}
    >
      <Story />
    </div>
  ),
];
