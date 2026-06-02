import path from 'node:path';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Create entry points only for component indexes (matching package.json exports)
const componentEntries = glob.sync('src/components/*/index.ts').reduce((acc, file) => {
    const normalized = file.split('\\').join('/');
    const match = normalized.match(/src\/components\/(.+)\/index\.ts/);
    if (match) {
        acc[`components/${match[1]}/index`] = path.resolve(file);
    }
    return acc;
}, {} as Record<string, string>);

const entryPoints: Record<string, string> = {
    index: path.resolve('src/index.ts'),
    ...componentEntries
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({
        insertTypesEntry: true,
        beforeWriteFile: (filePath, content) => {
            return { filePath: filePath.replace('/src', ''), content };
        }
    })],
    build: {
        lib: {
            entry: entryPoints,
            name: 'FlippoComponents',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                entryFileNames: '[name].[format].js',
                chunkFileNames: 'shared/[name]-[hash].[format].js',
                assetFileNames: 'assets/[name].[ext]',
                globals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        },
        outDir: 'dist'
    },
    css: {
        modules: {
            localsConvention: 'camelCase'
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                loadPaths: ['./src/styles/'],
                style: 'compressed'
            }
        }
    },
    envPrefix: 'FLIPPO_',
    resolve: {
        alias: {
            '~@lib': path.resolve(__dirname, './src/lib')
        }
    },
    server: {
        host: '0.0.0.0', // '127.0.0.1',
        port: 3030,
        watch: {
            usePolling: true
        }
    }
});
