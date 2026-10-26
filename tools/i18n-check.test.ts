import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, test } from 'node:test';

import { docsHash } from './docs-hash.ts';

const cleanups: (() => void)[] = [];
afterEach(() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
});

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'flippo-i18n-'));
    cleanups.push(() => rmSync(root, { recursive: true, force: true }));
    const put = (file: string, value: unknown) => {
        mkdirSync(dirname(join(root, file)), { recursive: true });
        writeFileSync(join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
    };
    put('package.json', { type: 'module' });
    put('tools/api-docs.ts', '');
    for (const file of ['i18n-check.ts', 'docs-hash.ts']) copyFileSync(new URL(file, import.meta.url), join(root, 'tools', file));
    put('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Root', description: 'A checkbox.', props: [] }] } });
    put('tools/storybook/core-enums.json', {});
    put('packages/web-components/custom-elements.json', { modules: [] });
    put('tools/storybook/i18n/en.json', { api: { Checkbox: { Root: { description: 'A checkbox.' } } }, docs: { title: 'Example' } });
    put('tools/storybook/i18n/ru.json', { api: { Checkbox: { Root: { description: 'Флажок.' } } }, docs: { title: 'Пример' } });
    put('tools/storybook/i18n/ru.sources.json', {
        'api.Checkbox.Root.description': docsHash('A checkbox.'),
        'docs.title': docsHash('Example')
    });
    const read = (file: string) => JSON.parse(readFileSync(join(root, file), 'utf8'));
    const run = (...args: string[]) => {
        const result = spawnSync(process.execPath, [join(root, 'tools/i18n-check.ts'), ...args, '--json', join(root, 'report.json')], {
            encoding: 'utf8'
        });
        return { ...result, report: read('report.json') };
    };
    return { root, put, read, run, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test('source edits stay stale after --write until the selected translation is reviewed', () => {
    const f = fixture();
    assert.equal(f.run().status, 0);
    f.put('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Root', description: 'A new checkbox.', props: [] }] } });
    assert.equal(f.run().status, 1, 'English drift must still block lint');
    const written = f.run('--write');
    assert.equal(written.status, 0);
    assert.deepEqual(written.report.stale, [{ key: 'api.Checkbox.Root.description', en: 'A new checkbox.', ru: 'Флажок.' }]);
    assert.equal(f.read('tools/storybook/i18n/ru.sources.json')['api.Checkbox.Root.description'], docsHash('A checkbox.'));
    assert.equal(f.run().report.stale.length, 1, 'warning survives subsequent checks');
    assert.equal(f.run('--review', 'api.Checkbox').report.stale.length, 0);
    assert.equal(f.read('tools/storybook/i18n/ru.sources.json')['docs.title'], docsHash('Example'));
});

test('missing or empty Russian text and missing source hashes block the check', () => {
    const f = fixture();
    f.put('tools/storybook/i18n/ru.json', { docs: { title: '' } });
    const result = f.run();
    assert.equal(result.status, 1);
    assert.equal(result.report.missing.length, 2);
    f.put('tools/storybook/i18n/ru.json', { api: { Checkbox: { Root: { description: 'Флажок.' } } }, docs: { title: 'Пример' } });
    f.put('tools/storybook/i18n/ru.sources.json', {});
    assert.equal(f.run().report.missing.length, 2);
});

test('--review validates all selectors before writing and refuses blanket review', () => {
    const f = fixture();
    const before = f.read('tools/storybook/i18n/ru.sources.json');
    assert.equal(f.run('--review', 'docs', 'typo').status, 1);
    assert.deepEqual(f.read('tools/storybook/i18n/ru.sources.json'), before);
    assert.equal(f.run('--review', '--all-current').status, 1);
    assert.equal(f.run('--review', 'doc').status, 1, 'prefixes match dot boundaries');
});

test('--write prunes removed keys without acknowledging new keys', () => {
    const f = fixture();
    f.put('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Indicator', description: 'An indicator.', props: [] }] } });
    const result = f.run('--write');
    assert.equal(result.status, 1);
    assert.equal(result.report.missing.length, 1);
    assert.deepEqual(f.read('tools/storybook/i18n/ru.sources.json'), { 'docs.title': docsHash('Example') });
});

test('source hashes normalize CRLF and surrounding whitespace only', () => {
    assert.equal(docsHash('  One\r\nTwo\n'), docsHash('One\nTwo'));
    assert.notEqual(docsHash('One  Two'), docsHash('One Two'));
});

test('a malformed --json option never writes a file named after the next flag', () => {
    const f = fixture();
    const result = spawnSync(process.execPath, [join(f.root, 'tools/i18n-check.ts'), '--json', '--review'], {
        cwd: f.root,
        encoding: 'utf8'
    });
    assert.equal(result.status, 1);
    assert.equal(existsSync(join(f.root, '--review')), false);
});
