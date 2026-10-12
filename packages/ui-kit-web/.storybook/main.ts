import type { StorybookConfig } from '@storybook/web-components-vite';

import { clientConditions, stylesAliases } from '../../../tools/workspace';

const config: StorybookConfig = {
    framework: '@storybook/web-components-vite',
    stories: ['../stories/**/*.stories.ts'],
    addons: ['@storybook/addon-essentials'],
    core: { disableTelemetry: true },
    async viteFinal(config) {
        // component-styles from its sources: style and recipe changes reload without building it.
        const aliases = Array.isArray(config.resolve?.alias) ? config.resolve.alias : Object.entries(config.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement }));
        return {
            ...config,
            resolve: { ...config.resolve, dedupe: ['react', 'react-dom'], conditions: clientConditions, alias: [...stylesAliases, ...aliases] }
        };
    }
};
export default config;
