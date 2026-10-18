/**
 * Compiles every page of `content/docs` as MDX (with GFM, like Fumadocs), so a page that the site could not build fails
 * here: `node scripts/check.ts`. Checks the relative links between pages (`./installation.mdx`) and the `meta.json`
 * files too: every page they list exists.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';

import { content } from './lib.ts';

const FRONTMATTER = /^---\n[\s\S]*?\n---\n/;
const RELATIVE_LINK = /\]\((\.{1,2}\/[^)#\s]+\.mdx)(?:#[^)]*)?\)/g;
const errors: string[] = [];
const files = readdirSync(content, { recursive: true, encoding: 'utf8' });

for (const file of files.filter((name) => name.endsWith('.mdx'))) {
    const text = readFileSync(join(content, file), 'utf8');
    if (!FRONTMATTER.test(text) || !/^title: /m.test(text.match(FRONTMATTER)?.[0] ?? '')) {
        errors.push(`${file}: no frontmatter title`);
    }
    for (const [, link] of text.matchAll(RELATIVE_LINK)) {
        if (!existsSync(join(content, dirname(file), link))) {
            errors.push(`${file}: broken link ${link}`);
        }
    }
    try {
        await compile(text.replace(FRONTMATTER, ''), { remarkPlugins: [remarkGfm] });
    } catch (error) {
        errors.push(`${file}: ${(error as Error).message}`);
    }
}

for (const file of files.filter((name) => /(^|\/)meta(\.\w+)?\.json$/.test(name))) {
    const { pages = [] } = JSON.parse(readFileSync(join(content, file), 'utf8')) as { pages?: string[] };
    const folder = join(content, dirname(file));
    for (const page of pages.filter((item) => !item.startsWith('---') && !item.startsWith('...') && !item.startsWith('['))) {
        if (!(existsSync(join(folder, `${page}.mdx`)) || existsSync(join(folder, page)))) {
            errors.push(`${file}: no page "${page}"`);
        }
    }
}

const pages = files.filter((name) => name.endsWith('.mdx')).length;
if (errors.length > 0) {
    console.error(errors.join('\n'));
    console.error(`docs: ${errors.length} problem(s) in ${pages} pages`);
    process.exit(1);
}
console.log(`docs: ${pages} pages compile`);
