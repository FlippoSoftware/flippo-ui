/**
 * Shared helpers of the generators: paths, the locales and their labels, MDX-safe text, tables and pages.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const root = join(docsRoot, '..');
export const content = join(docsRoot, 'content/docs');

/** The languages of the site: English (the default, every page) and Russian (the pages that have a translation). */
export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

/** The file of a page in a locale, Fumadocs' `dot` convention: `checkbox.mdx`, `checkbox.ru.mdx`. */
export function pageFile(path: string, locale: Locale, extension = 'mdx'): string {
    return locale === 'en' ? `${path}.${extension}` : `${path}.${locale}.${extension}`;
}

/** The labels of the generated pages (headings and table columns). */
export const LABELS = {
    en: {
        import: 'Import',
        apiReference: 'API reference',
        prop: 'Prop',
        attribute: 'Attribute',
        property: 'Property',
        type: 'Type',
        default: 'Default',
        description: 'Description',
        dataAttribute: 'Data attribute',
        cssVariable: 'CSS variable',
        event: 'Event',
        detail: 'Detail',
        events: 'Events',
        tag: 'Tag',
        properties: 'Properties',
        attributes: 'Attributes',
        dataAttributes: 'Data attributes',
        cssVariables: 'CSS variables',
        variants: 'Variants',
        variant: 'Variant',
        values: 'Values',
        classes: 'Classes',
        cssHooks: 'CSS hooks',
        token: 'Token',
        light: 'Light',
        dark: 'Dark',
        value: 'Value',
        parameters: 'Parameters',
        name: 'Name',
        example: 'Example',
        tagPrefix: 'The tags below use the prefix `ui`: yours is the one given to `define({ prefix })`.',
        generated: 'Generated from the sources: edit the JSDoc comments of the package, not this page.'
    },
    ru: {
        import: 'Импорт',
        apiReference: 'Справочник API',
        prop: 'Prop',
        attribute: 'Атрибут',
        property: 'Свойство',
        type: 'Тип',
        default: 'По умолчанию',
        description: 'Описание',
        dataAttribute: 'Data-атрибут',
        cssVariable: 'CSS-переменная',
        event: 'Событие',
        detail: 'Detail',
        events: 'События',
        tag: 'Тег',
        properties: 'Свойства',
        attributes: 'Атрибуты',
        dataAttributes: 'Data-атрибуты',
        cssVariables: 'CSS-переменные',
        variants: 'Варианты',
        variant: 'Вариант',
        values: 'Значения',
        classes: 'Классы',
        cssHooks: 'CSS-хуки',
        token: 'Токен',
        light: 'Светлая',
        dark: 'Тёмная',
        value: 'Значение',
        parameters: 'Параметры',
        name: 'Имя',
        example: 'Пример',
        tagPrefix: 'Теги ниже — с префиксом `ui`: у вас он тот, что передан в `define({ prefix })`.',
        generated: 'Сгенерировано из исходников: правьте JSDoc-комментарии пакета, а не эту страницу.'
    }
} satisfies Record<Locale, Record<string, string>>;

type Dictionary = { [key: string]: string | Dictionary };

const dictionaries = Object.fromEntries(
    LOCALES.map((locale) => [locale, JSON.parse(readFileSync(join(root, `tools/storybook/i18n/${locale}.json`), 'utf8')) as Dictionary])
) as Record<Locale, Dictionary>;

/**
 * A text of the API dictionaries of the Storybook (`tools/storybook/i18n/<locale>.json`, `api.*`): the translations of
 * the JSDoc descriptions, shared with the docs site. Undefined when the locale has none.
 */
export function translation(locale: Locale, key: string): string | undefined {
    let node: string | Dictionary | undefined = dictionaries[locale];
    for (const segment of key.split('.')) {
        node = typeof node === 'object' ? node[segment] : undefined;
    }
    return typeof node === 'string' ? node : undefined;
}

const CODE_SPAN = /(`+)([\s\S]*?)\1/g;

/**
 * Markdown text that MDX reads as text: outside code spans, `{`, `}` and `<` (JSX) are escaped. Links and emphasis
 * stay markdown.
 */
export function mdx(text: string): string {
    let result = '';
    let last = 0;
    for (const match of text.matchAll(CODE_SPAN)) {
        result += escapeText(text.slice(last, match.index)) + match[0];
        last = match.index + match[0].length;
    }
    return result + escapeText(text.slice(last));
}

function escapeText(text: string): string {
    return text.replace(/[{}]/g, (brace) => `\\${brace}`).replace(/</g, '&lt;');
}

/** A table cell: one line (paragraphs joined with `<br />`), `|` escaped. */
export function cell(text: string | undefined): string {
    if (!text) {
        return '';
    }
    return mdx(text.trim())
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.replace(/\n(?=[-*] )/g, '<br />').replace(/\n/g, ' '))
        .join('<br /><br />')
        .replace(/\|/g, '\\|');
}

/** Code in a table cell: a code span that may hold backticks and `|`. */
export function code(text: string | undefined): string {
    if (!text) {
        return '';
    }
    const value = text.replace(/\s+/g, ' ').replace(/\|/g, '\\|');
    return value.includes('`') ? `\`\` ${value} \`\`` : `\`${value}\``;
}

/** A markdown table, or nothing without rows. */
export function table(head: string[], rows: string[][]): string {
    if (rows.length === 0) {
        return '';
    }
    const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
    return [line(head), line(head.map(() => '---')), ...rows.map(line)].join('\n');
}

/** A YAML string of the frontmatter. */
function yaml(value: string): string {
    return JSON.stringify(value.replace(/\s+/g, ' ').trim());
}

export type Page = { title: string; description?: string | undefined; body: string };

/** Writes a page with its frontmatter (`title`, `description`: Fumadocs' page header and search). */
export function writePage(file: string, page: Page) {
    const frontmatter = [`title: ${yaml(page.title)}`, ...(page.description ? [`description: ${yaml(page.description)}`] : [])];
    write(file, `---\n${frontmatter.join('\n')}\n---\n\n${page.body.replace(/\n{3,}/g, '\n\n').trim()}\n`);
}

/** Writes the `meta.json` of a folder: its title in the sidebar and the order of its pages. */
export function writeMeta(file: string, meta: { title: string; pages?: string[]; defaultOpen?: boolean }) {
    write(file, `${JSON.stringify(meta, null, 4)}\n`);
}

export function write(file: string, text: string) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
}

/** Removes a generated folder before writing it again (pages of removed components go with it). */
export function clean(folder: string) {
    rmSync(folder, { recursive: true, force: true });
}

/** The first sentence of a description: the description of a page. */
export function summary(text: string | undefined): string | undefined {
    const first = text?.split(/\n\n/)[0].replace(/\s+/g, ' ').trim();
    return first?.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? first;
}

export const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
export const camel = (name: string) => name.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());
export const pascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, letter: string) => letter.toUpperCase());
/** A title from a kebab name: `checkbox-group` → `Checkbox group`. */
export const titleOf = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
