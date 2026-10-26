import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

import { checkPageTranslations, reviewPageTranslations, translatedPages } from './page-translations.ts';

const ENGLISH = 'docs/content/docs/installation.mdx';
const RUSSIAN = 'docs/content/docs/installation.ru.mdx';

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'flippo-page-translations-'));
    const write = (file: string, text: string) => {
        mkdirSync(dirname(join(root, file)), { recursive: true });
        writeFileSync(join(root, file), text);
    };
    write(ENGLISH, '---\ntitle: Installation\n---\n\nInstall the package.\n');
    write(RUSSIAN, '---\ntitle: Установка\n---\n\nУстановите пакет.\n');
    return { root, write, dispose: () => rmSync(root, { recursive: true, force: true }) };
}

test('a source edit is stale until that translated page is explicitly reviewed', () => {
    const f = fixture();
    try {
        assert.deepEqual(checkPageTranslations(f.root).missing, [RUSSIAN]);
        reviewPageTranslations(f.root, [RUSSIAN]);
        assert.deepEqual(checkPageTranslations(f.root).current, [RUSSIAN]);
        f.write(ENGLISH, '---\ntitle: Changed title\n---\n\nInstall the package and its peers.\n');
        assert.equal(checkPageTranslations(f.root).stale[0]?.file, RUSSIAN);
        reviewPageTranslations(f.root, ['content/docs/installation.ru.mdx'], join(f.root, 'docs'));
        assert.deepEqual(checkPageTranslations(f.root).current, [RUSSIAN]);
        f.write(ENGLISH, '---\r\ntitle: Another title\r\n---\r\n\r\nInstall the package and its peers.\r\n');
        assert.deepEqual(checkPageTranslations(f.root).current, [RUSSIAN]);
    } finally {
        f.dispose();
    }
});

test('generated translations are excluded and README translations use the generated overview body', () => {
    const f = fixture();
    try {
        f.write('docs/content/docs/react-components/api/button.ru.mdx', 'Generated reference');
        f.write('docs/content/docs/store/index.ru.mdx', '---\ntitle: Стор\n---\n\nСтор.\n');
        const overview = 'docs/content/docs/store/index.mdx';
        const translation = 'docs/content/docs/store/index.ru.mdx';
        assert.deepEqual(translatedPages(f.root), [RUSSIAN, translation]);
        assert.match(checkPageTranslations(f.root).errors[0] ?? '', /English source/);
        f.write(overview, '---\ntitle: Store\n---\n\n[Store](../store/index.mdx)\n');
        reviewPageTranslations(f.root, [translation]);
        assert.deepEqual(checkPageTranslations(f.root).current, [translation]);
        f.write(overview, '---\ntitle: Store\n---\n\n[Store API](../store/api/index.mdx)\n');
        assert.equal(checkPageTranslations(f.root).stale[0]?.file, translation);
    } finally {
        f.dispose();
    }
});

test('a malformed selection never partially reviews pages or approves empty translations', () => {
    const f = fixture();
    try {
        const before = readFileSync(join(f.root, RUSSIAN), 'utf8');
        assert.throws(() => reviewPageTranslations(f.root, [RUSSIAN, ENGLISH]), /not a hand-written translated page/);
        assert.equal(readFileSync(join(f.root, RUSSIAN), 'utf8'), before);
        f.write(RUSSIAN, '---\ntitle: Установка\n---\n');
        assert.throws(() => reviewPageTranslations(f.root, [RUSSIAN]), /no translated text/);
        assert.deepEqual(checkPageTranslations(f.root).missing, [RUSSIAN]);
    } finally {
        f.dispose();
    }
});

test('Storybook prose uses the same tracking and supports block frontmatter', () => {
    const f = fixture();
    try {
        const page = 'packages/ui-kit-react/.storybook/pages/introduction.ru.md';
        const source = page.replace('.ru.md', '.md');
        f.write(source, '---\ntitle: Introduction\n---\n\nIntroduction.\n');
        f.write(page, '---\ntitle: Введение\n---\n\nВведение.\n');
        reviewPageTranslations(f.root, [page]);
        const reviewed = readFileSync(join(f.root, page), 'utf8').replace(/l10n: \{ source: "([a-f0-9]+)" \}/, 'l10n:\n    source: "$1"');
        f.write(page, reviewed);
        assert.deepEqual(checkPageTranslations(f.root).current, [page]);
        f.write(page, reviewed.replace(/source: "[a-f0-9]+"/, 'source: invalid'));
        assert.match(checkPageTranslations(f.root).errors[0] ?? '', /invalid l10n/);
    } finally {
        f.dispose();
    }
});

test('the CLI writes its JSON on missing translations and invalid metadata, but stale prose stays warn-only', () => {
    const f = fixture();
    try {
        f.write('package.json', '{"type":"module"}');
        f.write('tools/storybook/i18n/en.json', '{}');
        f.write('tools/storybook/i18n/ru.json', '{}');
        for (const file of ['check.ts', 'lib.ts', 'page-translations.ts']) {
            f.write(`docs/scripts/${file}`, readFileSync(join(import.meta.dirname, file), 'utf8'));
        }
        symlinkSync(join(import.meta.dirname, '../node_modules'), join(f.root, 'docs/node_modules'), 'dir');
        const reportFile = join(f.root, 'status.json');
        const run = (...args: string[]) =>
            spawnSync(process.execPath, ['docs/scripts/check.ts', ...args, '--json', reportFile], { cwd: f.root, encoding: 'utf8' });
        assert.equal(run().status, 1);
        assert.deepEqual(JSON.parse(readFileSync(reportFile, 'utf8')).missing, [RUSSIAN]);
        assert.equal(run('--review', RUSSIAN).status, 0);
        f.write(ENGLISH, '---\ntitle: Installation\n---\n\nChanged English prose.\n');
        assert.equal(run().status, 0);
        assert.equal(JSON.parse(readFileSync(reportFile, 'utf8')).stale[0]?.file, RUSSIAN);
        f.write('docs/content/docs/meta.json', '{ invalid JSON');
        assert.equal(run().status, 1);
        assert.match(JSON.parse(readFileSync(reportFile, 'utf8')).errors[0], /meta.json/);
    } finally {
        f.dispose();
    }
});
