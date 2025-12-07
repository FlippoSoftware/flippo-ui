import path from 'node:path';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import type { UserConfig } from 'vite';
import type { InlineConfig } from 'vitest';

// Create entry points only for component indexes (matching package.json exports)
const componentEntries = glob.sync('src/components/*/index.ts').reduce((acc, file) => {
    const match = file.match(/src\/components\/(.+)\/index\.ts/);
    if (match) {
        acc[`components/${match[1]}/index`] = path.resolve(file);
    }
    return acc;
}, {} as Record<string, string>);

const entryPoints: Record<string, string> = {
    'index': path.resolve('src/index.ts'),
    ...componentEntries,
    // Additional exports
    'lib/merge': path.resolve('src/lib/merge.ts'),
    'lib/hooks/useDirection': path.resolve('src/lib/hooks/useDirection.ts')
};

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
            name: 'FlippoHeadlessComponents',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                entryFileNames: '[name].[format].js',
                chunkFileNames: 'shared/[name]-[hash].[format].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
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
            '~@lib': path.resolve(__dirname, './src/lib'),
            '~@packages': path.resolve(__dirname, './src/packages')
        }
    },
    server: {
        host: '0.0.0.0', // '127.0.0.1',
        port: 3030,
        watch: {
            usePolling: true
        }
    }
} as VitestConfigExport);
