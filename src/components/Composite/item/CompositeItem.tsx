import type React from 'react';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '~@lib/constants';
import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import type { CompositeMetadata } from '../list/CompositeList';

import { useCompositeItem } from './useCompositeItem';

import type { UseCompositeItemParameters, UseCompositeItemReturnValue } from './useCompositeItem';

export type CreateCompositeItemParameters<BaseMetadata> = {
    useCompositeItem: <T extends BaseMetadata>(params: UseCompositeItemParameters<T>) => UseCompositeItemReturnValue;
};

export function createCompositeItem<CreateMetadata>(params: CreateCompositeItemParameters<CreateMetadata>) {
    const { useCompositeItem } = params;

    return function CompositeItem<Metadata extends CreateMetadata, State extends Record<string, any>>(
        componentProps: CompositeItem.Props<Metadata, State>
    ) {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
            /* eslint-enable unused-imports/no-unused-vars */
            state = EMPTY_OBJECT as State,
            props = EMPTY_ARRAY,
            refs = EMPTY_ARRAY,
            metadata,
            stateAttributesMapping,
            tag = 'div',
            ...elementProps
        } = componentProps;

        const { compositeProps, compositeRef } = useCompositeItem({ metadata });

        return useRenderElement(tag, componentProps, {
            state,
            ref: [...refs, compositeRef],
            props: [compositeProps, ...props, elementProps],
            customStyleHookMapping: stateAttributesMapping
        });
    };
}

export const CompositeItem = createCompositeItem<CompositeMetadata<any>>({
    useCompositeItem
});

export type CompositeItemProps<Metadata, State extends Record<string, any>> = {
    children?: React.ReactNode;
    metadata?: Metadata;
    refs?: (React.Ref<HTMLElement | null> | undefined)[];
    props?: Array<Record<string, any> | (() => Record<string, any>)>;
    state?: State;
    stateAttributesMapping?: StateAttributesMapping<State>;
    tag?: keyof React.JSX.IntrinsicElements;
} & Pick<HeadlessUIComponentProps<any, State>, 'render' | 'className'>;

// eslint-disable-next-line ts/no-redeclare
export namespace CompositeItem {
    export type Props<Metadata, State extends Record<string, any>> = CompositeItemProps<
        Metadata,
        State
    >;
}
