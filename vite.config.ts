import path from 'node:path';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

// Rollup outputs all modules under src/ because the entry paths include src/ — this
// plugin strips that prefix so the dist structure mirrors hooks/ and lib/ directly.
function stripSrcPrefix() {
    return {
        name: 'strip-src-prefix',
        generateBundle(_options: unknown, bundle: Record<string, { fileName: string }>) {
            for (const fileName of Object.keys(bundle)) {
                const normalized = fileName.replace(/\\/g, '/');
                const chunk = bundle[fileName];
                if (normalized.startsWith('src/') && chunk) {
                    const newFileName = normalized.slice(4);
                    chunk.fileName = newFileName;
                    bundle[newFileName] = chunk;
                    delete bundle[fileName];
                }
            }
        }
    };
}

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
        entryRoot: 'src',
        include: ['src/hooks/**/*.ts', 'src/lib/**/*.ts']
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
            external: (id: string) =>
                ['react', 'react-dom', 'tabbable', 'reselect'].includes(id) ||
                id.startsWith('use-sync-external-store'),
            plugins: [stripSrcPrefix()],
            output: {
                preserveModules: true,
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
