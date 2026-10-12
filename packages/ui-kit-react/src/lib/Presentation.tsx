'use client';
import * as React from 'react';

import { extractPresentationProps } from '@flippo-software/component-styles/layouts';

import type {
    BoxProps,
    ContainerLayoutProps,
    FlexLayoutProps,
    GridLayoutProps,
    SectionLayoutProps
} from '@flippo-software/component-styles/layouts';

import { registerPart, useConfiguredProps } from './DefaultProps';

import type { Recipe, RecipeVariants, StyledPart } from './Styled';

type Layout = BoxProps & FlexLayoutProps & GridLayoutProps;
type LayoutFor<K> = K extends 'container' ? ContainerLayoutProps : K extends 'section' ? SectionLayoutProps : Layout;
export type PresentationProps<E extends React.ElementType, V, K> = Omit<
    React.ComponentPropsWithRef<E>,
    keyof V | keyof LayoutFor<K> | 'as'
> &
    V &
    LayoutFor<K> & { as?: E };

export type Presentation<Tag extends React.ElementType, R extends Recipe, K extends string> = (<E extends React.ElementType = Tag>(
    props: PresentationProps<E, RecipeVariants<R>, K>
) => React.ReactElement) &
    StyledPart;

/** The props with the configured ones where a prop is not set (absent or `undefined`). */
function withConfigured(props: Record<string, unknown>, configured: Readonly<Record<string, unknown>> | undefined) {
    const result = { ...props };
    for (const key in configured) {
        if (result[key] === undefined) result[key] = configured[key];
    }
    return result;
}

/**
 * A presentation component of a family (`family`: its key in the default props). The `root` slot (or none) takes the
 * family's own entry, another slot its entry under the slot's name.
 */
export function presentation<Tag extends React.ElementType, R extends Recipe, K extends string>(
    tag: Tag,
    recipe: R,
    slot: string | undefined,
    kind: K,
    family: string
): Presentation<Tag, R, K> {
    const part = slot === undefined || slot === 'root' ? undefined : slot;
    if (part) registerPart(family, part);
    function Presentation<E extends React.ElementType = Tag>(props: PresentationProps<E, RecipeVariants<R>, K>) {
        const configured = useConfiguredProps(family, part);
        const { as: Component = tag, ...rest } = props as Record<string, unknown>;
        const selected: Record<string, unknown> = {};
        const forwarded = withConfigured(rest, configured.own);
        for (const key of recipe.variantKeys) {
            if (forwarded[key] !== undefined) selected[key] = forwarded[key];
            // Container and Section also consume size during layout prop extraction.
            if (!((kind === 'container' || kind === 'section') && key === 'size')) delete forwarded[key];
        }
        const { style, otherProps } = extractPresentationProps(kind, forwarded);
        const classes = recipe(selected as never);
        return React.createElement(Component as React.ElementType, {
            ...otherProps,
            style,
            className: [typeof classes === 'string' ? classes : classes[slot ?? 'root'], forwarded.className].filter(Boolean).join(' ')
        });
    }
    return Presentation as Presentation<Tag, R, K>;
}
