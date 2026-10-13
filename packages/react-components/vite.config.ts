import path from 'node:path';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';

import type { UserConfig } from 'vite';

// Create entry points only for component indexes (matching package.json exports)
const componentEntries = glob.sync('src/components/*/index.ts').reduce(
    (acc, file) => {
        const normalized = file.split('\\').join('/');
        const match = normalized.match(/src\/components\/(.+)\/index\.ts/);
        if (match) {
            acc[`components/${match[1]}/index`] = path.resolve(file);
        }
        return acc;
    },
    {} as Record<string, string>
);

const entryPoints: Record<string, string> = {
    index: path.resolve('src/index.ts'),
    ...componentEntries,
    // Additional exports
    'lib/merge': path.resolve('src/lib/merge.ts'),
    'lib/hooks/useDirection': path.resolve('src/lib/hooks/useDirection.ts'),
    'lib/createHeadlessUIEventDetails': path.resolve('src/lib/createHeadlessUIEventDetails.ts')
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        lib: {
            entry: entryPoints,
            name: 'FlippoHeadlessComponents',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            // Dependencies stay imports: one copy of the core is shared with the app (its stores keep module-level state).
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@flippo-software/react-hooks',
                /^@flippo-ui\/hooks\//,
                /^@flippo-software\/core-components(\/|$)/
            ],
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
            '~@lib': path.resolve(import.meta.dirname, './src/lib'),
            '~@packages': path.resolve(import.meta.dirname, './src/packages')
        }
    },
    server: {
        host: '0.0.0.0', // '127.0.0.1',
        port: 3030,
        watch: {
            usePolling: true
        }
    }
} as UserConfig);
