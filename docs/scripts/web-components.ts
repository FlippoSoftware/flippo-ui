/**
 * The API reference of `@flippo-software/web-components`: a page per component (`web-components/api/<name>`) with the
 * tag of each part, its attributes, properties and events, its data attributes and CSS variables.
 *
 * Sources: the package and its dependency only. The elements come from the Custom Elements Manifest of the package
 * (`packages/web-components/custom-elements.json`, written by its build); the data attributes and CSS variables are set
 * by the core machines: their enums (`<Family><Part>DataAttributes`, `tools/storybook/core-enums.json`, read from
 * core-components by `tools/api-docs.ts`). The Russian pages take the translations of `tools/storybook/i18n/ru.json`:
 * `web.<Class>.<attribute>` and `core.<Enum>.<value>`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    cell,
    clean,
    code,
    content,
    kebab,
    LABELS,
    LOCALES,
    type Locale,
    pageFile,
    pascal,
    root,
    summary,
    table,
    translation,
    writeMeta,
    writePage
} from './lib.ts';

type Typed = { text: string } | undefined;
type Attribute = {
    name: string;
    type?: Typed;
    default?: string;
    description?: string;
    fieldName?: string;
    inheritedFrom?: { name: string };
};
type Member = { kind: 'field' | 'method'; name: string; type?: Typed; description?: string; attribute?: string; readonly?: boolean };
type Event = { name: string; type?: Typed; description?: string };
type Declaration = {
    kind: string;
    name: string;
    description?: string;
    default?: string;
    customElement?: boolean;
    attributes?: Attribute[];
    members?: Member[];
    events?: Event[];
};
type Manifest = { modules: { path: string; declarations?: Declaration[] }[] };

type CoreItem = { name: string; description: string };

const out = join(content, 'web-components/api');
const manifestFile = join(root, 'packages/web-components/custom-elements.json');
const ENTRY = /^src\/components\/([\w-]+)\/index\.ts$/;
const PART = /(\w+):\s*(\w+)/g;

/** The parts of a component: `elements` of its entry (`{ root: XElement, … }`, or one element). */
function partsOf(elements: Declaration): [part: string, className: string][] {
    const value = elements.default ?? '';
    return value.startsWith('{') ? [...value.matchAll(PART)].map(([, part, name]) => [part, name]) : [['root', value]];
}

/** The core enum of a part (`checkbox` + `indicator` → `CheckboxIndicatorDataAttributes`; a root: `CheckboxRoot…` or `Checkbox…`). */
function coreEnumOf(
    enums: Record<string, CoreItem[]>,
    name: string,
    part: string,
    suffix: 'DataAttributes' | 'CssVars'
): string | undefined {
    const candidates =
        part === 'root' ? [`${pascal(name)}Root${suffix}`, `${pascal(name)}${suffix}`] : [`${pascal(name)}${pascal(part)}${suffix}`];
    return candidates.find((candidate) => enums[candidate]);
}

function apiText(locale: Locale, key: string, source: string): string {
    return translation(locale, key) ?? source;
}

const typeOf = (typed: Typed) => typed?.text.replace(/\s*\|\s*undefined$/, '');
const detailOf = (typed: Typed) => typed?.text.match(/^CustomEvent<(.+)>$/s)?.[1];

function partSection(
    tag: string,
    element: Declaration,
    locale: Locale,
    enums: Record<string, CoreItem[]>,
    name: string,
    part: string
): string {
    const labels = LABELS[locale];
    const attributes = element.attributes ?? [];
    // `as-child` (every element has it) goes last.
    const ordered = [...attributes.filter((item) => item.name !== 'as-child'), ...attributes.filter((item) => item.name === 'as-child')];
    const properties = (element.members ?? []).filter(
        (member) => member.kind === 'field' && !member.attribute && member.name !== 'asChild' && member.description
    );
    return [
        `### \`<${tag}>\``,
        element.description ? `${element.description.replace(/\n(?!\n)/g, ' ')}\n\n` : '',
        `\`${element.name}\``,
        table(
            [labels.attribute, labels.type, labels.default, labels.description],
            ordered.map((item) => [
                code(item.name),
                code(typeOf(item.type)),
                code(item.default),
                cell(apiText(locale, `web.${item.inheritedFrom?.name ?? element.name}.${item.name}`, item.description ?? ''))
            ])
        ),
        table(
            [labels.property, labels.type, labels.description],
            properties.map((member) => [code(member.name), code(typeOf(member.type)), cell(member.description)])
        ),
        table(
            [labels.event, labels.detail, labels.description],
            (element.events ?? []).map((event) => [code(event.name), code(detailOf(event.type)), cell(event.description)])
        ),
        ...(['DataAttributes', 'CssVars'] as const).map((suffix) => {
            const enumName = coreEnumOf(enums, name, part, suffix);
            const items = enumName ? (enums[enumName] ?? []) : [];
            return table(
                [suffix === 'DataAttributes' ? labels.dataAttribute : labels.cssVariable, labels.description],
                items.map((item) => [code(item.name), cell(apiText(locale, `core.${enumName}.${item.name}`, item.description))])
            );
        })
    ].join('\n\n');
}

export function generateWebComponents(): number {
    if (!existsSync(manifestFile)) {
        throw new Error('web-components: custom-elements.json is missing: build the package first (pnpm build).');
    }
    const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as Manifest;
    const enums = JSON.parse(readFileSync(join(root, 'tools/storybook/core-enums.json'), 'utf8')) as Record<string, CoreItem[]>;
    const classes = new Map(
        manifest.modules
            .flatMap((module) => module.declarations ?? [])
            .filter((item) => item.kind === 'class')
            .map((item) => [item.name, item])
    );
    const families = manifest.modules
        .map((module) => ({ name: module.path.match(ENTRY)?.[1], elements: module.declarations?.find((item) => item.name === 'elements') }))
        .filter((family): family is { name: string; elements: Declaration } => family.name !== undefined && family.elements !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name));

    clean(out);
    for (const { name, elements } of families) {
        const title = pascal(name);
        const parts = partsOf(elements).filter(([, className]) => classes.has(className));
        for (const locale of LOCALES) {
            const labels = LABELS[locale];
            const sections = parts.map(([part, className]) => {
                const tag = part === 'root' ? `ui-${name}` : `ui-${name}-${kebab(part)}`;
                return partSection(tag, classes.get(className) as Declaration, locale, enums, name, part);
            });
            const rootElement = classes.get(parts[0]?.[1] ?? '');
            const body = [
                `## ${labels.import}`,
                `\`\`\`ts\nimport { define } from '@flippo-software/web-components/${name}';\n\ndefine({ prefix: 'ui' });\n\`\`\``,
                labels.tagPrefix,
                `## ${labels.apiReference}`,
                ...sections,
                `---\n\n_${labels.generated}_`
            ].join('\n\n');
            writePage(join(out, pageFile(name, locale)), { title, description: summary(rootElement?.description), body });
        }
    }
    const pages = families.map((family) => family.name);
    writeMeta(join(out, 'meta.json'), { title: 'Elements', pages });
    writeMeta(join(out, 'meta.ru.json'), { title: 'Элементы', pages });
    return families.length;
}
