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
 * `--write` rewrites these texts of `en.json` from the sources; a new or changed one then needs its Russian
 * text in `ru.json`, which the check lists.
 *
 * Usage: `node tools/i18n-check.ts [--write]` (the `lint:check` of this package runs it without `--write`).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

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
    execFileSync('node', [join(root, 'tools/api-docs.ts')], { stdio: 'ignore' });
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

const problems: string[] = [];
const en = flatten(read('en'));
const ru = flatten(read('ru'));

// The API reference: en.json follows the sources.
const sources = apiTexts();
const stale = [...sources].filter(([key, text]) => en.get(key) !== text).map(([key]) => key);
const removed = [...en.keys()].filter((key) => /^(api|core|web)\./.test(key) && !sources.has(key));
if (process.argv.includes('--write')) {
    for (const key of removed) en.delete(key);
    for (const [key, text] of sources) en.set(key, text);
    writeFileSync(dictionaryFile('en'), `${JSON.stringify(nest(en), null, 4)}\n`);
    for (const key of removed) ru.delete(key);
    writeFileSync(dictionaryFile('ru'), `${JSON.stringify(nest(ru), null, 4)}\n`);
    if (stale.length > 0) {
        console.log(`en.json: ${stale.length} API text(s) updated from the sources; check their Russian text in ru.json:`);
        for (const key of stale) console.log(`  ${key}`);
    }
} else {
    for (const key of [...stale, ...removed]) problems.push(`en.json: ${key} differs from the sources (node tools/i18n-check.ts --write)`);
}

// Both dictionaries have the same keys.
for (const key of en.keys()) if (!ru.has(key)) problems.push(`ru.json: missing ${key}`);
for (const key of ru.keys()) if (!en.has(key)) problems.push(`en.json: missing ${key} (it is in ru.json)`);

// The keys the stories use exist.
const KEY_USES = [/\bt\(\s*'([\w.-]+)'/g, /component:\s*'([\w.-]+)'/g];
const KEYED_FILES = ['packages/ui-kit-*/src/**/__stories__/*.{ts,tsx}', 'tools/storybook/pages/*.tsx'];
for (const file of globSync(KEYED_FILES, { cwd: root })) {
    const text = readFileSync(join(root, file), 'utf8');
    for (const pattern of KEY_USES) {
        for (const [, key] of text.matchAll(pattern)) {
            if (key.includes('.') && !en.has(key)) problems.push(`${file}: unknown key ${key}`);
        }
    }
}

if (problems.length > 0) {
    console.error(`i18n: ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
}
console.log(`i18n: ${en.size} keys in en.json and ru.json, every key of the stories exists.`);
