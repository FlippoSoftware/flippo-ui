import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const tools = dirname(fileURLToPath(import.meta.url));

test('the generator rejects missing state enums but accepts the reviewed stateless parts', () => {
    const root = mkdtempSync(join(tmpdir(), 'flippo-api-docs-'));
    const write = (file: string, text: string) => {
        mkdirSync(dirname(join(root, file)), { recursive: true });
        writeFileSync(join(root, file), text);
    };
    try {
        write('package.json', '{"type":"module"}');
        for (const file of ['api-docs.ts', 'core-enums.ts']) write(`tools/${file}`, readFileSync(join(tools, file), 'utf8'));
        mkdirSync(join(root, 'tools/storybook'));
        symlinkSync(join(tools, 'node_modules'), join(root, 'tools/node_modules'), 'dir');
        const config = JSON.stringify({
            compilerOptions: { target: 'ESNext', module: 'ESNext', moduleResolution: 'Bundler', types: [] },
            include: ['src']
        });
        for (const packageName of ['react-components', 'core-components']) write(`packages/${packageName}/tsconfig.json`, config);
        for (const family of ['Checkbox', 'Dialog']) {
            write(
                `packages/react-components/src/components/${family}/index.parts.ts`,
                `
                export function ${family}Root(props: ${family}Root.Props) {}
                export namespace ${family}Root { export type Props = { checked?: boolean; value: string }; }
            `
            );
            write(`packages/ui-kit-react/src/components/${family}/index.ts`, '');
        }
        const manifest = {
            modules: ['checkbox', 'dialog'].map((family) => ({
                path: `src/components/${family}/index.ts`,
                declarations: [{ name: 'elements', default: `{ root: ${family}Element }` }]
            }))
        };
        write('packages/web-components/custom-elements.json', JSON.stringify(manifest));
        const enumPath = 'packages/core-components/src/components/checkbox/CheckboxRootDataAttributes.ts';
        write(enumPath, "export enum WrongNameDataAttributes { checked = 'data-checked' }");
        const run = () => spawnSync(process.execPath, [join(root, 'tools/api-docs.ts')], { encoding: 'utf8' });
        const missing = run();
        assert.notEqual(missing.status, 0);
        assert.match(missing.stderr, /react:CheckboxRoot/);
        assert.match(missing.stderr, /web:checkbox.root/);
        assert.doesNotMatch(missing.stderr, /react:DialogRoot|web:dialog.root/);

        write(enumPath, "export enum CheckboxRootDataAttributes { checked = 'data-checked' }");
        write(
            'packages/core-components/src/lib/ViewportController.ts',
            `
            export { DistOnlyCssVars } from '../../dist/legacy';
            export enum InlineCssVars { width = '--inline-width' }
        `
        );
        write('packages/core-components/dist/legacy.d.ts', "export declare enum DistOnlyCssVars { stale = '--stale' }");
        const resolved = run();
        assert.equal(resolved.status, 0, resolved.stderr);
        const api = JSON.parse(readFileSync(join(root, 'tools/storybook/api.json'), 'utf8'));
        assert.equal(api.Checkbox.parts[0].dataAttributes[0].name, 'data-checked');
        assert.deepEqual(api.Dialog.parts[0].dataAttributes, []);
        assert.equal(api.Checkbox.parts[0].props.find((prop: { name: string }) => prop.name === 'checked').required, false);
        assert.equal(api.Checkbox.parts[0].props.find((prop: { name: string }) => prop.name === 'value').required, true);
        const enums = JSON.parse(readFileSync(join(root, 'tools/storybook/core-enums.json'), 'utf8'));
        assert.equal(enums.InlineCssVars[0].name, '--inline-width', 'inline source enums do not depend on transitive imports');
        assert.equal(enums.DistOnlyCssVars, undefined, 'built declarations cannot overwrite the source comments');
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
