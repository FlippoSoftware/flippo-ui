import { html } from 'lit';
import type { Preview } from '@storybook/web-components';
// The kit's stylesheet (`src/styles.css`) is this import; Storybook resolves it to the SCSS sources (`tools/workspace.ts`).
import '@flippo-software/component-styles/css/index.css';
import './preview.css';
import { define } from '../src';
define({ prefix: 'demo' });
const preview: Preview = {
    decorators: [
        (Story, context) => {
            document.documentElement.dataset.theme = context.globals.theme;
            return html`<div class="story-canvas" data-theme=${context.globals.theme}>${Story()}</div>`;
        }
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
