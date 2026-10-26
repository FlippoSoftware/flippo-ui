import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cleanups: (() => void)[] = [];
afterEach(() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
});

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'flippo-docs-summary-'));
    cleanups.push(() => rmSync(root, { recursive: true, force: true }));
    const put = (name: string, value: unknown) => writeFileSync(join(root, `${name}.json`), JSON.stringify(value));
    put('i18n', { missing: [], stale: [], current: 2, errors: [] });
    put('pages', { missing: [], stale: [], current: ['page.ru.mdx'], errors: [], pages: 12 });
    put('registry', { stale: [], errors: [] });
    const summaryFile = join(root, 'summary.md');
    const run = (generation = 'success') => {
        const result = spawnSync(
            process.execPath,
            [fileURLToPath(new URL('docs-summary.ts', import.meta.url)), '--reports', root, '--generation', generation],
            { encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: summaryFile } }
        );
        return { ...result, summary: readFileSync(summaryFile, 'utf8') };
    };
    return { root, put, run, summaryFile };
}

test('current reports pass and append their readable status to the existing job summary', () => {
    const f = fixture();
    writeFileSync(f.summaryFile, 'Earlier job details\n');
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.summary, /^Earlier job details\n/);
    assert.match(result.summary, /Generated pages \| OK \(12 pages\)/);
    assert.match(result.summary, /Missing translations \| 0/);
    assert.match(result.summary, /Errors \| 0/);
});

test('stale dictionary text, translated prose and guide contracts only warn', () => {
    const f = fixture();
    f.put('i18n', { missing: [], stale: [{ key: 'api.Checkbox.Root.description' }], errors: [] });
    f.put('pages', { missing: [], stale: [{ file: 'installation.ru.mdx' }], errors: [], pages: 12 });
    f.put('registry', { stale: [{ page: 'theming.mdx', contract: 'exports:ui-kit-react' }], errors: [] });
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.summary, /Stale dictionary translations \| 1 \(warning\)/);
    assert.match(result.summary, /Stale translated pages \| 1 \(warning\)/);
    assert.match(result.summary, /Guide contracts to review \| 1 \(warning\)/);
    assert.match(result.summary, /api\.Checkbox\.Root\.description/);
    assert.match(result.summary, /installation\.ru\.mdx/);
    assert.match(result.summary, /theming\.mdx: exports:ui-kit-react/);
});

test('missing dictionary translations or prose metadata fail even with successful generation', () => {
    for (const name of ['i18n', 'pages']) {
        const f = fixture();
        f.put(name, { missing: ['missing <translation> | field\nnext'], stale: [], errors: [] });
        const result = f.run();
        assert.equal(result.status, 1, name);
        assert.match(result.summary, /Missing translations \| 1/);
        assert.match(result.summary, /missing &lt;translation&gt; \\\| field next/);
        assert.doesNotMatch(result.summary, /<translation>/);
    }
});

test('generation failure and reported validation errors cannot pass the final CI gate', () => {
    const generation = fixture().run('failure');
    assert.equal(generation.status, 1);
    assert.match(generation.summary, /Generated pages \| Failed/);
    assert.match(generation.summary, /Documentation generation: failure/);
    const f = fixture();
    f.put('pages', { missing: [], stale: [], errors: ['broken link ./missing.mdx'] });
    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.summary, /pages: broken link \.\/missing\.mdx/);
});

test('missing, unreadable or invalid reports fail instead of looking like zero problems', () => {
    for (const name of ['i18n', 'pages', 'registry']) {
        const f = fixture();
        rmSync(join(f.root, `${name}.json`));
        const result = f.run();
        assert.equal(result.status, 1, name);
        assert.match(result.summary, new RegExp(`${name}:`));
    }
    const f = fixture();
    writeFileSync(join(f.root, 'i18n.json'), '{ invalid JSON');
    f.put('registry', {});
    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.summary, /i18n:/);
    assert.match(result.summary, /registry: invalid report schema/);
});
