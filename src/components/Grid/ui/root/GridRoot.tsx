import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractGridLayoutProps } from '~@lib/layouts';

import type { GridLayoutProps } from '~@lib/types';

/**
 * Grid — CSS grid container with MUI/Radix-inspired API.
 *
 * @example
 * // Numeric columns → repeat(N, 1fr)
 * <Grid columns={12} spacing={4} gap="16px">
 *   <Grid.Item colSpan={6}>left</Grid.Item>
 *   <Grid.Item colSpan={6}>right</Grid.Item>
 * </Grid>
 *
 * @example
 * // Raw CSS template
 * <Grid columns="1fr 2fr 1fr" gap="1rem">...</Grid>
 *
 * @example
 * // spacing uses design-system scale: spacing={2} → var(--f-spacing-2)
 * <Grid columns={3} spacing={2}>...</Grid>
 */
export function GridRoot<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Grid.Props<ElementType>
) {
    const { as: Tag = 'div', ref, ...restProps } = props;

    const { style, otherProps } = extractGridLayoutProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type GridComponentProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & GridLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Grid {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = GridComponentProps<ElementType>;
}
