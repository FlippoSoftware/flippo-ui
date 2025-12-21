import React from 'react';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '~@lib/constants';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeList } from '../list/CompositeList';

import type { Dimensions, ModifierKey } from '../composite';
import type { CompositeListProps, CompositeMetadata } from '../list/CompositeList';

import { CompositeRootContext } from './CompositeRootContext';
import { useCompositeRoot } from './useCompositeRoot';

import type { CompositeRootContextValue } from './CompositeRootContext';

/**
 * @internal
 */
export type CreateCompositeRootParameters<BaseMetadata extends {}> = {
    CompositeRootContext: React.Context<CompositeRootContextValue | undefined>;
    CompositeList: <T extends BaseMetadata>(
        props: CompositeListProps<T>
    ) => React.ReactElement | null;
};

export function createCompositeRoot<CreateMetadata extends {}>(params: CreateCompositeRootParameters<CreateMetadata>) {
    const { CompositeRootContext, CompositeList } = params;

    return function CompositeRoot<Metadata extends CreateMetadata, State extends Record<string, any>>(
        componentProps: CompositeRoot.Props<Metadata, State>
    ) {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
            /* eslint-enable unused-imports/no-unused-vars */
            refs = EMPTY_ARRAY,
            props = EMPTY_ARRAY,
            state = EMPTY_OBJECT as State,
            stateAttributesMapping,
            highlightedIndex: highlightedIndexProp,
            onHighlightedIndexChange: onHighlightedIndexChangeProp,
            orientation,
            dense,
            itemSizes,
            loopFocus,
            cols,
            enableHomeAndEndKeys,
            onMapChange: onMapChangeProp,
            stopEventPropagation = true,
            rootRef,
            disabledIndices,
            modifierKeys,
            highlightItemOnHover = false,
            tag = 'div',
            ...elementProps
        } = componentProps;

        const direction = useDirection();

        const {
            props: defaultProps,
            highlightedIndex,
            onHighlightedIndexChange,
            elementsRef,
            onMapChange: onMapChangeUnwrapped,
            relayKeyboardEvent
        } = useCompositeRoot({
            itemSizes,
            cols,
            loopFocus,
            dense,
            orientation,
            highlightedIndex: highlightedIndexProp,
            onHighlightedIndexChange: onHighlightedIndexChangeProp,
            rootRef,
            stopEventPropagation,
            enableHomeAndEndKeys,
            direction,
            disabledIndices,
            modifierKeys
        });

        const element = useRenderElement(tag, componentProps, {
            state,
            ref: refs,
            props: [defaultProps, ...props, elementProps],
            customStyleHookMapping: stateAttributesMapping
        });

        const contextValue: CompositeRootContextValue = React.useMemo(
            () => ({
                highlightedIndex,
                onHighlightedIndexChange,
                highlightItemOnHover,
                relayKeyboardEvent
            }),
            [highlightedIndex, onHighlightedIndexChange, highlightItemOnHover, relayKeyboardEvent]
        );

        return (
            <CompositeRootContext.Provider value={contextValue}>
                <CompositeList<Metadata>
                    elementsRef={elementsRef}
                    onMapChange={(newMap) => {
                        onMapChangeProp?.(newMap);
                        onMapChangeUnwrapped(newMap);
                    }}
                >
                    {element}
                </CompositeList>
            </CompositeRootContext.Provider>
        );
    };
}

export const CompositeRoot = createCompositeRoot<CompositeMetadata<any>>({
    CompositeRootContext,
    CompositeList
});

export type CompositeRootProps<Metadata, State extends Record<string, any>> = {
    props?: Array<Record<string, any> | (() => Record<string, any>)>;
    state?: State;
    stateAttributesMapping?: StateAttributesMapping<State>;
    refs?: (React.Ref<Element> | undefined)[];
    tag?: keyof React.JSX.IntrinsicElements;
    orientation?: 'horizontal' | 'vertical' | 'both';
    cols?: number;
    loopFocus?: boolean;
    highlightedIndex?: number;
    onHighlightedIndexChange?: (index: number) => void;
    itemSizes?: Dimensions[];
    dense?: boolean;
    enableHomeAndEndKeys?: boolean;
    onMapChange?: (newMap: Map<Node, CompositeMetadata<Metadata> | null>) => void;
    stopEventPropagation?: boolean;
    rootRef?: React.RefObject<HTMLElement | null>;
    disabledIndices?: number[];
    modifierKeys?: ModifierKey[];
    highlightItemOnHover?: boolean;
} & Pick<HeadlessUIComponentProps<'div', State>, 'render' | 'className' | 'children'>;

// eslint-disable-next-line ts/no-redeclare
export namespace CompositeRoot {
    export type Props<Metadata, State extends Record<string, any>> = CompositeRootProps<
        Metadata,
        State
    >;
}
