import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

const state = {
    slot: 'em'
};

/**
 * Em — semantic emphasis wrapper. Renders `<em>` by default (italic in most browsers).
 * Inherits all parent text styles; add no visual styling of its own.
 *
 * @example
 * <Text>Press <Em>any key</Em> to continue.</Text>
 */
export function Em(props: Em.Props) {
    const { as: Tag = 'em', ref, ...otherProps } = props;

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: otherProps,
        state
    });

    return element;
}

export namespace Em {
    export type Props<ElementType extends React.ElementType = 'em'> = PolymorphicComponentPropsWithRef<ElementType>;
}
