import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

const state = {
    slot: 'strong'
};

/**
 * Strong — semantic importance wrapper. Renders `<strong>` by default (bold in most browsers).
 * Inherits all parent text styles; adds no visual styling of its own.
 *
 * @example
 * <Text>Please <Strong>do not</Strong> close this window.</Text>
 */
export function Strong(props: Strong.Props) {
    const { as: Tag = 'strong', ref, ...otherProps } = props;

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: otherProps,
        state
    });

    return element;
}

export namespace Strong {
    export type Props<ElementType extends React.ElementType = 'strong'> = PolymorphicComponentPropsWithRef<ElementType>;
}
