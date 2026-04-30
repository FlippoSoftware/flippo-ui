import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractFlexLayoutProps } from '~@lib/layouts';

import type { FlexLayoutProps } from '~@lib/types';

/**
 * Flex - A flexbox container component.
 * Supports all flex props, flex child props, and layout props (margin, padding, sizing, position).
 */
export function Flex<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Flex.Props<ElementType>
) {
    const { as: Tag = 'div', ref, ...restProps } = props;

    const { style, otherProps } = extractFlexLayoutProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type FlexProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & FlexLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Flex {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = FlexProps<ElementType>;
}
