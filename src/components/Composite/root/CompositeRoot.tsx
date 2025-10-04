'use client';

import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks';

import { EMPTY_ARRAY, EMPTY_OBJECT } from '@lib/constants';
import { useDirection, useRenderElement } from '@lib/hooks';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { CompositeList } from '../list/CompositeList';

import type { Dimensions, ModifierKey } from '../composite';
import type { CompositeMetadata } from '../list/CompositeList';

import { CompositeRootContext } from './CompositeRootContext';
import { useCompositeRoot } from './useCompositeRoot';

import type { TCompositeRootContext } from './CompositeRootContext';

/**
 * @internal
 */
export function CompositeRoot<Metadata extends object, State extends Record<string, any>>(
    componentProps: CompositeRoot.Props<Metadata, State>
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        refs = EMPTY_ARRAY,
        props = EMPTY_ARRAY,
        state = EMPTY_OBJECT as State,
        customStyleHookMapping,
        highlightedIndex: highlightedIndexProp,
        onHighlightedIndexChange: onHighlightedIndexChangeProp,
        orientation,
        dense,
        itemSizes,
        loop,
        cols,
        enableHomeAndEndKeys,
        onMapChange: onMapChangeProp,
        stopEventPropagation,
        rootRef,
        disabledIndices,
        modifierKeys,
        highlightItemOnHover = false,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    const {
        props: defaultProps,
        highlightedIndex,
        onHighlightedIndexChange,
        elementsRef,
        onMapChange: onMapChangeUnwrapped
    } = useCompositeRoot({
        itemSizes,
        cols,
        loop,
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

    const onMapChange = useEventCallback(
        (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => {
            onMapChangeProp?.(newMap);
            onMapChangeUnwrapped(newMap);
        }
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: refs,
        props: [defaultProps, ...props, elementProps],
        customStyleHookMapping
    });

    const contextValue: TCompositeRootContext = React.useMemo(
        () => ({ highlightedIndex, onHighlightedIndexChange, highlightItemOnHover }),
        [highlightedIndex, onHighlightedIndexChange, highlightItemOnHover]
    );

    return (
        <CompositeRootContext value={contextValue}>
            <CompositeList<Metadata> elementsRef={elementsRef} onMapChange={onMapChange}>
                {element}
            </CompositeList>
        </CompositeRootContext>
    );
}

export namespace CompositeRoot {
    export type Props<Metadata, State extends Record<string, any>> = {
        props?: Array<Record<string, any> | (() => Record<string, any>)>;
        state?: State;
        customStyleHookMapping?: CustomStyleHookMapping<State>;
        refs?: (React.Ref<HTMLElement | null> | undefined)[];
        tag?: keyof React.JSX.IntrinsicElements;
        orientation?: 'horizontal' | 'vertical' | 'both';
        cols?: number;
        loop?: boolean;
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
}
