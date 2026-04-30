import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';

import { extractContainerLayoutProps } from '~@lib/layouts';

import type { ContainerLayoutProps } from '~@lib/types';

/**
 * Container - A centered container with max-width.
 * Use for constraining content width and centering it on the page.
 *
 * @example
 * <Container size="lg" px={16}>
 *   <h1>Page Title</h1>
 *   <p>Content constrained to max-width...</p>
 * </Container>
 *
 * @example
 * // Sizes: 'sm' (640px), 'md' (768px), 'lg' (1024px), 'xl' (1280px), 'full' (100%)
 * <Container size="xl">Wide content</Container>
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
