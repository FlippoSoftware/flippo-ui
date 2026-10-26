// biome-ignore-all lint/style/noDoneCallback: node:test passes a TestContext, not a done callback.
// biome-ignore-all lint/security/noSecrets: These public TypeScript event signatures are test fixtures, not secrets.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { contractHash, declarationTokens, reactContract, themeDeclarations, webContract } from './contracts.ts';
import { checkRegistry, readRegistry, reviewRegistry } from './registry.ts';

function fixture() {
    const root = mkdtempSync(join(tmpdir(), 'flippo-registry-'));
    const write = (file: string, value: unknown) => {
        const path = join(root, file);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, typeof value === 'string' ? value : JSON.stringify(value));
    };
    return { root, write };
}

test('React prop additions/types/defaults change the contract; descriptions and ordering do not', () => {
    const family = {
        parts: [
            { name: 'Root', description: 'Original', props: [{ name: 'checked', type: 'boolean', default: 'false', description: 'Text' }] }
        ]
    };
    const original = reactContract(family);
    family.parts[0].description = 'Edited prose';
    family.parts[0].props[0].description = 'Edited JSDoc';
    assert.equal(reactContract(family), original);
    family.parts[0].props[0].type = 'boolean | undefined';
    assert.notEqual(reactContract(family), original);
    family.parts[0].props[0].type = 'boolean';
    family.parts[0].props[0].default = 'true';
    assert.notEqual(reactContract(family), original);
    family.parts[0].props[0].default = 'false';
    family.parts[0].props.push({ name: 'disabled', type: 'boolean', default: 'false', description: '' });
    assert.notEqual(reactContract(family), original);
    const changed = reactContract(family);
    family.parts[0].props.reverse();
    assert.equal(reactContract(family), changed);
});

test('web contracts include part tags, attribute defaults, event types and CSS property names', () => {
    const element = {
        kind: 'class',
        name: 'CheckboxElement',
        customElement: true,
        description: 'Checkbox',
        attributes: [{ name: 'checked', type: { text: 'boolean' }, default: 'false', description: 'Checked' }],
        events: [{ name: 'change', type: { text: 'CustomEvent<boolean>' }, description: 'Change' }],
        cssProperties: [{ name: '--size', description: 'Size' }]
    };
    const registration = { kind: 'variable', name: 'elements', default: '{ root: CheckboxElement }' };
    const manifest = { modules: [{ path: 'src/components/checkbox/index.ts', declarations: [registration, element] }] };
    const original = webContract(manifest, 'checkbox');
    element.description = 'Different';
    element.events[0].description = 'Different';
    element.attributes[0].description = 'Different';
    assert.equal(webContract(manifest, 'checkbox'), original);
    element.attributes[0].default = 'true';
    assert.notEqual(webContract(manifest, 'checkbox'), original);
    element.attributes[0].default = 'false';
    element.events[0].type.text = 'CustomEvent<string>';
    assert.notEqual(webContract(manifest, 'checkbox'), original);
    element.events[0].type.text = 'CustomEvent<boolean>';
    element.cssProperties[0].name = '--height';
    assert.notEqual(webContract(manifest, 'checkbox'), original);
    element.cssProperties[0].name = '--size';
    registration.default = '{ indicator: CheckboxElement }';
    assert.notEqual(webContract(manifest, 'checkbox'), original);
    assert.throws(() => webContract(manifest, 'unknown'), /Unknown web component/);
    registration.default = '{ root: MissingElement }';
    assert.throws(() => webContract(manifest, 'checkbox'), /registered class MissingElement is missing/);
});

test('theme declarations follow public prop types, ignoring comments, private fields and unrelated APIs', () => {
    const source = `
        type Props = { /** Text */ theme?: 'light' | 'dark' };
        type Cache = { internal: string };
        export declare function Provider(props: Props): void;
        export declare class Theme { private cache: Cache; get theme(): string; }
        export declare function unrelated(): void;
    `;
    const selected = ['Provider', 'Theme'];
    const original = themeDeclarations(source, selected);
    assert.equal(themeDeclarations(source.replace('Text', 'New text').replace('private cache:', 'private renamed:'), selected), original);
    assert.equal(themeDeclarations(source.replace('internal: string', 'internal: number; added: boolean'), selected), original);
    assert.equal(themeDeclarations(source.replace('unrelated(): void', 'unrelated(value: number): string'), selected), original);
    assert.notEqual(themeDeclarations(source.replace('theme?:', 'size?: number; theme?:'), selected), original);
    assert.notEqual(themeDeclarations(source.replace('get theme(): string', 'get theme(): number'), selected), original);
    assert.throws(() => themeDeclarations(source, ['Missing']), /Missing public theme declaration/);
    assert.doesNotThrow(() => themeDeclarations('declare function Internal(): void; export { Internal as Public };', ['Public']));
});

test('declaration comments and formatting are ignored without corrupting strings', () => {
    assert.deepEqual(declarationTokens('export /* details */ type Theme = "a b";'), declarationTokens('export type Theme="a b";'));
    assert.notDeepEqual(declarationTokens('"a b"'), declarationTokens('"ab"'));
    assert.deepEqual(declarationTokens('"https://example.com"'), ['"https://example.com"']);
});

test('npm reports exclude comments and core enums exclude descriptions', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    const report = (comment: string, type: string) => `# API Report\n\n\`\`\`ts\n// ${comment}\nexport function value(): ${type};\n\`\`\``;
    write('packages/store/etc/store.api.md', report('Original', 'string'));
    const original = contractHash(root, 'npm:store');
    write('packages/store/etc/store.api.md', report('Edited comment', 'string'));
    assert.equal(contractHash(root, 'npm:store'), original);
    write('packages/store/etc/store.api.md', report('Edited comment', 'number'));
    assert.notEqual(contractHash(root, 'npm:store'), original);
    write('tools/storybook/core-enums.json', { CheckboxRootDataAttributes: [{ name: 'data-checked', description: 'Original' }] });
    const core = contractHash(root, 'core:CheckboxRootDataAttributes');
    write('tools/storybook/core-enums.json', { CheckboxRootDataAttributes: [{ name: 'data-checked', description: 'Changed' }] });
    assert.equal(contractHash(root, 'core:CheckboxRootDataAttributes'), core);
    write('tools/storybook/core-enums.json', { CheckboxRootDataAttributes: [{ name: 'data-disabled' }] });
    assert.notEqual(contractHash(root, 'core:CheckboxRootDataAttributes'), core);
});

test('installation contracts watch exports and peers, excluding metadata', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    const pkg = {
        description: 'Original',
        version: '1.0.0',
        exports: { '.': { import: './dist/index.js' } },
        peerDependencies: { react: '^19' }
    };
    write('packages/ui-kit-react/package.json', pkg);
    const original = contractHash(root, 'exports:ui-kit-react');
    write('packages/ui-kit-react/package.json', { ...pkg, description: 'Changed', version: '2.0.0' });
    assert.equal(contractHash(root, 'exports:ui-kit-react'), original);
    write('packages/ui-kit-react/package.json', { ...pkg, peerDependencies: { react: '^20' } });
    assert.notEqual(contractHash(root, 'exports:ui-kit-react'), original);
    write('packages/ui-kit-react/package.json', { ...pkg, exports: { './button': './dist/button.js' } });
    assert.notEqual(contractHash(root, 'exports:ui-kit-react'), original);
});

test('theme contract includes documented control heights and SCSS mixin arguments', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    write('packages/component-styles/dist/theme.d.ts', 'export declare function themeScript(): string;');
    write('packages/component-styles/dist/sizes.d.ts', 'export declare const CONTROL_HEIGHTS: Readonly<Record<string, number>>;');
    write(
        'packages/component-styles/src/theme/index.ts',
        `
        export const BUILT_IN_THEMES = { light: 'light', dark: 'dark' };
        export const THEME_ATTRIBUTE = 'data-theme';
        export const DEFAULT_THEME_STORAGE_KEY = 'theme';
    `
    );
    const sizes = `
        export const CONTROL_SIZES = ['small', 'medium', 'large'];
        export const DEFAULT_CONTROL_SIZE = 'medium';
        export const CONTROL_HEIGHTS = { small: 40, medium: 48, large: 56 };
    `;
    write('packages/component-styles/src/sizes/index.ts', sizes);
    write('packages/component-styles/scss/mixins/_tokens.scss', '@mixin theme($name, $scheme, $colors: ()) { color: red; }');
    const original = contractHash(root, 'theme:component-styles');
    write('packages/component-styles/src/sizes/index.ts', sizes.replace('small: 40', 'small: 42'));
    assert.notEqual(contractHash(root, 'theme:component-styles'), original);
    write('packages/component-styles/src/sizes/index.ts', sizes);
    write(
        'packages/component-styles/scss/mixins/_tokens.scss',
        '/// Changed prose\n@mixin theme($name, $scheme, $colors: ()) { color: blue; }'
    );
    assert.equal(contractHash(root, 'theme:component-styles'), original);
    write('packages/component-styles/scss/mixins/_tokens.scss', '@mixin theme($name, $scheme, $colors: (), $new: ()) { color: red; }');
    assert.notEqual(contractHash(root, 'theme:component-styles'), original);
});

test('web theme contract includes registration options and observed attribute names', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    const functions = [
        'define',
        'setTheme',
        'getTheme',
        'subscribeTheme',
        'registerThemes',
        'persistTheme',
        'setControlSize',
        'getControlSize'
    ];
    write(
        'packages/ui-kit-web/dist/index.d.ts',
        [
            ...functions.map((name) => `export declare function ${name}(): void;`),
            'export type DefineOptions = Record<string, unknown>;',
            'export declare class ProviderElement { static observedAttributes: string[]; }'
        ].join('\n')
    );
    const registration = 'export type DefineOptions = { prefix: string; registry?: CustomElementRegistry };';
    const provider = "export class ProviderElement { static observedAttributes = ['theme', 'size']; }";
    write('packages/ui-kit-web/src/lib/register.ts', registration);
    write('packages/ui-kit-web/src/lib/provider.ts', provider);
    const original = contractHash(root, 'theme:ui-kit-web');
    write('packages/ui-kit-web/src/lib/register.ts', registration.replace('prefix: string', 'prefix: number'));
    assert.notEqual(contractHash(root, 'theme:ui-kit-web'), original);
    write('packages/ui-kit-web/src/lib/register.ts', registration);
    write('packages/ui-kit-web/src/lib/provider.ts', provider.replace("'size'", "'control-size'"));
    assert.notEqual(contractHash(root, 'theme:ui-kit-web'), original);
    write('packages/ui-kit-web/src/lib/provider.ts', `/** New docs */ ${provider}`);
    assert.equal(contractHash(root, 'theme:ui-kit-web'), original);
});

test('guide review is explicit; stale contracts warn and invalid contracts fail without partial writes', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    write('docs/content/docs/guide.mdx', '---\ntitle: Guide\n---\nGuide');
    write('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Root', props: [{ name: 'checked', type: 'boolean' }] }] } });
    write('docs/registry.json', { 'guide.mdx': { contracts: ['react:Checkbox'], reviewed: {} } });
    let registry = readRegistry(root);
    assert.equal(checkRegistry(root, registry).stale.length, 1);
    reviewRegistry(root, registry, ['guide.mdx']);
    registry = readRegistry(root);
    assert.equal(checkRegistry(root, registry).current.length, 1);
    write('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Root', props: [{ name: 'checked', type: 'string' }] }] } });
    const stale = checkRegistry(root, registry);
    assert.equal(stale.stale.length, 1);
    assert.equal(stale.errors.length, 0);
    const before = readFileSync(join(root, 'docs/registry.json'), 'utf8');
    assert.throws(() => reviewRegistry(root, registry, ['guide.mdx', 'unknown.mdx']), /Page is not registered/);
    assert.equal(readFileSync(join(root, 'docs/registry.json'), 'utf8'), before);
    registry['guide.mdx'].contracts.push('react:Unknown');
    assert.match(checkRegistry(root, registry).errors[0], /Unknown React family/);
    assert.throws(() => reviewRegistry(root, registry, ['guide.mdx']), /Unknown React family/);
    assert.equal(readFileSync(join(root, 'docs/registry.json'), 'utf8'), before);
    assert.throws(() => contractHash(root, 'npm:../../private'), /Invalid contract/);
    assert.throws(() => contractHash(root, 'typo:Checkbox'), /Invalid contract/);
});

test('registry CLI emits JSON, exits successfully for stale guides and fails for invalid contracts', (context) => {
    const { root, write } = fixture();
    context.after(() => rmSync(root, { recursive: true, force: true }));
    const scripts = dirname(fileURLToPath(import.meta.url));
    for (const script of ['registry.ts', 'contracts.ts']) write(`docs/scripts/${script}`, readFileSync(join(scripts, script), 'utf8'));
    write('docs/package.json', { type: 'module' });
    symlinkSync(join(scripts, '../node_modules'), join(root, 'docs/node_modules'), 'dir');
    write('docs/content/docs/guide.mdx', 'Guide');
    write('tools/storybook/api.json', { Checkbox: { parts: [{ name: 'Root', props: [{ name: 'checked', type: 'boolean' }] }] } });
    write('docs/registry.json', { 'guide.mdx': { contracts: ['react:Checkbox'], reviewed: {} } });
    const run = (...args: string[]) =>
        spawnSync(process.execPath, [join(root, 'docs/scripts/registry.ts'), '--json', join(root, 'report.json'), ...args], {
            cwd: root,
            encoding: 'utf8'
        });
    assert.equal(run().status, 0);
    assert.equal(JSON.parse(readFileSync(join(root, 'report.json'), 'utf8')).stale.length, 1);
    assert.equal(run('--review', 'guide.mdx').status, 0);
    assert.equal(JSON.parse(readFileSync(join(root, 'report.json'), 'utf8')).current.length, 1);
    write('docs/registry.json', { 'guide.mdx': { contracts: ['react:Unknown'], reviewed: {} } });
    assert.equal(run().status, 1);
    assert.equal(JSON.parse(readFileSync(join(root, 'report.json'), 'utf8')).errors.length, 1);
});
