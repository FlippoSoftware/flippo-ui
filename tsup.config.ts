import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  target: 'es2022',
  platform: 'neutral',
  loader: {
    '.tsx': 'tsx',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
  external: [
    'react',
    'react-dom',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'vitest',
    'jsdom'
  ],
  banner: {
    js: `import React from 'react';`,
  },
});
