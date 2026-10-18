import * as React from 'react';

import { Controls, Markdown, Primary, Stories, Subtitle, Title, useOf } from '@storybook/blocks';

import manifest from '../../packages/web-components/custom-elements.json';

import api from './api.json';
import coreEnumData from './core-enums.json';
import { getLocale, lookup, t } from './i18n';
import { useLocale } from './Lang';

import './docs.css';

type Prop = {
    name: string;
    type: string;
    default?: string;
    description: string;
};
type Attribute = { name: string; type?: string; description: string };
type Part = {
    name: string;
    description: string;
    props: Prop[];
    dataAttributes: Attribute[];
    cssVariables: Attribute[];
    dataAttributesEnum?: string;
    cssVariablesEnum?: string;
};
type Variant = { name: string; values: string[]; default?: string };
type Family = {
    name: string;
    kebab: string;
    parts: Part[];
    variants: Variant[];
    cssHooks: string[];
};

const families = api as Record<string, Family>;
/** The data attributes and CSS variables of the core machines, by enum (`CheckboxRootDataAttributes`). */
const coreEnums = coreEnumData as Record<string, Attribute[]>;

type ManifestAttribute = {
    name: string;
    type?: { text: string };
    default?: string;
    description?: string;
    inheritedFrom?: { name: string };
};
type ManifestEvent = { name: string; type?: { text: string }; description?: string };
type Declaration = {
    kind: string;
    name: string;
    description?: string;
    default?: string;
    attributes?: ManifestAttribute[];
    events?: ManifestEvent[];
};
/** The declarations of the web components (their Custom Elements Manifest). */
const declarations = (manifest as { modules: { path: string; declarations?: Declaration[] }[] }).modules.flatMap((module) =>
    (module.declarations ?? []).map((declaration) => ({ module: module.path, declaration }))
);

export type DocsPageOptions =
    | { kind: 'react' }
    /** `prefix`: the tag prefix the stories register (`define({ prefix })`). */
    | { kind: 'web'; prefix: string };

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const camel = (name: string) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
const FIRST_LETTER = /^\w/;
const PART = /(\w+):\s*(\w+)/g;
const CUSTOM_EVENT = /^CustomEvent<(.+)>$/s;
const pascal = (name: string) => camel(name).replace(FIRST_LETTER, (letter) => letter.toUpperCase());

/** The family a docs page documents: `parameters.api.family`, else the last segment of the title (`Forms/Checkbox`). */
function useFamily(): Family | undefined {
    const resolved = useOf('meta');
    if (resolved.type !== 'meta') return undefined;
    const { parameters, title } = resolved.preparedMeta;
    const name = (parameters as { api?: { family?: string } }).api?.family ?? title.split('/').at(-1) ?? '';
    return families[name];
}

function Code({ children }: { children: React.ReactNode }) {
    return <code className='fl-docs-code'>{children}</code>;
}

/** A description in markdown: inline `code` spans become `<code>`. */
function Text({ children }: { children: string | undefined }) {
    if (!children) return null;
    return <Markdown>{children}</Markdown>;
}

/**
 * A text of the API reference in the current language: its key (`api.Checkbox.Root.props.checked`), else the common
 * key of a prop every part has when the source says the same (`api.common.props.className`), else the JSDoc.
 */
function apiText(key: string, source: string, commonKey?: string): string {
    const own = lookup(getLocale(), key) ?? lookup('en', key);
    if (own) return own;
    if (commonKey && lookup('en', commonKey) === source) return lookup(getLocale(), commonKey) ?? source;
    return source;
}

/** The items of a core enum in the current language (`core.<Enum>.<value>`). */
function coreItems(enumName: string | undefined, items: Attribute[]): Attribute[] {
    return items.map((item) => ({ ...item, description: apiText(`core.${enumName}.${item.name}`, item.description) }));
}

/** A part with its texts in the current language. */
function localized(family: Family, part: Part): Part {
    const base = `api.${family.name}.${part.name}`;
    return {
        ...part,
        description: apiText(`${base}.description`, part.description),
        props: part.props.map((prop) => ({
            ...prop,
            description: apiText(`${base}.props.${prop.name}`, prop.description, `api.common.props.${prop.name}`)
        })),
        dataAttributes: coreItems(part.dataAttributesEnum, part.dataAttributes),
        cssVariables: coreItems(part.cssVariablesEnum, part.cssVariables)
    };
}

/** The description of the component (`parameters.docs.description.component`), translated. */
function ComponentDescription() {
    const resolved = useOf('meta');
    if (resolved.type !== 'meta') return null;
    // The stories give the key of their description (`select.description`).
    const docs = (resolved.preparedMeta.parameters as { docs?: { description?: { component?: string } } }).docs;
    const key = docs?.description?.component;
    return <Text>{key ? t(key) : undefined}</Text>;
}

function PropsTable({ title, rows }: { title: string; rows: Prop[] }) {
    if (rows.length === 0) return null;
    return (
        <table className='fl-docs-table'>
            <thead>
                <tr>
                    <th>{title}</th>
                    <th>{t('docs.type')}</th>
                    <th>{t('docs.default')}</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <React.Fragment key={row.name}>
                        <tr className='fl-docs-row'>
                            <td>
                                <Code>{row.name}</Code>
                            </td>
                            <td>
                                <Code>{row.type}</Code>
                            </td>
                            <td>{row.default === undefined ? '—' : <Code>{row.default}</Code>}</td>
                        </tr>
                        {row.description && (
                            <tr className='fl-docs-description'>
                                <td colSpan={3}>
                                    <Text>{row.description}</Text>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}

function AttributesTable({ title, rows }: { title: string; rows: Attribute[] }) {
    if (rows.length === 0) return null;
    return (
        <table className='fl-docs-table'>
            <thead>
                <tr>
                    <th>{title}</th>
                    <th>{t('docs.description')}</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.name} className='fl-docs-row'>
                        <td>
                            <Code>{row.name}</Code>
                            {row.type && (
                                <div className='fl-docs-type'>
                                    <Code>{row.type}</Code>
                                </div>
                            )}
                        </td>
                        <td>
                            <Text>{row.description}</Text>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * The elements of a web component: the parts of `elements` in its entry (`src/components/<name>/index.ts`), with their
 * declarations in the manifest.
 */
function webParts(name: string): { part: string; element: Declaration }[] {
    const elements = declarations.find(
        ({ module, declaration }) => module === `src/components/${name}/index.ts` && declaration.name === 'elements'
    );
    const value = elements?.declaration.default ?? '';
    const parts = value.startsWith('{') ? [...value.matchAll(PART)].map(([, part, className]) => [part, className]) : [['root', value]];
    return parts.flatMap(([part, className]) => {
        const element = declarations.find(({ declaration }) => declaration.kind === 'class' && declaration.name === className)?.declaration;
        return element ? [{ part: part as string, element }] : [];
    });
}

/** The core enum of a web part (`checkbox` + `indicator` → `CheckboxIndicatorDataAttributes`; a root: `CheckboxRoot…` or `Checkbox…`). */
function coreEnumOf(name: string, part: string, suffix: 'DataAttributes' | 'CssVars'): string | undefined {
    const candidates =
        part === 'root' ? [`${pascal(name)}Root${suffix}`, `${pascal(name)}${suffix}`] : [`${pascal(name)}${pascal(part)}${suffix}`];
    return candidates.find((candidate) => coreEnums[candidate]);
}

/** A part of a web component: its tag, attributes (without the style variants), events, data attributes, CSS variables. */
function WebPartReference({
    name,
    part,
    element,
    prefix,
    variants
}: {
    name: string;
    part: string;
    element: Declaration;
    prefix: string;
    variants: string[];
}) {
    const tag = `${prefix}-${name}${part === 'root' ? '' : `-${kebab(part)}`}`;
    const attributes: Prop[] = (element.attributes ?? [])
        .filter((attribute) => !variants.includes(attribute.name))
        .map((attribute) => ({
            name: attribute.name,
            type: attribute.type?.text ?? 'string',
            default: attribute.default,
            description: apiText(`web.${attribute.inheritedFrom?.name ?? element.name}.${attribute.name}`, attribute.description ?? '')
        }));
    const events: Attribute[] = (element.events ?? []).map((event) => ({
        name: event.name,
        type: event.type?.text.match(CUSTOM_EVENT)?.[1],
        description: event.description ?? ''
    }));
    const dataEnum = coreEnumOf(name, part, 'DataAttributes');
    const cssEnum = coreEnumOf(name, part, 'CssVars');
    return (
        <section className='fl-docs-part'>
            <h3 id={`api-${tag}`}>
                <Code>{`<${tag}>`}</Code>
            </h3>
            <Text>{element.description}</Text>
            <PropsTable title={t('docs.attribute')} rows={attributes} />
            <AttributesTable title={t('docs.event')} rows={events} />
            <AttributesTable title={t('docs.dataAttribute')} rows={coreItems(dataEnum, dataEnum ? (coreEnums[dataEnum] ?? []) : [])} />
            <AttributesTable title={t('docs.cssVariable')} rows={coreItems(cssEnum, cssEnum ? (coreEnums[cssEnum] ?? []) : [])} />
        </section>
    );
}

function PartReference({ family, part: source }: { family: Family; part: Part }) {
    const part = localized(family, source);
    const single = part.name === family.name;
    const name = single ? family.name : `${family.name}.${part.name}`;
    return (
        <section className='fl-docs-part'>
            <h3 id={`api-${kebab(name)}`}>
                <Code>{name}</Code>
            </h3>
            <Text>{part.description}</Text>
            <PropsTable title={t('docs.prop')} rows={part.props} />
            <AttributesTable title={t('docs.dataAttribute')} rows={part.dataAttributes} />
            <AttributesTable title={t('docs.cssVariable')} rows={part.cssVariables} />
        </section>
    );
}

/** The API reference of a web component, from its manifest: the parts its `define` registers. */
function WebReference({ family, prefix }: { family: Family; prefix: string }) {
    const parts = webParts(family.kebab);
    if (parts.length === 0) return null;
    const variants = family.variants.map((variant) => kebab(variant.name));
    return (
        <>
            <h2>{t('docs.apiReference')}</h2>
            {parts.map(({ part, element }) => (
                <WebPartReference key={part} name={family.kebab} part={part} element={element} prefix={prefix} variants={variants} />
            ))}
        </>
    );
}

function Styling({ family, options }: { family: Family; options: DocsPageOptions }) {
    if (family.variants.length === 0 && family.cssHooks.length === 0) return null;
    const variantName = (name: string) => (options.kind === 'web' ? kebab(name) : name);
    return (
        <>
            <h2>{t('docs.styling')}</h2>
            {family.variants.length > 0 && (
                <>
                    <Text>{t(options.kind === 'web' ? 'docs.variantsWeb' : 'docs.variantsReact')}</Text>
                    <table className='fl-docs-table'>
                        <thead>
                            <tr>
                                <th>{t('docs.variant')}</th>
                                <th>{t('docs.values')}</th>
                                <th>{t('docs.default')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {family.variants.map((variant) => (
                                <tr key={variant.name} className='fl-docs-row'>
                                    <td>
                                        <Code>{variantName(variant.name)}</Code>
                                    </td>
                                    <td>
                                        <Code>{variant.values.map((value) => `'${value}'`).join(' | ')}</Code>
                                    </td>
                                    <td>{variant.default === undefined ? '—' : <Code>{variant.default}</Code>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {family.cssHooks.length > 0 && (
                <>
                    <Text>{t('docs.cssHooks')}</Text>
                    <ul className='fl-docs-hooks'>
                        {family.cssHooks.map((hook) => (
                            <li key={hook}>
                                <Code>{hook}</Code>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}

/**
 * The docs page of a UI kit component: the stories' header and controls, then the API reference like Base UI's (each
 * part with its props or attributes, data attributes and CSS variables, from `tools/api-docs.ts`), the kit's variants
 * and CSS hooks, and every story.
 */
export function DocsPage(options: DocsPageOptions): React.JSX.Element {
    const family = useFamily();
    // Re-renders the page in the language of the toolbar.
    useLocale();
    return (
        <>
            <Title />
            <Subtitle />
            <ComponentDescription />
            <Primary />
            <Controls />
            {options.kind === 'react' && family && family.parts.length > 0 && (
                <>
                    <h2>{t('docs.apiReference')}</h2>
                    {family.parts.map((part) => (
                        <PartReference key={part.name} family={family} part={part} />
                    ))}
                </>
            )}
            {options.kind === 'web' && family && <WebReference family={family} prefix={options.prefix} />}
            {family && <Styling family={family} options={options} />}
            <Stories title={t('docs.stories')} />
        </>
    );
}
