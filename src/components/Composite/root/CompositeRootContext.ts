import React from 'react';

export type CompositeRootContextValue = {
    highlightedIndex: number;
    onHighlightedIndexChange: (index: number, shouldScrollIntoView?: boolean) => void;
    highlightItemOnHover: boolean;
};

export const CompositeRootContext = React.createContext<CompositeRootContextValue | undefined>(
    undefined
);

export function useCompositeRootContext(optional: true): CompositeRootContextValue | undefined;
export function useCompositeRootContext(optional?: false): CompositeRootContextValue;
export function useCompositeRootContext(optional = false) {
    const context = React.use(CompositeRootContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>.'
        );
    }

    return context;
}
