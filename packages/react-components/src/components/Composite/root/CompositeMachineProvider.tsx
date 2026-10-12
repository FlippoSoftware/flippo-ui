import React from 'react';

import type { CompositeRootMachine } from '@flippo-software/core-components/composite';

import { useTracker } from '~@lib/core';

import { CompositeList } from '../list/CompositeList';

import { CompositeRootContext } from './CompositeRootContext';

import type { CompositeRootContextValue } from './CompositeRootContext';

export type CompositeMachineProviderProps = {
    /**
     * The composite of a component machine (a toolbar's, a tab list's…).
     */
    composite: CompositeRootMachine;
    highlightItemOnHover?: boolean;
    children: React.ReactNode;
};

/**
 * Provides the composite contexts from the composite of a core machine, so `CompositeItem`s below
 * (including those of nested components) register in its list and use its roving tab index.
 */
export function CompositeMachineProvider(props: CompositeMachineProviderProps) {
    const { composite, highlightItemOnHover = false, children } = props;
    const track = useTracker();

    const highlightedIndex = track(() => composite.highlightedIndex);

    const relayKeyboardEvent = React.useCallback(
        (event: React.KeyboardEvent<any>) => composite.relayKeyboardEvent(event as unknown as KeyboardEvent),
        [composite]
    );

    const contextValue: CompositeRootContextValue = React.useMemo(
        () => ({
            highlightedIndex,
            onHighlightedIndexChange: composite.onHighlightedIndexChange,
            highlightItemOnHover,
            relayKeyboardEvent
        }),
        [highlightedIndex, composite, highlightItemOnHover, relayKeyboardEvent]
    );

    return (
        <CompositeRootContext.Provider value={contextValue}>
            <CompositeList
                registry={composite.registry as never}
                elementsRef={composite.elementsRef as React.RefObject<Array<HTMLElement | null>>}
            >
                {children}
            </CompositeList>
        </CompositeRootContext.Provider>
    );
}
