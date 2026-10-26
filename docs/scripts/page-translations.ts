/** Tracks translated prose against the English page body, independently of generated API pages. */
import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { docsHash } from '@flippo-software/workspace-tools/docs-hash';

export const FRONTMATTER = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const L10N = /^l10n:[^\n]*(?:\n[ \t]+[^\n]*)*/gm;
const INLINE_SOURCE = /^l10n:[ \t]*\{[ \t]*source:[ \t]*(["']?)([a-f0-9]{12})\1[ \t]*\}[ \t]*(?:#.*)?$/;
const BLOCK_SOURCE = /^l10n:[ \t]*(?:#.*)?\n[ \t]+source:[ \t]*(["']?)([a-f0-9]{12})\1[ \t]*(?:#.*)?$/;
const PATTERNS = ['docs/content/docs/**/*.ru.mdx', 'packages/ui-kit-*/.storybook/pages/*.ru.md', 'tools/storybook/pages/*.ru.md'];

export type PageTranslationReport = {
    missing: string[];
    stale: { file: string; source: string; expected: string; actual: string }[];
    current: string[];
    errors: string[];
};

export function pageBody(text: string): string {
    return text.replace(FRONTMATTER, '');
}

/** Generated API pages use the dictionaries; README overview translations remain hand-written. */
export function translatedPages(root: string): string[] {
    return globSync(PATTERNS, { cwd: root })
        .map((file) => file.replace(/\\/g, '/'))
        .filter((file) => !/^docs\/content\/docs\/[^/]+\/api\//.test(file))
        .sort();
}

function sourceOf(file: string): string {
    return file.replace(/\.ru\.(mdx?)$/, '.$1');
}

/** The small l10n schema supports either inline or block YAML, with an optional quoted hash. */
function sourceHash(text: string): string | undefined {
    const header = text.match(FRONTMATTER)?.[1].replace(/\r\n/g, '\n') ?? '';
    const fields = [...header.matchAll(L10N)];
    if (fields.length === 0) return undefined;
    const hash = fields[0][0].match(INLINE_SOURCE)?.[2] ?? fields[0][0].match(BLOCK_SOURCE)?.[2];
    if (fields.length !== 1 || !hash) throw new Error('invalid l10n; expected l10n: { source: "<12 lowercase hex characters>" }');
    return hash;
}

function withSourceHash(text: string, hash: string): string {
    const normalized = text.replace(/\r\n/g, '\n');
    const frontmatter = normalized.match(FRONTMATTER);
    const field = `l10n: { source: "${hash}" }`;
    if (!frontmatter) return `---\n${field}\n---\n\n${normalized}`;
    const header = frontmatter[1];
    const updated = [...header.matchAll(L10N)].length > 0 ? header.replace(L10N, field) : `${header}\n${field}`;
    return `---\n${updated}\n---\n${normalized.slice(frontmatter[0].length)}`;
}

/** Reviews only named translated files. Validate every target before changing any of them. */
export function reviewPageTranslations(root: string, files: string[], cwd = process.cwd()): string[] {
    const tracked = new Set(translatedPages(root));
    const updates = new Map<string, string>();
    for (const input of files) {
        const candidates = [resolve(cwd, input), resolve(root, input)].map((file) => relative(root, file).replace(/\\/g, '/'));
        const file = candidates.find((candidate) => tracked.has(candidate));
        if (!file) throw new Error(`--review: not a hand-written translated page: ${input}`);
        const text = readFileSync(join(root, file), 'utf8');
        sourceHash(text);
        if (!pageBody(text).trim()) throw new Error(`--review: ${file} has no translated text`);
        const source = sourceOf(file);
        if (!existsSync(join(root, source)))
            throw new Error(`--review: ${file}: English source ${source} is missing (run pnpm docs:build)`);
        updates.set(file, withSourceHash(text, docsHash(pageBody(readFileSync(join(root, source), 'utf8')))));
    }
    for (const [file, text] of updates) writeFileSync(join(root, file), text);
    return [...updates.keys()];
}

export function checkPageTranslations(root: string): PageTranslationReport {
    const report: PageTranslationReport = { missing: [], stale: [], current: [], errors: [] };
    for (const file of translatedPages(root)) {
        try {
            const text = readFileSync(join(root, file), 'utf8');
            const actual = sourceHash(text);
            const source = sourceOf(file);
            if (!existsSync(join(root, source))) {
                report.errors.push(`${file}: English source ${source} is missing (run pnpm docs:build)`);
                continue;
            }
            const expected = docsHash(pageBody(readFileSync(join(root, source), 'utf8')));
            if (!actual || !pageBody(text).trim()) report.missing.push(file);
            else if (actual !== expected) report.stale.push({ file, source, expected, actual });
            else report.current.push(file);
        } catch (error) {
            report.errors.push(`${file}: ${(error as Error).message}`);
        }
    }
    return report;
}
