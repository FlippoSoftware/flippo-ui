'use client';
import * as React from 'react';

import { focusControlOnPress } from '@flippo-software/component-styles/dom';

import { registerPart, useConfiguredProps } from './DefaultProps';

// Recipes and adapters have different generic signatures. Erasure stays inside this bridge;
// every exported part retains its inferred props (and generic roots are declared explicitly).
export type Recipe = ((props: never) => string | Record<string, string>) & { readonly variantKeys: readonly string[] };
export type RecipeVariants<R extends Recipe> = Partial<Omit<NonNullable<Parameters<R>[0]>, 'className' | 'classNames'>>;
type WithVariants<P, V> = P extends unknown ? Omit<P, keyof V> & V : never;
export type StyledProps<C extends React.ElementType, V> = WithVariants<React.ComponentPropsWithRef<C>, V>;

declare const STYLED_PART: unique symbol;
/** Marks the types of the styled parts: the default props (`DefaultProps`) are typed for them only. */
export type StyledPart = { readonly [STYLED_PART]: true };

export type StyledComponent<C extends React.ElementType, R extends Recipe> = ((
    props: StyledProps<C, RecipeVariants<R>>
) => React.ReactElement) &
    StyledPart;

function extractVariants(recipe: Recipe, forwarded: Record<string, unknown>, inherited: Readonly<Record<string, unknown>>) {
    const selected: Record<string, unknown> = {};
    for (const key of recipe.variantKeys) {
        if (inherited[key] !== undefined) selected[key] = inherited[key];
        if (forwarded[key] !== undefined) selected[key] = forwarded[key];
        // Orientation also controls keyboard behaviour in the headless adapter.
        if (key !== 'orientation') delete forwarded[key];
    }
    return selected;
}

function mergeClasses(classes: string | undefined, userClassName: unknown) {
    return typeof userClassName === 'function'
        ? (state: unknown) => [classes, userClassName(state)].filter(Boolean).join(' ')
        : [classes, userClassName].filter(Boolean).join(' ');
}

function withDefaults(props: Record<string, unknown>, defaults: Readonly<Record<string, unknown>> | undefined) {
    const result = { ...props };
    for (const key in defaults) {
        if (result[key] === undefined) result[key] = defaults[key];
    }
    return result;
}

function withControlFocus(onMouseDown: unknown) {
    return (event: React.MouseEvent<HTMLElement>) => {
        (onMouseDown as ((event: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event);
        focusControlOnPress(event.nativeEvent, event.currentTarget);
    };
}

function slotClasses(result: string | Record<string, string>, slot: string | undefined) {
    return typeof result === 'string' ? result : result[slot ?? ''];
}

export type StylerOptions = {
    /** Props the part gets unless the user passes them (`keepMounted`, `sideOffset`…). */
    defaults?: Record<string, unknown>;
    /**
     * The part keeps no classes of its own when it renders another element (`render`): a `Dialog.Close` is the
     * styled close icon, but `<Dialog.Close render={<Button />}>` is that button.
     */
    bareWhenRendered?: boolean;
    /** A press on the part (a control box) focuses the input inside it, like a press on the input itself. */
    focusControlOnPress?: boolean;
    /**
     * The part's key in the default props of its family (`DefaultPropsProvider`), when it is not the slot: the part's
     * exported name (`Input.Body` styles the `root` slot).
     */
    part?: string;
};

/**
 * The styler of a family: `family` is its key in the default props (`button`, `select`, `navigationMenu`). The root
 * (`root`) and a part without a slot take the family's own entry; other parts their entry under the slot's name.
 */
export function createStyler<R extends Recipe>(
    recipe: R,
    family: string
): <C extends React.ElementType>(Component: C, slot?: string, root?: boolean, options?: StylerOptions) => StyledComponent<C, R> {
    type Variants = RecipeVariants<R>;
    // `null` outside a root: the parts then take the variants configured for the family.
    const Context = React.createContext<Record<string, unknown> | null>(null);

    return function styled<C extends React.ElementType>(Component: C, slot?: string, root = false, options: StylerOptions = {}) {
        const { defaults, bareWhenRendered = false, focusControlOnPress: focusOnPress = false } = options;
        const part = root ? undefined : (options.part ?? slot);
        if (part) registerPart(family, part);
        function Styled(props: StyledProps<C, Variants>) {
            const inherited = React.useContext(Context);
            const configured = useConfiguredProps(family, part);
            const forwarded = withDefaults(withDefaults(props as Record<string, unknown>, configured.own), defaults);
            const selected = extractVariants(recipe, forwarded, root ? {} : (inherited ?? configured.family ?? {}));
            if (!bareWhenRendered || forwarded.render === undefined) {
                forwarded.className = mergeClasses(slotClasses(recipe(selected as never), slot), forwarded.className);
            }
            if (focusOnPress) forwarded.onMouseDown = withControlFocus(forwarded.onMouseDown);
            const element = React.createElement(Component, forwarded);
            return root ? <Context.Provider value={selected}>{element}</Context.Provider> : element;
        }
        Styled.displayName = `Styled(${typeof Component === 'string' ? Component : ((Component as { displayName?: string }).displayName ?? slot ?? 'Component')})`;
        return Styled as unknown as StyledComponent<C, R>;
    };
}
