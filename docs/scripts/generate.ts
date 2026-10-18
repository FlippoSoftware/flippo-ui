/**
 * Generates the reference pages of the site into `content/docs` (Fumadocs layout, one file per language:
 * `checkbox.mdx`, `checkbox.ru.mdx`): `node scripts/generate.ts`, after `pnpm build` at the root.
 *
 * | Package | Generator | Source |
 * | --- | --- | --- |
 * | every package | `readme.ts` | its README (overview page) |
 * | store, react-store, core-components | `typedoc.ts` | TypeDoc + typedoc-plugin-markdown, from `dist/*.d.ts` |
 * | react-components | `react-components.ts` | `tools/storybook/api.json` (`tools/api-docs.ts`, JSDoc) |
 * | web-components | `web-components.ts` | `custom-elements.json` (Custom Elements Manifest) |
 * | component-styles | `component-styles.ts` | compiled tokens, SassDoc of `scss/`, the class recipes |
 *
 * The hand-written pages (`index`, `installation`, the kits' themes…) are versioned next to them; the generated ones
 * are ignored by git.
 */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import { generateComponentStyles } from './component-styles.ts';
import { root } from './lib.ts';
import { generateReactComponents } from './react-components.ts';
import { generateOverviews } from './readme.ts';
import { generateTypeDoc } from './typedoc.ts';
import { generateWebComponents } from './web-components.ts';

// The API of react-components, shared with the Storybook docs pages.
execFileSync(process.execPath, [join(root, 'tools/api-docs.ts')], { stdio: 'inherit' });

const typedoc = await generateTypeDoc();
console.log(`docs: TypeDoc → ${typedoc.join(', ')}`);
console.log(`docs: react-components → ${generateReactComponents()} components`);
console.log(`docs: web-components → ${generateWebComponents()} components`);
const styles = await generateComponentStyles();
console.log(`docs: component-styles → ${styles.tokens} tokens, ${styles.scss} SCSS items, ${styles.components} components`);
// Last: the meta of a package folder lists its `api` folder when there is one.
console.log(`docs: ${generateOverviews()} package overviews`);
