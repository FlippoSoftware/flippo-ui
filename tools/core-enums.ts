type Adapter = 'react' | 'web';
type Suffix = 'DataAttributes' | 'CssVars';

const pascal = (name: string) =>
    name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()).replace(/^\w/, (letter) => letter.toUpperCase());

/** Parts that use another part's state contract. Keep these explicit: a missing enum must not silently match a parent. */
const STATE_ENUM_OF: Record<string, string> = {
    CheckboxCardIndicator: 'CheckboxCardRoot',
    ComboboxIcon: 'SelectIcon',
    ContextMenuTrigger: 'CommonTrigger',
    FieldItem: 'FieldRoot',
    FieldsetLegend: 'FieldsetRoot',
    Input: 'FieldControl',
    // biome-ignore lint/security/noSecrets: the name of a core enum, not a secret.
    MenuItemIndicator: 'MenuCheckboxItemIndicator',
    NavigationMenuIcon: 'SelectIcon',
    RadioCardIndicator: 'RadioCardRoot',
    ScrollAreaContent: 'ScrollAreaRoot',
    SelectItemIndicator: 'ComboboxItemIndicator',
    Textarea: 'FieldControl'
};

const ADAPTER_STATE_ENUM_OF: Record<Adapter, Record<string, string>> = {
    react: { ComboboxChip: 'Button', ComboboxChipRemove: 'Button' },
    web: {
        ComboboxItemIndicator: 'ComboboxItemIndicatorWeb',
        NavigationMenuRoot: 'NavigationMenuRootWeb',
        ScrollAreaCorner: 'ScrollAreaRoot'
    }
};

/**
 * One enum resolution rule for the generator, Storybook and site. React can supply the exported function's name
 * (Autocomplete.Input is ComboboxInput); web registrations use the family and part names from their manifest.
 */
export function coreEnumOf(
    enums: Readonly<Record<string, unknown>>,
    family: string,
    part: string,
    suffix: Suffix,
    { adapter = 'web', componentName }: { adapter?: Adapter; componentName?: string } = {}
): string | undefined {
    const base = componentName ?? `${pascal(family)}${pascal(part)}`;
    const candidates = [base];
    if (base.endsWith('Root')) candidates.push(base.slice(0, -4));
    if (base.startsWith('Autocomplete')) candidates.push(base.replace(/^Autocomplete/, 'Combobox'));
    if (base.startsWith('ContextMenu') && base !== 'ContextMenuTrigger') candidates.push(base.replace(/^ContextMenu/, 'Menu'));
    for (const candidate of candidates) {
        const resolved =
            suffix === 'DataAttributes' ? (ADAPTER_STATE_ENUM_OF[adapter][candidate] ?? STATE_ENUM_OF[candidate] ?? candidate) : candidate;
        const name = `${resolved}${suffix}`;
        if (Object.hasOwn(enums, name)) return name;
    }
    return undefined;
}

export type RegisteredPart = { family: string; part: string; className: string };

/** Read the same registered elements in all consumers; a missing or unsupported declaration is a build error. */
export function registeredWebParts(manifest: {
    modules: { path: string; declarations?: { name: string; default?: string }[] }[];
}): RegisteredPart[] {
    const parts: RegisteredPart[] = [];
    for (const module of manifest.modules) {
        const family = module.path.match(/^src\/components\/([\w-]+)\/index\.ts$/)?.[1];
        const elements = module.declarations?.find((declaration) => declaration.name === 'elements');
        if (!family || !elements) continue;
        const value = elements.default?.trim() ?? '';
        if (value.startsWith('{') && !/^\{\s*(?:\w+\s*:\s*\w+\s*,\s*)*\w+\s*:\s*\w+\s*,?\s*\}$/.test(value)) {
            throw new Error(`api-docs: cannot read registered elements of ${family}.`);
        }
        const entries = value.startsWith('{')
            ? [...value.matchAll(/(\w+):\s*(\w+)/g)].map(([, part, className]) => {
                  if (!part || !className) throw new Error(`api-docs: invalid registration in ${family}.`);
                  return { family, part, className };
              })
            : /^\w+$/.test(value)
              ? [{ family, part: 'root', className: value }]
              : [];
        if (entries.length === 0) throw new Error(`api-docs: cannot read registered elements of ${family}.`);
        parts.push(...entries);
    }
    return parts;
}
