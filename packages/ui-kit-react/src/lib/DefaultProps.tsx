'use client';
import * as React from 'react';

import type * as Kit from '~@src';

import type { StyledPart } from './Styled';

/**
 * Default props of the families, by family (`button`, `select`, `navigationMenu`): the family's own props (its root,
 * or the component itself) and, under a part's name, the props of that part.
 *
 * @example { button: { size: 'small' }, select: { size: 'small', positioner: { sideOffset: 4 } } }
 */
export type DefaultPropsConfig = Readonly<Record<string, Readonly<Record<string, unknown>> | undefined>>;

type PropsOf<C> = C extends (props: infer P) => unknown ? Partial<P> : never;

/** The styled parts of a family namespace other than its root, by their key (`Positioner` → `positioner`). */
type PartsOf<Family> = {
    [Part in keyof Family as Part extends 'Root' ? never : Family[Part] extends StyledPart ? Uncapitalize<Part & string> : never]?: PropsOf<
        Family[Part]
    >;
};

type FamilyDefaults<Family> = Family extends { Root: infer Root } ? PropsOf<Root> & PartsOf<Family> : PropsOf<Family>;

/** The keys of an object's styled parts. */
type StyledKeys<Value> = { [Key in keyof Value]: Value[Key] extends StyledPart ? Key : never }[keyof Value];

/** Families of the kit: exports with styled parts, and the components that wrap a styled one. */
type IsFamily<Name, Value> = Name extends 'Button' | 'SkeletonText'
    ? true
    : Value extends StyledPart
      ? true
      : [StyledKeys<Value>] extends [never]
        ? false
        : true;

/**
 * Default props of the kit, typed from its families: `{ button?: ButtonProps; select?: SelectRootProps & { positioner?:
 * SelectPositionerProps; … } }`.
 */
export type DefaultProps = {
    [Name in keyof typeof Kit as Name extends Capitalize<Name & string>
        ? IsFamily<Name, (typeof Kit)[Name]> extends true
            ? Uncapitalize<Name & string>
            : never
        : never]?: FamilyDefaults<(typeof Kit)[Name]>;
};

const EMPTY: DefaultPropsConfig = {};

const DefaultPropsContext = React.createContext<DefaultPropsConfig>(EMPTY);

/** The part names of each family: the keys of a family's config that hold a part's props, not the root's. */
const PARTS = new Map<string, Set<string>>();

export function registerPart(family: string, part: string): void {
    let parts = PARTS.get(family);
    if (!parts) {
        parts = new Set();
        PARTS.set(family, parts);
    }
    parts.add(part);
}

const familyLevel = new WeakMap<object, Record<string, unknown>>();

/** The props of a family's config for its root (or its only component): the config without the parts' entries. */
function rootProps(family: string, config: Readonly<Record<string, unknown>>): Record<string, unknown> {
    let props = familyLevel.get(config);
    if (!props) {
        const parts = PARTS.get(family);
        props = Object.fromEntries(Object.entries(config).filter(([key]) => !parts?.has(key)));
        familyLevel.set(config, props);
    }
    return props;
}

/**
 * The configured props of a part (`part`), or of the family's root or only component (no `part`), and the variants
 * configured for the whole family (the fallback of parts rendered without their root).
 */
export function useConfiguredProps(
    family: string,
    part: string | undefined
): { own: Readonly<Record<string, unknown>> | undefined; family: Readonly<Record<string, unknown>> | undefined } {
    const config = React.useContext(DefaultPropsContext)[family];
    if (!config) return { own: undefined, family: undefined };
    const level = rootProps(family, config);
    return { own: part ? (config[part] as Record<string, unknown> | undefined) : level, family: level };
}

function mergeConfigs(parent: DefaultPropsConfig, own: DefaultPropsConfig): DefaultPropsConfig {
    if (parent === EMPTY) return own;
    const merged: Record<string, Record<string, unknown>> = { ...(parent as Record<string, Record<string, unknown>>) };
    for (const [family, props] of Object.entries(own)) {
        if (!props) continue;
        const previous = merged[family];
        if (!previous) {
            merged[family] = props;
            continue;
        }
        const next: Record<string, unknown> = { ...previous, ...props };
        // Part entries merge too: `{ select: { positioner: { sideOffset } } }` keeps the parent's other positioner props.
        for (const part of PARTS.get(family) ?? []) {
            const value = props[part];
            const before = previous[part];
            if (value && before) next[part] = { ...(before as object), ...(value as object) };
        }
        merged[family] = next;
    }
    return merged;
}

/**
 * Sets default props of the kit's components for its subtree, like Gravity UI's `DefaultPropsProvider`. A prop set on
 * a component wins, then the part's own entry, then what its root passes down, then the family's entry, then the
 * kit's built-in defaults. Nested providers merge with the outer ones.
 *
 * @example
 * <DefaultPropsProvider defaults={{ button: { size: 'small' }, select: { size: 'small', positioner: { sideOffset: 4 } } }}>
 */
export function DefaultPropsProvider({ defaults, children }: { defaults: DefaultProps; children?: React.ReactNode }): React.JSX.Element {
    const parent = React.useContext(DefaultPropsContext);
    const value = React.useMemo(() => mergeConfigs(parent, defaults as DefaultPropsConfig), [parent, defaults]);
    return <DefaultPropsContext.Provider value={value}>{children}</DefaultPropsContext.Provider>;
}
