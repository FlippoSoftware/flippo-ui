import * as React from 'react';
import type { Preview } from '@storybook/react';

import { DocsPage, flippoTheme, followGlobals } from '@flippo-software/workspace-tools/storybook';
import { connectLocale, localeGlobalType, setLocale } from '@flippo-software/workspace-tools/storybook/i18n';

// The docs pages follow the toolbar's language; the decorator sets it for the stories.
connectLocale();
// The theme of the toolbar on the whole document, for the docs and MDX pages too (the decorator sets it for stories).
followGlobals({ theme: 'dark' }, (globals) => {
    if (typeof globals.theme === 'string') document.documentElement.dataset.theme = globals.theme;
});
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
        (Story, context) => {
            setLocale(context.globals.locale, { notify: 'later' });
            return (
                <Theme theme={context.globals.theme}>
                    <Story />
                </Theme>
            );
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
        // Every component's docs page: header, controls, the API reference (`tools/api-docs.ts`), variants, CSS hooks.
        docs: { page: () => <DocsPage kind='react' />, theme: flippoTheme('React') },
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
