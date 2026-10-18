import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    platform: 'neutral',
    exports: true,
    // The store is a dependency, React a peer: neither is bundled (one copy of each in the app).
    external: ['react', '@flippo-software/store', 'use-sync-external-store']
});
