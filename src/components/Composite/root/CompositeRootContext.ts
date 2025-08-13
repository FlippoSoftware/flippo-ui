'use client';

import React from 'react';

export type TCompositeRootContext = {
    highlightedIndex: number;
    onHighlightedIndexChange: (index: number, shouldScrollIntoView?: boolean) => void;
    highlightItemOnHover: boolean;
};

export const CompositeRootContext = React.createContext<TCompositeRootContext | undefined>(
    undefined
);

export function useCompositeRootContext(optional: true): TCompositeRootContext | undefined;
export function useCompositeRootContext(optional?: false): TCompositeRootContext;
export function useCompositeRootContext(optional = false) {
    const context = React.use(CompositeRootContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>.'
        );
    }

    return context;
}
