/**
 * Development wiring of the workspace: the kits read `@flippo-software/component-styles` from its sources, so a
 * change to a style or a recipe shows up in their Storybook and tests without building the package.
 */
import { fileURLToPath } from 'node:url';

/** The custom export condition of the workspace packages' sources (`devExports: 'source'` in their tsdown config). */
export const SOURCE_CONDITION = 'source';

/** Vite's default conditions, after the source condition: browser code (Storybook, Vitest with a DOM). */
export const clientConditions: string[] = [SOURCE_CONDITION, 'module', 'browser', 'development|production'];

/** Vite's default conditions, after the source condition: code run by Node (Vitest's SSR transforms). */
export const serverConditions: string[] = [SOURCE_CONDITION, 'module', 'node', 'development|production'];

const componentStyles = fileURLToPath(new URL('../packages/component-styles/', import.meta.url));

/**
 * The stylesheet of the kits (`component-styles/css/index.css`, built from SCSS) mapped to its SCSS source: Vite
 * compiles it and reloads it on change.
 */
export const stylesAliases: { find: RegExp; replacement: string }[] = [
    {
        find: /^@flippo-software\/component-styles\/css\/index\.css$/,
        replacement: `${componentStyles}src/styles/index.scss`
    }
];
