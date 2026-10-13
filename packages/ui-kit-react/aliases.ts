import { fileURLToPath } from 'node:url';

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/**
 * Path aliases for Vite and Vitest (keep in sync with `compilerOptions.paths` in tsconfig.json; tsdown reads those).
 * The exact ones first: `~@src` and `~@stories` are entry files, `~@src/*` a folder.
 */
export const alias: { find: string | RegExp; replacement: string }[] = [
    { find: /^~@src$/, replacement: resolve('./src/index.ts') },
    { find: /^~@stories$/, replacement: resolve('./src/__stories__/index.ts') },
    { find: '~@src', replacement: resolve('./src') },
    { find: '~@lib', replacement: resolve('./src/lib') },
    { find: '~@components', replacement: resolve('./src/components') }
];
