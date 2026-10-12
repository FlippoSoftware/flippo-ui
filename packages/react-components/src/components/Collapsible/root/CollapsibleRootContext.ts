import React from 'react';

import type { CollapsibleMachine } from '@flippo-software/core-components/collapsible';

import { useStoreState } from '~@lib/core';

import type { CollapsibleRoot } from './CollapsibleRoot';

export type CollapsibleRootContextValue = {
    /**
     * The core machine (also an Accordion item's collapsible).
     */
    collapsible: CollapsibleMachine;
    state: CollapsibleRoot.State;
};

export const CollapsibleRootContext = React.createContext<CollapsibleRootContextValue | undefined>(undefined);

export function useCollapsibleRootContext() {
    const context = React.use(CollapsibleRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: CollapsibleRootContext is missing. Collapsible parts must be placed within <Collapsible.Root>.');
    }

    return context;
}

/**
 * Context value of a collapsible machine: a new object whenever its stores change, so the parts follow it.
 */
export function useCollapsibleContextValue(collapsible: CollapsibleMachine): CollapsibleRootContextValue {
    const internalState = useStoreState(collapsible.store);
    const transitionState = useStoreState(collapsible.transitions.store);
    const state = collapsible.getState();
    const { open, disabled, transitionStatus } = state;
    // biome-ignore lint/correctness/useExhaustiveDependencies: a new value when the stores change; the parts read the machine.
    return React.useMemo(
        () => ({ collapsible, state: { open, disabled, transitionStatus } }),
        [collapsible, internalState, transitionState, open, disabled, transitionStatus]
    );
}
