import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

type VitestConfigExport = {
    test: InlineConfig;
} & UserConfig;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        // you might want to disable it, if you don't have tests that rely on CSS
        // since parsing CSS is slow
        css: true,
        include: ['src/components/Tooltip/**/*.test.tsx']
    },
    build: {
        outDir: 'build'
    },
    css: {
        modules: {
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                loadPaths: ['./src/settings/styles/'],
                style: 'compressed'
            }
        }
    },
    envPrefix: 'HEADLESS_',
    resolve: {
        alias: {
            '@lib': path.resolve(__dirname, './src/lib')
        }
    },
    esbuild: {
        jsxInject: `import React from 'react'`
    },
    server: {
        host: '0.0.0.0', // '127.0.0.1',
        port: 3030,
        watch: {
            usePolling: true
        }
    }
} as VitestConfigExport);
