/**
 * The API reference of the TypeScript packages, by TypeDoc and typedoc-plugin-markdown (MDX pages):
 *
 * - `store`, `react-store`: one entry point each (their public API is also checked by API Extractor, `etc/*.api.md`);
 * - `core-components`: a page per entry point (`/checkbox`, `/props`…).
 *
 * TypeDoc reads the declarations of the builds (`dist/*.d.ts`: no path aliases, no TypeScript 7 sources), so the
 * packages must be built. The pages get a frontmatter title from their heading; their links stay relative
 * (`./checkbox.mdx`), resolved by the site (Fumadocs' `createRelativeLink`).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Application, type TypeDocOptions } from 'typedoc';

import type { PluginOptions } from 'typedoc-plugin-markdown';

import { clean, content, docsRoot, root, write, writeMeta } from './lib.ts';

type Target = { name: string; entryPoints: string[]; title: string };

const packages = join(root, 'packages');

/** The declarations of every subpath export of core-components (its root re-exports them all). */
function coreEntryPoints(): string[] {
    const manifest = JSON.parse(readFileSync(join(packages, 'core-components/package.json'), 'utf8')) as {
        exports: Record<string, unknown>;
    };
    return Object.keys(manifest.exports)
        .filter((subpath) => subpath !== '.' && subpath !== './package.json')
        .map((subpath) => join(packages, 'core-components/dist', `${subpath.slice(2)}.d.ts`));
}

const TARGETS: Target[] = [
    { name: 'store', entryPoints: [join(packages, 'store/dist/index.d.ts')], title: 'API reference' },
    { name: 'react-store', entryPoints: [join(packages, 'react-store/dist/index.d.ts')], title: 'API reference' },
    { name: 'core-components', entryPoints: coreEntryPoints(), title: 'API reference' }
];

const options: Partial<TypeDocOptions & PluginOptions> = {
    plugin: ['typedoc-plugin-markdown'],
    skipErrorChecking: true,
    readme: 'none',
    excludePrivate: true,
    excludeProtected: true,
    excludeInternal: true,
    excludeExternals: true,
    disableSources: true,
    fileExtension: '.mdx',
    entryFileName: 'index',
    outputFileStrategy: 'modules',
    hidePageHeader: true,
    hideBreadcrumbs: true,
    useCodeBlocks: true,
    parametersFormat: 'table',
    interfacePropertiesFormat: 'table',
    classPropertiesFormat: 'table',
    typeAliasPropertiesFormat: 'table',
    enumMembersFormat: 'table',
    sanitizeComments: true,
    logLevel: 'Warn'
};

const HEADING = /^# (.+)\n+/;

/** Moves the heading of every page to its frontmatter (`title`), as Fumadocs expects; the index gets `indexTitle`. */
function addFrontmatter(folder: string, indexTitle: string) {
    for (const file of readdirSync(folder, { recursive: true, encoding: 'utf8' }).filter((name) => name.endsWith('.mdx'))) {
        const path = join(folder, file);
        const text = readFileSync(path, 'utf8');
        const heading = text.match(HEADING)?.[1].replace(/\\/g, '') ?? file.replace(/\.mdx$/, '');
        const title = file === 'index.mdx' ? indexTitle : heading;
        write(path, `---\ntitle: ${JSON.stringify(title)}\n---\n\n${text.replace(HEADING, '')}`);
    }
}

async function generate(target: Target) {
    const missing = target.entryPoints.filter((file) => !existsSync(file));
    if (missing.length > 0) {
        throw new Error(`typedoc: ${target.name} is not built (pnpm build): ${missing.join(', ')}`);
    }
    const out = join(content, target.name, 'api');
    clean(out);
    // The program of the target: the shared compiler options and its entry points.
    const tsconfig = join(docsRoot, 'node_modules/.cache/typedoc', `${target.name}.json`);
    write(tsconfig, JSON.stringify({ extends: join(import.meta.dirname, 'typedoc.tsconfig.json'), files: target.entryPoints }));
    const app = await Application.bootstrapWithPlugins({ ...options, tsconfig, entryPoints: target.entryPoints, name: target.name, out });
    const project = await app.convert();
    if (!project) {
        throw new Error(`typedoc: ${target.name} could not be converted`);
    }
    await app.generateOutputs(project);
    addFrontmatter(out, target.title);
    writeMeta(join(out, 'meta.json'), { title: target.title });
    writeMeta(join(out, 'meta.ru.json'), { title: 'Справочник API' });
}

export async function generateTypeDoc(): Promise<string[]> {
    for (const target of TARGETS) {
        await generate(target);
    }
    return TARGETS.map((target) => target.name);
}
