import { html } from 'lit';
import type { Preview } from '@storybook/web-components';
import { createElement } from 'react';

import { DocsPage, flippoTheme, followGlobals } from '@flippo-software/workspace-tools/storybook';
import { connectLocale, localeGlobalType, setLocale } from '@flippo-software/workspace-tools/storybook/i18n';
// The kit's stylesheet (`src/styles.css`) is this import; Storybook resolves it to the SCSS sources (`tools/workspace.ts`).
import '@flippo-software/component-styles/css/index.css';
import './preview.css';
import { define } from '../src';
define({ prefix: 'demo' });
// The docs pages follow the toolbar's language; the decorator sets it for the stories.
connectLocale();
// The theme of the toolbar on the whole document, for the docs and MDX pages too (the decorator sets it for stories).
followGlobals({ theme: 'dark' }, (globals) => {
    if (typeof globals.theme === 'string') document.documentElement.dataset.theme = globals.theme;
});
const preview: Preview = {
    decorators: [
        (Story, context) => {
            setLocale(context.globals.locale, { notify: 'later' });
            document.documentElement.dataset.theme = context.globals.theme;
            return html`<div class="story-canvas" data-theme=${context.globals.theme}>${Story()}</div>`;
        }
    ],
    globalTypes: {
        theme: { description: 'Color theme', toolbar: { icon: 'circlehollow', items: ['dark', 'light'], dynamicTitle: true } },
        locale: localeGlobalType
    },
    initialGlobals: { theme: 'dark', locale: 'en' },
    parameters: {
        layout: 'fullscreen',
        controls: { expanded: true },
        // Every component's docs page (rendered with React, as all Storybook docs): header, controls, the API reference
        // of the elements (`tools/api-docs.ts`), variants, CSS hooks.
        docs: { page: () => createElement(DocsPage, { kind: 'web', prefix: 'demo' }), theme: flippoTheme('Web Components') },
        options: {
            storySort: {
                order: [
                    'Overview',
                    ['Getting started', 'Themes and sizes', 'Tokens'],
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
