/**
 * Compiles every page of `content/docs` as MDX (with GFM, like Fumadocs), so a page that the site could not build fails
 * here: `node scripts/check.ts`. Checks the relative links between pages (`./installation.mdx`) and the `meta.json`
 * files too: every page they list exists. Translated prose is checked against its English body; `--review <file>…`
 * records a reviewed translation and `--json <file>` writes the status even when validation fails.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';

import { content, root } from './lib.ts';
import { checkPageTranslations, FRONTMATTER, pageBody, reviewPageTranslations } from './page-translations.ts';

const RELATIVE_LINK = /\]\((\.{1,2}\/[^)#\s]+\.mdx)(?:#[^)]*)?\)/g;
const errors: string[] = [];
const args = process.argv.slice(2);
const review: string[] = [];
let jsonFile: string | undefined;
for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--json' && args[index + 1] && !args[index + 1].startsWith('--')) {
        jsonFile = resolve(args[++index]);
    } else if (arg === '--review') {
        const start = review.length;
        while (args[index + 1] && !args[index + 1].startsWith('--')) review.push(args[++index]);
        if (start === review.length) errors.push('--review requires at least one translated file');
    } else {
        errors.push(`Unknown or incomplete option: ${arg}`);
    }
}
if (review.length > 0 && errors.length === 0) {
    try {
        const reviewed = reviewPageTranslations(root, review);
        console.log(`docs: reviewed ${reviewed.length} translated page(s)`);
    } catch (error) {
        errors.push((error as Error).message);
    }
}
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
        await compile(pageBody(text), { remarkPlugins: [remarkGfm] });
    } catch (error) {
        errors.push(`${file}: ${(error as Error).message}`);
    }
}

for (const file of files.filter((name) => /(^|\/)meta(\.\w+)?\.json$/.test(name))) {
    try {
        const { pages = [] } = JSON.parse(readFileSync(join(content, file), 'utf8')) as { pages?: unknown };
        if (!Array.isArray(pages) || !pages.every((page): page is string => typeof page === 'string')) {
            errors.push(`${file}: pages must be an array of strings`);
            continue;
        }
        const folder = join(content, dirname(file));
        for (const page of pages.filter((item) => !item.startsWith('---') && !item.startsWith('...') && !item.startsWith('['))) {
            if (!(existsSync(join(folder, `${page}.mdx`)) || existsSync(join(folder, page)))) {
                errors.push(`${file}: no page "${page}"`);
            }
        }
    } catch (error) {
        errors.push(`${file}: ${(error as Error).message}`);
    }
}

const pages = files.filter((name) => name.endsWith('.mdx')).length;
const translations = checkPageTranslations(root);
errors.push(...translations.errors);
for (const file of translations.missing)
    errors.push(`${file}: missing translation text or l10n.source (review the translation, then use --review)`);
if (translations.stale.length > 0) {
    console.warn(`docs: ${translations.stale.length} stale translated page(s) (warning only):`);
    for (const { file, source } of translations.stale) console.warn(`  ${file} ← ${source}`);
}
if (jsonFile) {
    mkdirSync(dirname(jsonFile), { recursive: true });
    writeFileSync(jsonFile, `${JSON.stringify({ ...translations, errors, pages }, null, 4)}\n`);
}
if (errors.length > 0) {
    console.error(errors.join('\n'));
    console.error(`docs: ${errors.length} problem(s) in ${pages} pages`);
    process.exit(1);
}
console.log(`docs: ${pages} pages compile; translations: ${translations.current.length} current, ${translations.stale.length} stale`);
