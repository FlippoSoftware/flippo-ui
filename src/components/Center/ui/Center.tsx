import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractCenterLayoutProps } from '~@lib/layouts';

import type { CenterLayoutProps } from '~@lib/types';

/**
 * Center - A flexbox container that centers its children both horizontally and vertically.
 * Use for centering single elements or small groups of content.
 *
 * @example
 * <Center height="100vh">
 *   <Spinner />
 * </Center>
 *
 * @example
 * <Center minHeight={200} p={16}>
 *   <Text>Centered text</Text>
 * </Center>
 */
export function Center<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: Center.Props<ElementType>
) {
    const { as: Tag = 'div', ref, ...restProps } = props;

    const { style, otherProps } = extractCenterLayoutProps(restProps);

    const element = useRender({
        defaultTagName: Tag,
        ref: ref as React.Ref<Element>,
        props: [{ style }, otherProps]
    });

    return element;
}

export type CenterComponentProps<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>
  = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
    & CenterLayoutProps
    & {
        /** HTML element to render */
        as?: ElementType;
    };

export namespace Center {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = CenterComponentProps<ElementType>;
}
