/**
 * The API reference of `@flippo-software/react-components`: a page per component (`react-components/api/<name>`) with
 * each part's props, data attributes and CSS variables, like the reference tables of Base UI.
 *
 * Source: `tools/storybook/api.json`, written from the JSDoc of react-components by `tools/api-docs.ts` (the Storybook
 * docs pages use it too), with the data attributes and CSS variables of the core enums; the Russian pages take the
 * translations of `tools/storybook/i18n/ru.json` (`api.*`, `core.*`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    cell,
    clean,
    code,
    content,
    LABELS,
    LOCALES,
    type Locale,
    pageFile,
    root,
    summary,
    table,
    translation,
    writeMeta,
    writePage
} from './lib.ts';

type Item = { name: string; type?: string; default?: string; description: string };
type Part = {
    name: string;
    description: string;
    props: Item[];
    dataAttributes: Item[];
    cssVariables: Item[];
    dataAttributesEnum?: string;
    cssVariablesEnum?: string;
};
type Family = { name: string; kebab: string; parts: Part[] };

const out = join(content, 'react-components/api');

/** A text in a locale: its own key, else the common key of a prop with the same English text, else the JSDoc. */
function text(locale: Locale, key: string, source: string, commonKey?: string): string {
    const own = translation(locale, key);
    if (own) {
        return own;
    }
    if (commonKey && translation('en', commonKey) === source) {
        return translation(locale, commonKey) ?? source;
    }
    return source;
}

function partSection(family: Family, part: Part, locale: Locale): string {
    const labels = LABELS[locale];
    const base = `api.${family.name}.${part.name}`;
    // A component of one part (Button) is not a namespace: `<Button>`, not `<Button.Button>`.
    const single = family.parts.length === 1 && part.name === family.name;
    const props = part.props.map((prop) => [
        code(prop.name),
        code(prop.type),
        code(prop.default),
        cell(text(locale, `${base}.props.${prop.name}`, prop.description, `api.common.props.${prop.name}`))
    ]);
    // The data attributes and CSS variables are the core machine's: their texts are shared with the web components.
    const data = part.dataAttributes.map((item) => [
        code(item.name),
        cell(text(locale, `core.${part.dataAttributesEnum}.${item.name}`, item.description))
    ]);
    const cssVars = part.cssVariables.map((item) => [
        code(item.name),
        cell(text(locale, `core.${part.cssVariablesEnum}.${item.name}`, item.description))
    ]);
    return [
        single ? '' : `### ${part.name}`,
        cell(text(locale, `${base}.description`, part.description)).replace(/<br \/><br \/>/g, '\n\n'),
        table([labels.prop, labels.type, labels.default, labels.description], props),
        table([labels.dataAttribute, labels.description], data),
        table([labels.cssVariable, labels.description], cssVars)
    ].join('\n\n');
}

function familyPage(family: Family, locale: Locale) {
    const labels = LABELS[locale];
    const main = family.parts.find((part) => part.name === 'Root' || part.name === family.name) ?? family.parts[0];
    const description = text(locale, `api.${family.name}.${main.name}.description`, main.description);
    const body = [
        `## ${labels.import}`,
        `\`\`\`tsx\nimport { ${family.name} } from '@flippo-software/react-components/${family.kebab}';\n\`\`\``,
        `## ${labels.apiReference}`,
        ...family.parts.map((part) => partSection(family, part, locale)),
        `---\n\n_${labels.generated}_`
    ].join('\n\n');
    writePage(join(out, pageFile(family.kebab, locale)), { title: family.name, description: summary(description), body });
}

export function generateReactComponents() {
    const api = JSON.parse(readFileSync(join(root, 'tools/storybook/api.json'), 'utf8')) as Record<string, Family>;
    // The families of the kit that have no headless parts (Box, Text…) belong to component-styles.
    const families = Object.values(api).filter((family) => family.parts.length > 0);
    clean(out);
    for (const family of families) {
        for (const locale of LOCALES) {
            familyPage(family, locale);
        }
    }
    writeMeta(join(out, 'meta.json'), { title: 'Components', pages: families.map((family) => family.kebab) });
    writeMeta(join(out, 'meta.ru.json'), { title: 'Компоненты', pages: families.map((family) => family.kebab) });
    return families.length;
}
