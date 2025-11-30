import path from 'node:path';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

const entryPoints = Object.fromEntries(
    glob.sync('src/**/*.{ts,tsx}', {
        ignore: ['src/**/*.test.{ts,tsx}']
    }).map((file) => [file.replace('src/', '').replace(/\.[^/.]+$/, ''), path.resolve(file)])
);

type VitestConfigExport = {
    test: InlineConfig;
} & UserConfig;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({
        insertTypesEntry: true,
        beforeWriteFile: (filePath, content) => {
            return { filePath: filePath.replace('/src', ''), content };
        }
    })],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        css: true,
        include: ['src/components/Tooltip/**/*.test.tsx']
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: entryPoints,
            name: 'FlippoHeadlessHooks',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].[format].js',
                chunkFileNames: '[name].[format].js'
            }
        }
    },
    envPrefix: 'HEADLESS_',
    resolve: {
        alias: { '~@lib': path.resolve(__dirname, './src/lib') }
    },
    server: {
        host: '0.0.0.0', // '127.0.0.1',
        port: 3030,
        watch: {
            usePolling: true
        }
    }
} as VitestConfigExport);
