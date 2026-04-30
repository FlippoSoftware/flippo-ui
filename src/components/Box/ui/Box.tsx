import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractBoxProps } from '~@lib/layouts';

import type { BoxProps as BoxLayoutProps } from '~@lib/types';

/**
 * Box - A fundamental layout building block.
 * Supports all layout props: margin, padding, sizing, position, overflow,
 * and can act as a flex/grid child.
 */
export function Box<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Box.Props<ElementType>
) {
    const { as: Tag = 'div', ref, ...restProps } = props;

    const { style, otherProps } = extractBoxProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type BoxComponentProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & BoxLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Box {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = BoxComponentProps<ElementType>;
}
