import type React from 'react';

import { useRender } from '@flippo-ui/headless-components';

import type { PolymorphicComponentPropsWithRef } from '~@lib/types';

const state = {
    slot: 'code'
};

export function Code(props: Code.Props) {
    const { as: Tag = 'code', ref, ...otherProps } = props;

    const element = useRender({
        defaultTagName: Tag,
        ref,
        props: otherProps,
        state
    });

    return element;
}

export namespace Code {
    export type Props<ElementType extends React.ElementType = 'code'> = PolymorphicComponentPropsWithRef<ElementType>;
}
