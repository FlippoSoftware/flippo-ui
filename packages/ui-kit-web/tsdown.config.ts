import { readdirSync } from 'node:fs';

import { defineConfig } from 'tsdown';

const names = readdirSync('src/components');
export default defineConfig({
    entry: {
        index: 'src/index.ts',
        ...Object.fromEntries(
            names
                .filter((name) => name !== 'StoryCombine')
                .map((name) => [
                    name.replace(/[A-Z]/g, (letter, index) => `${index ? '-' : ''}${letter.toLowerCase()}`),
                    `src/components/${name}/index.ts`
                ])
        )
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    platform: 'browser',
    deps: { neverBundle: [/^@flippo/, /^react(?:$|\/)/, /^react-dom(?:$|\/)/] },
    exports: { customExports: { './styles.css': './src/styles.css' } }
});
