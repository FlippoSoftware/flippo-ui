/**
 * The reference of `@flippo-software/component-styles` (`component-styles/api/`):
 *
 * - `tokens`: every custom property of `:root` (compiled from `src/styles/tokens.scss`), the colours with their light
 *   and dark values;
 * - `scss`: the public SCSS API (`@use '…/scss' as fl`): mixins, functions and token maps, by SassDoc from the `///`
 *   comments of `scss/`;
 * - `components/<name>`: the class recipe of each component (its slots and base classes, its variants, from the
 *   built recipes and their JSDoc) and the CSS hooks of its stylesheet (`--fl-<name>-*`).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import * as sass from 'sass';
import sassdoc from 'sassdoc';
import ts from 'typescript';

import {
    camel,
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
    titleOf,
    writeMeta,
    writePage
} from './lib.ts';

const styles = join(root, 'packages/component-styles');
const out = join(content, 'component-styles/api');

// --- Tokens -------------------------------------------------------------------------------------------------------

const DECLARATION = /(--fl-[\w-]+):\s*([^;]+);/g;
const LIGHT_DARK = /^light-dark\((.+),\s*(.+)\)$/s;
const VAR = /^var\((--fl-[\w-]+)\)$/;

/** Token groups, in the order of the page: the first prefix that matches. */
const GROUPS: [prefix: string, en: string, ru: string][] = [
    ['--fl-color-neutral-', 'Neutral colours', 'Нейтральные цвета'],
    ['--fl-color-brand-', 'Brand colours', 'Цвета бренда'],
    ['--fl-color-misc-', 'Accent colours', 'Акцентные цвета'],
    ['--fl-color-', 'Semantic colours', 'Семантические цвета'],
    ['--fl-focus-', 'Focus', 'Фокус'],
    ['--fl-font-', 'Font families', 'Шрифты'],
    ['--fl-text-', 'Text styles', 'Стили текста'],
    ['--fl-spacing-', 'Spacing', 'Отступы'],
    ['--fl-radius-', 'Radii', 'Скругления'],
    ['--fl-size-', 'Sizes', 'Размеры'],
    ['--fl-border-width-', 'Border widths', 'Толщина границ'],
    ['--fl-shadow-', 'Shadows', 'Тени'],
    ['--fl-duration-', 'Durations', 'Длительности'],
    ['--fl-ease-', 'Easing', 'Кривые анимации'],
    ['--fl-z-', 'Z-index', 'Z-index'],
    ['--fl-', 'Other', 'Прочее']
];

const swatch = (color: string) =>
    `<span style={{ display: 'inline-block', width: 14, height: 14, marginInlineEnd: 6, verticalAlign: 'middle', borderRadius: 4, border: '1px solid rgb(128 128 128 / 0.4)', background: '${color}' }} />`;

function tokensPage(locale: Locale) {
    const labels = LABELS[locale];
    const css = sass.compile(join(styles, 'src/styles/tokens.scss')).css;
    const tokens = new Map([...css.matchAll(DECLARATION)].map(([, name, value]) => [name, value.replace(/\s+/g, ' ').trim()]));
    /** A value with its swatch: a colour, or the primitive it points at (`var(--fl-color-brand-40)`). */
    const colorCell = (value: string) => {
        const reference = value.match(VAR)?.[1];
        const resolved = reference ? tokens.get(reference) : value;
        const shown = reference ? `${code(reference)} ${code(resolved)}` : code(value);
        return resolved?.startsWith('#') || resolved?.startsWith('rgb') ? `${swatch(resolved)}${shown}` : shown;
    };
    const grouped = new Map<string, [string, string][]>();
    for (const [name, value] of tokens) {
        const group = GROUPS.find(([prefix]) => name.startsWith(prefix)) ?? GROUPS[GROUPS.length - 1];
        grouped.set(group[0], [...(grouped.get(group[0]) ?? []), [name, value]]);
    }
    const sections = GROUPS.filter(([prefix]) => grouped.has(prefix)).map(([prefix, en, ru]) => {
        const rows = grouped.get(prefix) ?? [];
        const title = `## ${locale === 'ru' ? ru : en}`;
        if (prefix === '--fl-color-') {
            const pairs = rows.map(([name, value]) => {
                const [, light = value, dark = value] = value.match(LIGHT_DARK) ?? [];
                return [code(name), colorCell(light.trim()), colorCell(dark.trim())];
            });
            return [title, table([labels.token, labels.light, labels.dark], pairs)].join('\n\n');
        }
        const isColor = prefix.startsWith('--fl-color-');
        return [
            title,
            table(
                [labels.token, labels.value],
                rows.map(([name, value]) => [code(name), isColor ? colorCell(value) : code(value)])
            )
        ].join('\n\n');
    });
    const intro =
        locale === 'ru'
            ? 'Custom properties на `:root` из `@flippo-software/component-styles/css/tokens.css`. Семантические цвета — пары `light-dark()`: они следуют `color-scheme` элемента (тема системы или `data-theme`).'
            : 'The custom properties of `:root`, from `@flippo-software/component-styles/css/tokens.css`. The semantic colours are `light-dark()` pairs: they follow the `color-scheme` of the element (the system theme, or `data-theme`).';
    writePage(join(out, pageFile('tokens', locale)), {
        title: locale === 'ru' ? 'Токены' : 'Tokens',
        description:
            locale === 'ru'
                ? 'Цвета, типографика, отступы, скругления, тени и анимации.'
                : 'Colours, typography, spacing, radii, shadows and motion.',
        body: [intro, ...sections, `---\n\n_${labels.generated}_`].join('\n\n')
    });
    return tokens.size;
}

// --- SCSS (SassDoc) -------------------------------------------------------------------------------------------------

type SassItem = {
    description: string;
    context: { type: 'mixin' | 'function' | 'variable' | 'placeholder'; name: string; value?: string };
    group: string[];
    access: string;
    parameter?: { type?: string; name: string; default?: string; description?: string }[];
    example?: { type: string; code: string }[];
    file: { path: string };
};

const GROUP_TITLES: Record<string, string> = {
    'custom-properties': 'Custom properties',
    states: 'States',
    patterns: 'Patterns',
    typography: 'Typography',
    layout: 'Layout',
    colors: 'Colour tokens',
    scale: 'Scale tokens'
};

function signature(item: SassItem): string {
    const { type, name } = item.context;
    if (type === 'variable') {
        return `$${name}`;
    }
    const params = item.parameter?.map((parameter) => `$${parameter.name}${parameter.default ? `: ${parameter.default}` : ''}`).join(', ');
    return `@${type === 'mixin' ? 'include' : 'function'} fl.${name}${params ? `(${params})` : ''}`;
}

async function scssPage() {
    const labels = LABELS.en;
    const items = ((await sassdoc.parse(join(styles, 'scss'), { verbose: false })) as SassItem[]).filter(
        (item) => item.access === 'public'
    );
    const groups = [...new Set(items.map((item) => item.group[0]))];
    const sections = groups.map((group) => {
        const entries = items
            .filter((item) => item.group[0] === group)
            .map((item) => {
                const parameters = (item.parameter ?? []).map((parameter) => [
                    code(`$${parameter.name}`),
                    code(parameter.type),
                    code(parameter.default),
                    cell(parameter.description)
                ]);
                const examples = (item.example ?? []).map((example) => `\`\`\`${example.type || 'scss'}\n${example.code.trim()}\n\`\`\``);
                return [
                    `### ${item.context.type === 'variable' ? '$' : ''}${item.context.name}`,
                    `\`\`\`scss\n${signature(item)}\n\`\`\``,
                    cell(item.description).replace(/<br \/><br \/>/g, '\n\n'),
                    table([labels.name, labels.type, labels.default, labels.description], parameters),
                    ...examples
                ].join('\n\n');
            });
        return [`## ${GROUP_TITLES[group] ?? titleOf(group)}`, ...entries].join('\n\n');
    });
    const intro =
        "The public SCSS API: `@use '@flippo-software/component-styles/scss' as fl;`. The token maps are the sources of the custom properties; the mixins write them or apply the shared patterns of the components.";
    writePage(join(out, pageFile('scss', 'en')), {
        title: 'SCSS',
        description: 'Mixins, functions and token maps of the SCSS API.',
        body: [intro, ...sections, `---\n\n_${labels.generated}_`].join('\n\n')
    });
    return items.length;
}

// --- Components -----------------------------------------------------------------------------------------------------

/** Global token groups: the hooks of a component are its own `--fl-<component>-*`. */
const GLOBAL = /^--fl-(color|spacing|radius|size|text|font|shadow|duration|ease|z|border-width|focus)-/;

type Recipe = ((props?: Record<string, unknown>) => string | Record<string, string>) & {
    variantOptions?: Record<string, readonly unknown[]>;
    defaultVariants?: Record<string, unknown>;
};

type RecipeDocs = { description?: string; variants: Record<string, string> };

/** The text of the JSDoc comments of a node. */
function jsDoc(node: ts.Node): string | undefined {
    const comments = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
    return (
        comments
            .map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? '')
            .join('\n')
            .trim() || undefined
    );
}

/** The JSDoc of each variant of a recipe's config (`variants: { /** … *\/ compact: … }`). */
function variantDocs(config: ts.Expression | undefined): Record<string, string> {
    const variants =
        config && ts.isObjectLiteralExpression(config)
            ? config.properties.find((property) => property.name?.getText() === 'variants')
            : undefined;
    if (!(variants && ts.isPropertyAssignment(variants) && ts.isObjectLiteralExpression(variants.initializer))) {
        return {};
    }
    const entries = variants.initializer.properties.map((variant) => [variant.name?.getText().replace(/['"]/g, ''), jsDoc(variant)]);
    return Object.fromEntries(entries.filter((entry): entry is [string, string] => entry[0] !== undefined && entry[1] !== undefined));
}

/** The JSDoc of a recipe and of its variants, from its source (`src/components/<name>/index.ts`). */
function recipeDocs(file: string, exportName: string): RecipeDocs {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of source.statements.filter(ts.isVariableStatement)) {
        const call = statement.declarationList.declarations.find((item) => item.name.getText() === exportName)?.initializer;
        if (call && ts.isCallExpression(call)) {
            return { description: jsDoc(statement), variants: variantDocs(call.arguments[0]) };
        }
    }
    return { variants: {} };
}

function cssHooks(name: string): string[] {
    const file = join(styles, 'src/components', name, `${name}.scss`);
    if (!existsSync(file)) {
        return [];
    }
    const hooks = new Set([...readFileSync(file, 'utf8').matchAll(/var\(\s*(--fl-[a-z0-9-]+)/g)].map((match) => match[1]));
    return [...hooks].filter((hook) => !GLOBAL.test(hook)).sort();
}

function componentPage(name: string, exportName: string, recipe: Recipe | undefined) {
    const labels = LABELS.en;
    const docs = recipeDocs(join(styles, 'src/components', name, 'index.ts'), exportName);
    const base = typeof recipe === 'function' ? recipe() : undefined;
    const slots = typeof base === 'string' ? { root: base } : (base ?? {});
    const defaults = recipe?.defaultVariants ?? {};
    const variants = Object.entries(recipe?.variantOptions ?? {}).map(([variant, values]) => [
        code(variant),
        values.map((value) => code(String(value))).join(', '),
        code(defaults[variant] === undefined ? undefined : String(defaults[variant])),
        cell(docs.variants[variant])
    ]);
    const hooks = cssHooks(name);
    const usage = `${exportName}(${variants.length > 0 ? '{ … }' : ''});`;
    const body = [
        `## ${labels.import}`,
        `\`\`\`ts\nimport { ${exportName} } from '@flippo-software/component-styles/${name}';\n\n${usage}\n\`\`\``,
        `## ${labels.classes}`,
        table(
            ['Slot', labels.classes],
            Object.entries(slots).map(([slot, classes]) => [code(slot), classes.split(/\s+/).filter(Boolean).map(code).join(' ')])
        ),
        variants.length > 0 ? `## ${labels.variants}` : '',
        table([labels.variant, labels.values, labels.default, labels.description], variants),
        hooks.length > 0 ? `## ${labels.cssHooks}\n\n${LABELS_HOOKS}\n\n${hooks.map((hook) => `- \`${hook}\``).join('\n')}` : '',
        `---\n\n_${labels.generated}_`
    ].join('\n\n');
    writePage(join(out, 'components', pageFile(name, 'en')), { title: titleOf(name), description: summary(docs.description), body });
}

async function componentPages() {
    const built = join(styles, 'dist/index.js');
    if (!existsSync(built)) {
        throw new Error('component-styles: the package is not built (pnpm build).');
    }
    const recipes = (await import(pathToFileURL(built).href)) as Record<string, Recipe>;
    const names = readdirSync(join(styles, 'src/components')).filter((name) =>
        existsSync(join(styles, 'src/components', name, 'index.ts'))
    );
    for (const name of names) {
        const exportName = [camel(name), `${camel(name)}Recipe`].find((key) => typeof recipes[key] === 'function') ?? camel(name);
        componentPage(name, exportName, recipes[exportName]);
    }
    writeMeta(join(out, 'components/meta.json'), { title: 'Components', pages: names });
    return names.length;
}

const LABELS_HOOKS =
    'Set them on the element or on an ancestor to change the look without classes of your own; the stylesheet never sets them. The global tokens are on the [Tokens](../tokens.mdx) page.';

export async function generateComponentStyles() {
    clean(out);
    const tokens = LOCALES.map(tokensPage)[0];
    const scss = await scssPage();
    const components = await componentPages();
    writeMeta(join(out, 'meta.json'), { title: 'API', pages: ['tokens', 'scss', 'components'] });
    writeMeta(join(out, 'meta.ru.json'), { title: 'API', pages: ['tokens', 'scss', 'components'] });
    return { tokens, scss, components };
}
