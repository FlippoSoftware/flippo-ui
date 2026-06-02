import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';
import { extractBoxProps } from '~@lib/layouts';

import type { BoxProps } from '~@lib/types';

/**
 * Grid.Item — explicit grid child with ergonomic colSpan / rowSpan props.
 *
 * @example
 * <Grid columns={12} spacing={3}>
 *   <Grid.Item colSpan={8}>main content</Grid.Item>
 *   <Grid.Item colSpan={4}>sidebar</Grid.Item>
 *   <Grid.Item colSpan={12}>footer</Grid.Item>
 * </Grid>
 */
export function GridItem<ElementType extends keyof React.JSX.IntrinsicElements = 'div'>(
    props: GridItem.Props<ElementType>
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

export namespace GridItem {
    export type Props<ElementType extends keyof React.JSX.IntrinsicElements = 'div'> = React.PropsWithChildren<React.ComponentPropsWithRef<ElementType>>
      & BoxProps
      & {
          /** HTML element to render */
          as?: ElementType;
      };
}
