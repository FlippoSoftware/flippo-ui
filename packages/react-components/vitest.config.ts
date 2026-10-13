import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';

// Separate from vite.config.ts: the build loads vite-plugin-dts, which needs the TypeScript JS API
// that TypeScript 7 doesn't provide.
const test: InlineConfig = {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    server: {
        deps: {
            // Process the linked packages with Vite so `resolve.dedupe` applies to their imports
            // (otherwise Node resolves React from their own node_modules).
            inline: [/@flippo-ui\/hooks/, /@flippo\/internal-test-utils/]
        }
    }
};

// The `test` key is typed explicitly: vitest 3's augmentation of vite's `UserConfig` is not picked up by TypeScript 7.
export default defineConfig({
    plugins: [react()],
    test,
    resolve: {
        // The workspace packages (core-components, react-hooks, internal-test-utils) have their own node_modules:
        // use one copy of React, Testing Library and Vitest.
        dedupe: ['react', 'react-dom', '@testing-library/react', '@testing-library/dom', '@testing-library/user-event', 'vitest'],
        alias: [
            // See src/test/shims/useSyncExternalStoreWithSelector.ts.
            {
                find: /^use-sync-external-store\/(shim\/)?with-selector(\.js)?$/,
                replacement: path.resolve(import.meta.dirname, './src/test/shims/useSyncExternalStoreWithSelector.ts')
            },
            { find: '~@lib', replacement: path.resolve(import.meta.dirname, './src/lib') },
            { find: '~@packages', replacement: path.resolve(import.meta.dirname, './src/packages') }
        ]
    }
} as UserConfig & { test: InlineConfig });
