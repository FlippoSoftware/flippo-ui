import * as React from 'react';
import type { Preview } from '@storybook/react';
// The kit's stylesheet (`src/styles.css`) is this import; Storybook resolves it to the SCSS sources (`tools/workspace.ts`).
import '@flippo-software/component-styles/css/index.css';
import './preview.css';
function Theme({ theme, children }: { theme: string; children: React.ReactNode }) {
    React.useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);
    return (
        <div className='story-canvas' data-theme={theme}>
            {children}
        </div>
    );
}
const preview: Preview = {
    decorators: [
        (Story, context) => (
            <Theme theme={context.globals.theme}>
                <Story />
            </Theme>
        )
    ],
    globalTypes: { theme: { description: 'Color theme', toolbar: { icon: 'circlehollow', items: ['dark', 'light'], dynamicTitle: true } } },
    initialGlobals: { theme: 'dark' },
    parameters: {
        layout: 'fullscreen',
        controls: { expanded: true },
        options: {
            storySort: {
                order: [
                    'Actions',
                    'Forms',
                    'Navigation',
                    'Disclosure',
                    'Overlays',
                    'Feedback',
                    'Display',
                    'Typography',
                    'Layout',
                    'Utilities'
                ]
            }
        }
    },
    tags: ['autodocs']
};
export default preview;
