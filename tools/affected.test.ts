import assert from 'node:assert/strict';
import { test } from 'node:test';

import { selectAffected } from './affected.ts';

/** Supplies the package inventory without creating commits or touching the developer's checkout. */
function fixture() {
    const packages = new Set(['store', 'react-components', 'component-styles', 'ui-kit-react']);
    return (files: string[]) => {
        const warnings: string[] = [];
        const outputs = selectAffected(
            files,
            (folder: string) => packages.has(folder),
            (message: string) => warnings.push(message)
        );
        return { outputs, stderr: warnings.join('\n') };
    };
}

test('unrelated markdown and empty diffs skip all verification', () => {
    const run = fixture();
    const skipped = { any: 'false', docs: 'false', build: '', verify: '' };
    assert.deepEqual(run([]).outputs, skipped);
    assert.deepEqual(run(['README.md', 'packages/store/CHANGELOG.md']).outputs, skipped);
});

test('documentation prose, package READMEs and API reports always schedule a complete docs build', () => {
    const run = fixture();
    for (const file of [
        'docs/content/docs/installation.ru.mdx',
        'packages/store/README.md',
        'packages/store/etc/store.api.md',
        'packages/ui-kit-react/.storybook/pages/introduction.ru.md',
        'tools/storybook/pages/tokens.ru.md'
    ]) {
        const { outputs } = run([file]);
        assert.equal(outputs.docs, 'true', file);
        assert.equal(outputs.any, 'true', file);
        assert.equal(outputs.build, '', file);
    }
});

test('component sources build the whole docs dependency graph while preserving verification filters', () => {
    const { outputs } = fixture()(['packages/react-components/src/components/Checkbox/root/CheckboxRoot.tsx']);
    assert.deepEqual(outputs, {
        any: 'true',
        docs: 'true',
        build: '',
        verify: '--filter=...{packages/react-components}'
    });
});

test('package-only build configuration keeps the ordinary affected-package build', () => {
    const { outputs } = fixture()(['packages/store/tsconfig.json']);
    assert.deepEqual(outputs, {
        any: 'true',
        docs: 'false',
        build: '--filter=...{packages/store}...',
        verify: '--filter=...{packages/store}'
    });
});

test('SCSS, package exports and shared tooling are documentation inputs', () => {
    const run = fixture();
    for (const file of [
        'packages/component-styles/scss/_tokens.scss',
        'packages/component-styles/package.json',
        'packages/web-components/custom-elements-manifest.config.js',
        'tools/i18n-check.ts',
        '.github/workflows/check.yaml',
        'pnpm-lock.yaml'
    ]) {
        const { outputs } = run([file]);
        assert.equal(outputs.any, 'true', file);
        assert.equal(outputs.docs, 'true', file);
        assert.equal(outputs.build, '', file);
    }
});

test('removed packages and unsafe folder names never enter unquoted filter arguments', () => {
    const run = fixture();
    for (const file of ['packages/deleted/src/index.ts', 'packages/unsafe name/src/index.ts', 'packages/$(touch injected)/file.ts']) {
        const { outputs, stderr } = run([file]);
        assert.equal(outputs.any, 'true', file);
        assert.equal(outputs.build, '', file);
        assert.equal(outputs.verify, '', file);
        if (file.includes('unsafe name') || file.includes('$(touch')) assert.match(stderr, /Unexpected package folder name/);
    }
});
