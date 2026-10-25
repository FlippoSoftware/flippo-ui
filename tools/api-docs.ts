/**
 * Builds the API reference of the UI kits for their Storybook docs pages (`tools/storybook/DocsPage.tsx`), like the
 * reference tables of Base UI, from the sources:
 *
 * - every part of `react-components` (`src/components/<Name>/index.parts.ts`): its description and its props, with
 *   their types, defaults and descriptions (JSDoc, `@default`), read with the TypeScript 5 compiler API;
 * - the data attributes and CSS variables of each part: the `<Name><Part>DataAttributes` and `<Name><Part>CssVars`
 *   enums of `core-components` (the machines set them; the web components document the same enums);
 * - the kit's variants of each family (the recipes of `component-styles`, from its build) and the public CSS hooks of
 *   its stylesheet (`--fl-<component>-*`).
 *
 * Usage: `node tools/api-docs.ts` (the kits' `storybook` scripts run it). Writes `tools/storybook/api.json` and
 * `tools/storybook/core-enums.json` (the data attributes and CSS variables of every core enum, for the web components).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import ts from 'typescript5';

import { coreEnumOf, registeredWebParts } from './core-enums.ts';

type Prop = {
    name: string;
    type: string;
    required: boolean;
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
    /** The core enums of the data attributes and CSS variables (`CheckboxRootDataAttributes`): their translation keys. */
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

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reactComponents = join(root, 'packages/react-components');
const styles = join(root, 'packages/component-styles');
const kitComponents = join(root, 'packages/ui-kit-react/src/components');

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const camel = (name: string) => name.charAt(0).toLowerCase() + name.slice(1);

// The program of react-components, with its tsconfig (paths aliases), so the props resolve fully.
const configFile = ts.readConfigFile(join(reactComponents, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, reactComponents);
/** A family's parts (`index.parts.ts`), or its one component (`index.ts`: Button, Input, Toggle). */
function entryOf(name: string): string | undefined {
    const folder = join(reactComponents, 'src/components', name);
    return ['index.parts.ts', 'index.ts'].map((file) => join(folder, file)).find((file) => existsSync(file));
}
const entryFiles = readdirSync(join(reactComponents, 'src/components'))
    .map(entryOf)
    .filter((file): file is string => file !== undefined);
const program = ts.createProgram({
    rootNames: entryFiles,
    options: { ...parsed.options, noEmit: true }
});
const checker = program.getTypeChecker();

// The data attributes and CSS variables are set by the core machines: their enums are read from core-components.
const coreComponents = join(root, 'packages/core-components');
const coreConfig = ts.parseJsonConfigFileContent(
    ts.readConfigFile(join(coreComponents, 'tsconfig.json'), ts.sys.readFile).config,
    ts.sys,
    coreComponents
);
const coreProgram = ts.createProgram({
    // Discover declarations, not filenames: a misspelled filename must not hide an otherwise public enum.
    rootNames: coreConfig.fileNames.filter((file) => file.startsWith(join(coreComponents, 'src')) && !file.endsWith('.test.ts')),
    options: { ...coreConfig.options, noEmit: true }
});
const coreChecker = coreProgram.getTypeChecker();
const coreEnums = new Map<string, ts.EnumDeclaration>();
for (const source of coreProgram.getSourceFiles().filter((file) => file.fileName.startsWith(`${coreComponents}/src/`))) {
    for (const node of source.statements) {
        if (!ts.isEnumDeclaration(node) || !/(DataAttributes|CssVars)$/.test(node.name.text)) continue;
        if (coreEnums.has(node.name.text)) throw new Error(`api-docs: duplicate core enum ${node.name.text}.`);
        coreEnums.set(node.name.text, node);
    }
}
const enumIndex = Object.fromEntries(coreEnums);

/** Reviewed parts that render no state attributes (providers, portals, text and structural parts). */
const NO_STATE_ATTRIBUTES = {
    react: new Set([
        'AutocompleteRoot',
        'AutocompleteValue',
        'AvatarFallback',
        'AvatarImage',
        'AvatarRoot',
        'CSPProvider',
        'LabelableProvider',
        'NoSsr',
        'ComboboxChips',
        'ComboboxCollection',
        'ComboboxEmpty',
        'ComboboxGroup',
        'ComboboxGroupLabel',
        'ComboboxPortal',
        'ComboboxRoot',
        'ComboboxRow',
        'ComboboxStatus',
        'ComboboxValue',
        'ContextMenuRoot',
        'DialogDescription',
        'DialogPortal',
        'DialogRoot',
        'DialogTitle',
        'DrawerDescription',
        'DrawerPortal',
        'DrawerRoot',
        'DrawerTitle',
        'FieldValidity',
        'Form',
        'MarqueeTrack',
        'MenuGroup',
        'MenuGroupLabel',
        'MenuPortal',
        'MenuRadioGroup',
        'MenuRoot',
        'MenuSubmenuRoot',
        'MeterIndicator',
        'MeterLabel',
        'MeterRoot',
        'MeterTrack',
        'MeterValue',
        'NavigationMenuItem',
        'NavigationMenuPortal',
        'NavigationMenuViewport',
        'PopoverClose',
        'PopoverDescription',
        'PopoverPortal',
        'PopoverRoot',
        'PopoverTitle',
        'ScrollAreaCorner',
        'SelectGroup',
        'SelectGroupLabel',
        'SelectItemText',
        'SelectPortal',
        'SelectRoot',
        'ToastPortal',
        'ToastProvider',
        'TooltipMultiple',
        'TooltipPortal',
        'TooltipProvider',
        'TooltipRoot'
    ]),
    web: new Set([
        'autocomplete.root',
        'avatar.fallback',
        'avatar.image',
        'avatar.root',
        // Unlike their React counterparts, the web chip and remove button emit only native/ARIA attributes.
        'combobox.chip',
        'combobox.chipLabel',
        'combobox.chipRemove',
        'combobox.chips',
        'combobox.empty',
        'combobox.group',
        'combobox.groupLabel',
        'combobox.root',
        'combobox.row',
        'combobox.status',
        'combobox.value',
        'context-menu.root',
        'dialog.description',
        'dialog.root',
        'dialog.title',
        'drawer.description',
        'drawer.root',
        'drawer.title',
        'form.root',
        'marquee.track',
        'menu.group',
        'menu.groupLabel',
        'menu.radioGroup',
        'menu.root',
        'menu.submenu',
        'meter.indicator',
        'meter.label',
        'meter.root',
        'meter.track',
        'meter.value',
        'navigation-menu.item',
        'popover.close',
        'popover.description',
        'popover.root',
        'popover.title',
        'select.group',
        'select.groupLabel',
        'select.itemText',
        'select.list',
        'select.root',
        'toast.provider',
        'tooltip.provider',
        'tooltip.root'
    ])
};
const missingEnums = new Set<string>();

function docs(symbol: ts.Symbol, from = checker): string {
    return ts.displayPartsToString(symbol.getDocumentationComment(from)).trim();
}

function tag(symbol: ts.Symbol, name: string, from = checker): string | undefined {
    const found = symbol.getJsDocTags(from).find((jsDocTag) => jsDocTag.name === name);
    return found ? ts.displayPartsToString(found.text).trim() || undefined : undefined;
}

/** The type of a prop as written in its declaration (`(checked: boolean, …) => void`), else as the checker prints it. */
function typeOf(symbol: ts.Symbol): string {
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
    if (declaration && (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) && declaration.type) {
        return declaration.type.getText().replace(/\s+/g, ' ');
    }
    const type = declaration ? checker.getTypeOfSymbolAtLocation(symbol, declaration) : checker.getDeclaredTypeOfSymbol(symbol);
    return checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation).replace(/ \| undefined$/, '');
}

/** Props declared by the workspace (react-components, its lib types), not the HTML attributes from `@types/react`. */
function isOwnProp(symbol: ts.Symbol): boolean {
    return (symbol.declarations ?? []).some((declaration) => {
        const file = declaration.getSourceFile().fileName;
        return file.startsWith(join(reactComponents, 'src')) && !file.includes('node_modules');
    });
}

const COMMON = new Set(['asChild', 'className', 'ref', 'render', 'style']);

function propsOf(component: ts.Symbol): Prop[] {
    const propsSymbol = component.exports?.get('Props' as ts.__String);
    if (!propsSymbol) return [];
    const type = checker.getDeclaredTypeOfSymbol(propsSymbol);
    return (
        checker
            .getPropertiesOfType(type)
            .filter(isOwnProp)
            .map((prop) => ({
                name: prop.getName(),
                type: typeOf(prop),
                required: !(prop.flags & ts.SymbolFlags.Optional),
                default: tag(prop, 'default'),
                description: docs(prop)
            }))
            // The part's own props first, then the ones every part has.
            .sort((a, b) => Number(COMMON.has(a.name)) - Number(COMMON.has(b.name)) || a.name.localeCompare(b.name))
    );
}

/** The members of a core enum (`PopoverPopupDataAttributes`): value, `@type` and description. */
function enumMembers(enumName: string): Attribute[] {
    const node = coreEnums.get(enumName);
    if (!node) return [];
    const attributes: Attribute[] = [];
    for (const member of node.members) {
        const symbol = coreChecker.getSymbolAtLocation(member.name);
        const value = coreChecker.getConstantValue(member);
        if (typeof value !== 'string' || !symbol) continue;
        attributes.push({
            name: value,
            type: tag(symbol, 'type', coreChecker)?.replace(/^\{(.*)\}$/s, '$1'),
            description: docs(symbol, coreChecker)
        });
    }
    return attributes;
}

/** The data attributes and CSS variables of a part: the core enums named after it. */
function partEnums(componentName: string): Pick<Part, 'dataAttributes' | 'cssVariables' | 'dataAttributesEnum' | 'cssVariablesEnum'> {
    const options = { adapter: 'react' as const, componentName };
    const data = coreEnumOf(enumIndex, '', '', 'DataAttributes', options);
    const css = coreEnumOf(enumIndex, '', '', 'CssVars', options);
    if (!data && !NO_STATE_ATTRIBUTES.react.has(componentName)) missingEnums.add(`react:${componentName}`);
    return {
        dataAttributes: data ? enumMembers(data) : [],
        cssVariables: css ? enumMembers(css) : [],
        ...(data && { dataAttributesEnum: data }),
        ...(css && { cssVariablesEnum: css })
    };
}

/**
 * The order of the parts in the reference: the anatomy of a component, from the outside in (the exports are
 * alphabetical). Parts it does not know go last, alphabetically.
 */
const ANATOMY = [
    'Provider',
    'Root',
    'Header',
    'Label',
    'Legend',
    'Trigger',
    'Value',
    'Icon',
    'Input',
    'CheckboxGroup',
    'Chips',
    'Chip',
    'ChipRemove',
    'Clear',
    'Control',
    'Form',
    'Frame',
    'Image',
    'Fallback',
    'Line',
    'Menubar',
    'Overlay',
    'GenerateTrigger',
    'ClipboardTrigger',
    'DownloadTrigger',
    'Pin',
    'FocusFunnel',
    'Portal',
    'Backdrop',
    'Positioner',
    'Popup',
    'Arrow',
    'Multiple',
    'Symbol',
    'CopyButton',
    'Textarea',
    'Toggle',
    'ToggleGroup',
    'Track',
    'Indicator',
    'Thumb',
    'Viewport',
    'Content',
    'List',
    'Empty',
    'Scrollbar',
    'Corner',
    'Status',
    'Collection',
    'Row',
    'Group',
    'GroupLabel',
    'Tab',
    'Title',
    'Description',
    'Action',
    'Drag',
    'Close',
    'Item',
    'CheckboxItem',
    // biome-ignore lint/security/noSecrets: part names, not a secret.
    'CheckboxItemIndicator',
    'Error',
    'ItemText',
    'ItemIndicator',
    'Marker',
    'Panel',
    'RadioGroup',
    'RadioItem',
    'RadioItemIndicator',
    'Subheader',
    'SubmenuRoot',
    'SubmenuTrigger',
    'Separator',
    'Link',
    'Button',
    'ScrollUpArrow',
    'ScrollDownArrow',
    'Validity'
];

/** Families whose parts nest otherwise: a `Group` around the input, not a group of items. */
const ANATOMY_OF: Record<string, string[]> = {
    NumberField: ['Root', 'ScrubArea', 'ScrubAreaCursor', 'Group', 'Decrement', 'Input', 'Increment']
};

function partsOf(entry: string): Part[] {
    const source = program.getSourceFile(entry);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);
    if (!moduleSymbol) return [];
    const parts: Part[] = [];
    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
        const target = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        // Components only: a function with a `Props` namespace member (not `createHandle`, contexts, types).
        if (!(target.flags & ts.SymbolFlags.Function) || !target.exports?.has('Props' as ts.__String)) continue;
        parts.push({
            name: exported.getName(),
            description: docs(target),
            props: propsOf(target),
            ...partEnums(target.getName())
        });
    }
    // The order of the anatomy (the exports are alphabetical); parts it does not know go last, alphabetically.
    const anatomy = ANATOMY_OF[entry.split('/').at(-2) ?? ''] ?? ANATOMY;
    const rank = (name: string) => (anatomy.includes(name) ? anatomy.indexOf(name) : anatomy.length);
    return parts.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}

/** The public hooks of a component's stylesheet: `--fl-<x>-*`, not the global token groups. */
const GLOBAL = /^--fl-(color|spacing|radius|size|text|font|shadow|duration|ease|z|border-width|focus)-/;
function cssHooks(name: string): string[] {
    const file = join(styles, 'src/components', name, `${name}.scss`);
    if (!existsSync(file)) return [];
    const hooks = new Set<string>();
    for (const match of readFileSync(file, 'utf8').matchAll(/var\(\s*(--fl-[a-z0-9-]+)/g)) {
        if (!GLOBAL.test(match[1])) hooks.add(match[1]);
    }
    return [...hooks].sort();
}

type Recipe = {
    variantOptions?: Record<string, readonly unknown[]>;
    defaultVariants?: Record<string, unknown>;
};

async function loadRecipes(): Promise<Record<string, Recipe>> {
    const built = join(styles, 'dist/index.js');
    if (!existsSync(built)) {
        console.warn('api-docs: component-styles is not built (pnpm build): the variants are left out.');
        return {};
    }
    return (await import(pathToFileURL(built).href)) as Record<string, Recipe>;
}

function variantsOf(recipe: Recipe | undefined): Variant[] {
    if (!recipe?.variantOptions) return [];
    return Object.entries(recipe.variantOptions).map(([name, values]) => ({
        name,
        values: values.map(String),
        default: recipe.defaultVariants?.[name] === undefined ? undefined : String(recipe.defaultVariants[name])
    }));
}

const recipes = await loadRecipes();
const kitFamilies = readdirSync(kitComponents).filter((name) => existsSync(join(kitComponents, name, 'index.ts')));
const reactParts = new Map(entryFiles.map((entry) => [entry, partsOf(entry)]));

const manifestFile = join(root, 'packages/web-components/custom-elements.json');
if (!existsSync(manifestFile)) throw new Error('api-docs: custom-elements.json is missing: build web-components first (pnpm build).');
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as Parameters<typeof registeredWebParts>[0];
for (const { family, part, className } of registeredWebParts(manifest)) {
    const name = `${family}.${part}`;
    if (!coreEnumOf(enumIndex, family, part, 'DataAttributes') && !NO_STATE_ATTRIBUTES.web.has(name)) {
        missingEnums.add(`web:${name} (${className})`);
    }
}
if (missingEnums.size > 0) {
    throw new Error(
        `api-docs: missing core data-attribute enums:\n${[...missingEnums]
            .sort()
            .map((name) => `  ${name}`)
            .join('\n')}\nAdd the enum or its explicit alias; only stateless parts belong in NO_STATE_ATTRIBUTES.`
    );
}

const api: Record<string, Family> = {};
for (const name of kitFamilies) {
    const entry = entryOf(name);
    const recipe = recipes[camel(name)] ?? recipes[`${camel(name)}Recipe`];
    api[name] = {
        name,
        kebab: kebab(name),
        parts: entry ? (reactParts.get(entry) ?? []) : [],
        variants: variantsOf(recipe),
        cssHooks: cssHooks(kebab(name))
    };
}

writeFileSync(join(root, 'tools/storybook/api.json'), `${JSON.stringify(api, null, 1)}\n`);
// Every enum of the core machines (`CheckboxRootDataAttributes` → its attributes): the web components document theirs
// from here too.
const coreEnumTexts = Object.fromEntries([...coreEnums.keys()].sort().map((name) => [name, enumMembers(name)]));
writeFileSync(join(root, 'tools/storybook/core-enums.json'), `${JSON.stringify(coreEnumTexts, null, 1)}\n`);
const parts = Object.values(api).reduce((count, family) => count + family.parts.length, 0);
console.log(`api-docs: ${Object.keys(api).length} families, ${parts} parts → tools/storybook/api.json`);
