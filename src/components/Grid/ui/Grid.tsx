import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractGridLayoutProps } from '~@lib/layouts';

import type { GridLayoutProps } from '~@lib/types';

/**
 * Grid - A CSS grid container component.
 * Supports all grid props, grid child props, and layout props (margin, padding, sizing, position).
 */
export function Grid<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
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
