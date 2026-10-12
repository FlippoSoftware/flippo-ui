import type { StorybookConfig } from '@storybook/react-vite';

import { clientConditions, stylesAliases } from '@flippo-software/workspace-tools';

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../stories/**/*.stories.tsx'],
    addons: ['@storybook/addon-essentials'],
    core: { disableTelemetry: true },
    typescript: { reactDocgen: false },
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
