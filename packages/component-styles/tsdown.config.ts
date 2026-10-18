import { readdirSync } from 'node:fs';

import { defineConfig } from 'tsdown';

/**
 * Every component is an entry point of its own (`@flippo-software/component-styles/button`), like in the other
 * component packages. The stylesheets are built by `scripts/build-css.ts`; their exports are added here.
 */
const COMPONENTS = readdirSync('src/components').sort();

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        layouts: 'src/layouts/index.ts',
        icons: 'src/icons/index.ts',
        dom: 'src/dom/index.ts',
        theme: 'src/theme/index.ts',
        sizes: 'src/sizes/index.ts',
        ...Object.fromEntries(COMPONENTS.map((name) => [name, `src/components/${name}/index.ts`]))
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: ['dist/*.js', 'dist/*.cjs', 'dist/*.d.*', 'dist/*.map'],
    platform: 'neutral',
    deps: { neverBundle: [/^@lynstack\//] },
    exports: {
        // In the workspace the kits resolve the `source` condition to `src/` (Storybook, Vitest, TypeScript): a change
        // here shows up there without a build. Other consumers keep the `dist` conditions.
        devExports: 'source',
        customExports: {
            './css/*': './dist/css/*',
            './scss': {
                sass: './scss/_index.scss',
                default: './scss/_index.scss'
            },
            './fonts/*': './fonts/*'
        }
    }
});
