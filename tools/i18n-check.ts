/**
 * Checks the dictionaries of the Storybooks (`storybook/i18n/en.json`, `ru.json`):
 *
 * - both have the same keys;
 * - every key the stories and the live parts of the overview pages use (`t('select.content.allCards')`,
 *   `description: { component: 'select.description' }`) exists. The prose of the overview pages is not in the
 *   dictionaries: it is one markdown document per language (`introduction.md`, `introduction.ru.md`);
 * - the texts of the API references in `en.json` are those of the sources: `api.*` the JSDoc of react-components
 *   (`api.json`), `core.<Enum>.<value>` the data attributes and CSS variables of the core enums (`core-enums.json`,
 *   shared by both adapters), `web.<Class>.<attribute>` the attributes of the web components (their Custom Elements
 *   Manifest).
 *
 * `--write` refreshes English texts and prunes removed keys, never acknowledging translations.
 * After translating, `--review <key|prefix>…` records their English hashes in `ru.sources.json`.
 * Missing texts/source hashes fail; stale translations warn. `--json <file>` writes the CI report.
 *
 * Usage: `node tools/i18n-check.ts [--write] [--review <key|prefix>…] [--json <file>]`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { docsHash } from './docs-hash.ts';

type Dictionary = { [key: string]: string | Dictionary };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dictionaryFile = (locale: string) => join(root, 'tools/storybook/i18n', `${locale}.json`);
const read = (locale: string): Dictionary => JSON.parse(readFileSync(dictionaryFile(locale), 'utf8'));

function flatten(dictionary: Dictionary, prefix = ''): Map<string, string> {
    const flat = new Map<string, string>();
    for (const [key, value] of Object.entries(dictionary)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'string') flat.set(path, value);
        else for (const [k, v] of flatten(value, path)) flat.set(k, v);
    }
    return flat;
}

function nest(flat: Map<string, string>): Dictionary {
    const out: Dictionary = {};
    for (const key of [...flat.keys()].sort()) {
        const parts = key.split('.');
        let node = out;
        for (const part of parts.slice(0, -1)) {
            node[part] ??= {};
            node = node[part] as Dictionary;
        }
        node[parts.at(-1) as string] = flat.get(key) as string;
    }
    return out;
}

type Item = { name: string; description: string };
type ApiPart = Item & { props: Item[] };
type Api = Record<string, { parts: ApiPart[] }>;

const COMMON_PROPS = ['asChild', 'className', 'ref', 'render', 'style'];

/** The text of each prop every part has: the most frequent wording of its sources. */
function commonTexts(api: Api): Map<string, string> {
    const counts = new Map<string, Map<string, number>>();
    for (const { parts } of Object.values(api)) {
        for (const prop of parts.flatMap((part) => part.props)) {
            if (!(COMMON_PROPS.includes(prop.name) && prop.description)) continue;
            const byText = counts.get(prop.name) ?? new Map<string, number>();
            byText.set(prop.description, (byText.get(prop.description) ?? 0) + 1);
            counts.set(prop.name, byText);
        }
    }
    return new Map([...counts].map(([name, byText]) => [name, [...byText].sort((a, b) => b[1] - a[1])[0][0]]));
}

/** The `api.*` texts of a part: the same keys as `DocsPage.tsx` reads. */
function partTexts(base: string, part: ApiPart, common: Map<string, string>): [string, string][] {
    return [
        [`${base}.description`, part.description] as [string, string],
        ...part.props
            .filter((prop) => common.get(prop.name) !== prop.description)
            .map((prop): [string, string] => [`${base}.props.${prop.name}`, prop.description])
    ].filter(([, text]) => text);
}

type Manifest = {
    modules: {
        path: string;
        declarations?: { kind: string; name: string; default?: string; attributes?: (Item & { inheritedFrom?: { name: string } })[] }[];
    }[];
};

/** The `web.<Class>.<attribute>` texts: the attributes of the registered elements, under the class that declares them. */
function webTexts(): Map<string, string> {
    const file = join(root, 'packages/web-components/custom-elements.json');
    if (!existsSync(file)) throw new Error('i18n: packages/web-components/custom-elements.json is missing: build web-components first.');
    const manifest: Manifest = JSON.parse(readFileSync(file, 'utf8'));
    const declarations = manifest.modules.flatMap((module) => module.declarations ?? []);
    const registered = new Set(
        declarations
            .filter((item) => item.name === 'elements')
            .flatMap((item) => [...(item.default ?? '').matchAll(/(\w+Element)\b/g)].map((match) => match[1]))
    );
    const texts = new Map<string, string>();
    for (const element of declarations.filter((item) => item.kind === 'class' && registered.has(item.name))) {
        for (const attribute of element.attributes ?? []) {
            if (attribute.description)
                texts.set(`web.${attribute.inheritedFrom?.name ?? element.name}.${attribute.name}`, attribute.description);
        }
    }
    return texts;
}

/** The texts of the sources: `api.*`, `core.*`, `web.*`. */
function apiTexts(): Map<string, string> {
    execFileSync(process.execPath, [join(root, 'tools/api-docs.ts')], { stdio: 'ignore' });
    const api: Api = JSON.parse(readFileSync(join(root, 'tools/storybook/api.json'), 'utf8'));
    const common = commonTexts(api);
    const texts = new Map([...common].map(([name, text]) => [`api.common.props.${name}`, text]));
    for (const [family, { parts }] of Object.entries(api)) {
        for (const part of parts) {
            for (const [key, text] of partTexts(`api.${family}.${part.name}`, part, common)) texts.set(key, text);
        }
    }
    const coreEnums: Record<string, Item[]> = JSON.parse(readFileSync(join(root, 'tools/storybook/core-enums.json'), 'utf8'));
    for (const [name, items] of Object.entries(coreEnums)) {
        for (const item of items) if (item.description) texts.set(`core.${name}.${item.name}`, item.description);
    }
    for (const [key, text] of webTexts()) texts.set(key, text);
    return texts;
}

type Report = {
    missing: string[];
    stale: { key: string; en: string; ru: string }[];
    current: number;
    errors: string[];
};

const report: Report = { missing: [], stale: [], current: 0, errors: [] };
const args = process.argv.slice(2);
let jsonFile: string | undefined;
let write = false;
const selectors: string[] = [];

function options() {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--write') {
            write = true;
            continue;
        }
        if (arg === '--json') {
            const candidate = args[++i];
            if (!candidate || candidate.startsWith('--')) throw new Error('--json requires a file');
            jsonFile = candidate;
            continue;
        }
        if (arg === '--review') {
            const start = selectors.length;
            while (args[i + 1] && !args[i + 1].startsWith('--')) selectors.push(args[++i]);
            if (selectors.length === start) throw new Error('--review requires a key or prefix');
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }
}

function saveSources(sources: Record<string, string>) {
    writeFileSync(
        dictionaryFile('ru.sources'),
        `${JSON.stringify(
            Object.fromEntries(
                Object.keys(sources)
                    .sort()
                    .map((key) => [key, sources[key]])
            ),
            null,
            4
        )}\n`
    );
}

type State = { en: Map<string, string>; ru: Map<string, string>; reviewed: Record<string, string> };

function refreshSources({ en, ru, reviewed }: State) {
    // English still follows the source comments; a stale translation is a separate warning.
    const sources = apiTexts();
    const changed = [...sources].filter(([key, text]) => en.get(key) !== text).map(([key]) => key);
    const removed = [...en.keys()].filter((key) => /^(api|core|web)\./.test(key) && !sources.has(key));
    if (write) {
        for (const key of removed) {
            en.delete(key);
            ru.delete(key);
        }
        for (const [key, text] of sources) en.set(key, text);
        writeFileSync(dictionaryFile('en'), `${JSON.stringify(nest(en), null, 4)}\n`);
        writeFileSync(dictionaryFile('ru'), `${JSON.stringify(nest(ru), null, 4)}\n`);
        for (const key of Object.keys(reviewed)) if (!ru.has(key)) delete reviewed[key];
        saveSources(reviewed);
        if (changed.length > 0) console.log(`en.json: ${changed.length} API text(s) updated from the sources.`);
    } else {
        for (const key of [...changed, ...removed]) {
            report.errors.push(`en.json: ${key} differs from the sources (node tools/i18n-check.ts --write)`);
        }
    }
}

/** Validate every selector before changing any hashes. */
function reviewKeys({ en, ru, reviewed }: State) {
    if (selectors.length === 0) return;
    const selected = new Set<string>();
    for (const selector of selectors) {
        const keys = [...en.keys()].filter((key) => key === selector || key.startsWith(`${selector}.`));
        if (keys.length === 0) throw new Error(`--review: unknown key or prefix ${selector}`);
        for (const key of keys) {
            if (!en.get(key)?.trim() || !ru.get(key)?.trim()) throw new Error(`--review: missing text for ${key}`);
            selected.add(key);
        }
    }
    if (report.errors.length > 0) throw new Error('--review: update en.json from the sources with --write first');
    for (const key of selected) reviewed[key] = docsHash(en.get(key) as string);
    saveSources(reviewed);
    console.log(`i18n: reviewed ${selected.size} key(s).`);
}

function checkTranslations({ en, ru, reviewed }: State) {
    for (const [key, text] of en) {
        const translated = ru.get(key);
        if (!text.trim()) report.missing.push(`en.json: empty ${key}`);
        if (!translated?.trim()) report.missing.push(`ru.json: missing ${key}`);
        else if (!/^[a-f0-9]{12}$/.test(reviewed[key] ?? '')) report.missing.push(`ru.sources.json: missing source hash for ${key}`);
        else if (reviewed[key] !== docsHash(text)) report.stale.push({ key, en: text, ru: translated });
        else report.current++;
    }
    for (const key of ru.keys()) if (!en.has(key)) report.missing.push(`en.json: missing ${key} (it is in ru.json)`);
    for (const key of Object.keys(reviewed)) {
        if (!ru.has(key)) report.errors.push(`ru.sources.json: unknown key ${key} (run --write to prune it)`);
    }
}

function checkStoryKeys(en: Map<string, string>) {
    const keyUses = [/\bt\(\s*'([\w.-]+)'/g, /component:\s*'([\w.-]+)'/g];
    const keyedFiles = ['packages/ui-kit-*/src/**/__stories__/*.{ts,tsx}', 'tools/storybook/pages/*.tsx'];
    for (const file of globSync(keyedFiles, { cwd: root })) {
        const text = readFileSync(join(root, file), 'utf8');
        for (const pattern of keyUses) {
            for (const [, key] of text.matchAll(pattern)) {
                if (key.includes('.') && !en.has(key)) report.errors.push(`${file}: unknown key ${key}`);
            }
        }
    }
}

function printReport(size: number) {
    console.log(`i18n: ${size} keys, ${report.current} current, ${report.missing.length} missing, ${report.stale.length} stale.`);
    const groups = new Map<string, number>();
    for (const { key } of report.stale) {
        const prefix = key.split('.')[0];
        groups.set(prefix, (groups.get(prefix) ?? 0) + 1);
    }
    for (const [prefix, count] of groups) console.warn(`  ${prefix}: ${count} stale`);
    for (const { key } of report.stale) console.warn(`  stale: ${key}`);
}

try {
    options();
    const sourceFile = dictionaryFile('ru.sources');
    const state: State = {
        en: flatten(read('en')),
        ru: flatten(read('ru')),
        reviewed: existsSync(sourceFile) ? JSON.parse(readFileSync(sourceFile, 'utf8')) : {}
    };
    refreshSources(state);
    reviewKeys(state);
    checkTranslations(state);
    checkStoryKeys(state.en);
    printReport(state.en.size);
} catch (error) {
    report.errors.push((error as Error).message);
}
if (jsonFile) {
    mkdirSync(dirname(jsonFile), { recursive: true });
    writeFileSync(jsonFile, `${JSON.stringify(report, null, 4)}\n`);
}
for (const problem of [...report.missing, ...report.errors]) console.error(`i18n: ${problem}`);
if (report.missing.length > 0 || report.errors.length > 0) process.exitCode = 1;
