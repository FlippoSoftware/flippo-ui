import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'FlippoComponents',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'cjs' ? 'js' : 'mjs'}`
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
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
            '@lib': path.resolve(__dirname, './src/lib')
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
