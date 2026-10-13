import React from 'react';

import { CompositeRootMachine } from '@flippo-software/core-components/composite';
import { useMergedRef } from '@flippo-software/react-hooks';

import { toReactProps, useMachine, useTracker } from '~@lib/core';

import type { TextDirection } from '~@lib/hooks';
import type { HTMLProps } from '~@lib/types';

import type { Dimensions, ModifierKey } from '../composite';
import type { CompositeMetadata } from '../list/CompositeList';

export type UseCompositeRootParameters = {
    orientation?: 'horizontal' | 'vertical' | 'both';
    cols?: number;
    loopFocus?: boolean;
    highlightedIndex?: number;
    onHighlightedIndexChange?: (index: number) => void;
    dense?: boolean;
    direction: TextDirection;
    itemSizes?: Array<Dimensions>;
    rootRef?: React.Ref<Element>;
    /**
     * When `true`, pressing the Home key moves focus to the first item,
     * and pressing the End key moves focus to the last item.
     * @default false
     */
    enableHomeAndEndKeys?: boolean;
    /**
     * When `true`, keypress events on Composite's navigation keys
     * be stopped with event.stopPropagation()
     * @default false
     */
    stopEventPropagation?: boolean;
    /**
     * Array of item indices to be considered disabled.
     * Used for composite items that are focusable when disabled.
     */
    disabledIndices?: number[];
    /**
     * Array of [modifier key values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#modifier_keys) that should allow normal keyboard actions
     * when pressed. By default, all modifier keys prevent normal actions.
     * @default []
     */
    modifierKeys?: ModifierKey[];
};

/**
 * Roving tab index and arrow-key navigation of a composite widget, driven by the core
 * `CompositeRootMachine`. Pass `elementsRef` and `onMapChange` to the `CompositeList` of the items
 * (or give it `registry`).
 */
export function useCompositeRoot(params: UseCompositeRootParameters & { highlightItemOnHover?: boolean }) {
    const {
        itemSizes,
        cols = 1,
        loopFocus = true,
        dense = false,
        orientation = 'both',
        direction,
        highlightedIndex,
        onHighlightedIndexChange,
        rootRef: externalRef,
        enableHomeAndEndKeys = false,
        stopEventPropagation = false,
        disabledIndices,
        modifierKeys,
        highlightItemOnHover = false
    } = params;

    const composite = useMachine((options) => new CompositeRootMachine(options), {
        itemSizes,
        cols,
        loopFocus,
        dense,
        orientation,
        direction,
        highlightedIndex,
        onHighlightedIndexChange,
        enableHomeAndEndKeys,
        stopEventPropagation,
        disabledIndices,
        modifierKeys,
        highlightItemOnHover
    });
    const track = useTracker();

    const ref = useMergedRef(composite.setRoot, externalRef);

    // The core handler reads only members React's synthetic event shares with the DOM one.
    const relayKeyboardEvent = React.useCallback(
        (event: React.KeyboardEvent<any>) => composite.relayKeyboardEvent(event as unknown as KeyboardEvent),
        [composite]
    );

    const props: HTMLProps = { ...track(() => toReactProps(composite.getRootProps())), ref } as HTMLProps;

    return {
        props,
        composite,
        registry: composite.registry,
        highlightedIndex: track(() => composite.highlightedIndex),
        onHighlightedIndexChange: composite.onHighlightedIndexChange,
        elementsRef: composite.elementsRef as React.RefObject<Array<HTMLElement | null>>,
        onMapChange: composite.onMapChange as (map: Map<Element, CompositeMetadata<any> | null>) => void,
        relayKeyboardEvent
    };
}
