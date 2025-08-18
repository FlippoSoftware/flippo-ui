'use client';

import React from 'react';

import type { TransitionStatus } from '@flippo_ui/hooks';

import type { CollapsibleRoot } from './CollapsibleRoot';
import type { useCollapsibleRoot } from './useCollapsibleRoot';

export type TCollapsibleRootContext = {
    onOpenChange: (open: boolean) => void;
    state: CollapsibleRoot.State;
    transitionStatus: TransitionStatus;
} & useCollapsibleRoot.ReturnValue;

export const CollapsibleRootContext = React.createContext<TCollapsibleRootContext | undefined>(
    undefined
);

export function useCollapsibleRootContext() {
    const context = React.use(CollapsibleRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: CollapsibleRootContext is missing. Collapsible parts must be placed within <Collapsible.Root>.'
        );
    }

    return context;
}
