/** Writes the CI job summary and fails on missing reports, generation errors or missing translations. */
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

type Report = {
    missing?: string[];
    stale?: { key?: string; file?: string; page?: string; contract?: string }[];
    errors?: string[];
    pages?: number;
};

const args = process.argv.slice(2);
const folder = args[args.indexOf('--reports') + 1];
const generation = args[args.indexOf('--generation') + 1];
const errors: string[] = [];
if (!args.includes('--reports') || !folder || !args.includes('--generation') || !generation) {
    throw new Error('Usage: node tools/docs-summary.ts --generation <success|failure> --reports <folder>');
}
function read(name: string): Report {
    try {
        const result: Report = JSON.parse(readFileSync(join(folder, `${name}.json`), 'utf8'));
        if (!Array.isArray(result.errors) || !Array.isArray(result.stale) || (name !== 'registry' && !Array.isArray(result.missing))) {
            throw new Error('invalid report schema');
        }
        errors.push(...result.errors.map((error) => `${name}: ${error}`));
        return result;
    } catch (error) {
        errors.push(`${name}: ${(error as Error).message}`);
        return {};
    }
}
const i18n = read('i18n');
const pages = read('pages');
const registry = read('registry');
if (generation !== 'success') errors.push(`Documentation generation: ${generation}`);
const missing = [...(i18n.missing ?? []), ...(pages.missing ?? [])];
const escapeCell = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\|/g, '\\|')
        .replace(/[\r\n]+/g, ' ');
const lines = [
    '## Documentation',
    '',
    '| Check | Result |',
    '| --- | --- |',
    `| Generated pages | ${generation === 'success' ? `OK (${pages.pages ?? '?'} pages)` : 'Failed'} |`,
    `| Missing translations | ${missing.length} |`,
    `| Stale dictionary translations | ${i18n.stale?.length ?? '?'} (warning) |`,
    `| Stale translated pages | ${pages.stale?.length ?? '?'} (warning) |`,
    `| Guide contracts to review | ${registry.stale?.length ?? '?'} (warning) |`,
    `| Errors | ${errors.length} |`,
    ''
];
function details(title: string, entries: string[]) {
    if (entries.length === 0) return;
    lines.push(
        `<details><summary>${title} (${entries.length})</summary>`,
        '',
        ...entries.map((entry) => `- ${escapeCell(entry)}`),
        '',
        '</details>',
        ''
    );
}
details('Missing translations', missing);
details('Stale translations', [...(i18n.stale ?? []).map((item) => item.key ?? ''), ...(pages.stale ?? []).map((item) => item.file ?? '')]);
details(
    'Guides to review',
    (registry.stale ?? []).map((item) => `${item.page}: ${item.contract}`)
);
details('Errors', errors);
const summary = `${lines.join('\n')}\n`;
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
else console.log(summary);
if (errors.length > 0 || missing.length > 0) process.exitCode = 1;
