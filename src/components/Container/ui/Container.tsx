import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractContainerLayoutProps } from '~@lib/layouts';

import type { ContainerLayoutProps } from '~@lib/types';

/**
 * Container — a centered max-width wrapper, inspired by MUI Container and Radix Container.
 *
 * Sizes (max-width):
 * - xs  → 480px
 * - sm  → 640px
 * - md  → 768px
 * - lg  → 1024px  (default)
 * - xl  → 1280px
 * - 2xl → 1536px
 * - full → 100%
 *
 * @example
 * <Container size="lg" px="1rem">
 *   <h1>Page</h1>
 * </Container>
 *
 * @example
 * // Left-aligned container (e.g. article text column)
 * <Container size="md" align="left">
 *   <p>Content</p>
 * </Container>
 */
export function Container<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Container.Props<ElementType>
) {
    const { as: Tag = 'div', ref, ...restProps } = props;

    const { style, otherProps } = extractContainerLayoutProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type ContainerComponentProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & ContainerLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Container {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = ContainerComponentProps<ElementType>;
}
