import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
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
            '@lib': './src/lib'
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
}) satisfies UserConfig;
