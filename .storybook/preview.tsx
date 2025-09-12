import React from 'react';

import type { Preview } from '@storybook/react';

import '../src/styles/global.scss';

import './storybook.scss';

const preview: Preview = {
    decorators: (Story) => (
        <React.Suspense fallback={'Loading...'}>
            <Story />
        </React.Suspense>
    ),
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        layout: 'centered'
    },
    tags: ['autodocs']
};

export default preview;
