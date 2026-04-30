import React from 'react';

export type CompositeRootContextValue = {
    highlightedIndex: number;
    onHighlightedIndexChange: (index: number, shouldScrollIntoView?: boolean) => void;
    highlightItemOnHover: boolean;
    /**
     * Makes it possible to control composite components using events that don't originate from their children.
     * For example, a Menubar with detached triggers may define its Menu.Root outside of CompositeRoot.
     * Keyboard events that occur within this menu won't normally be captured by the CompositeRoot,
     * so they need to be forwarded manually using this function.
     */
    relayKeyboardEvent: (event: React.KeyboardEvent<any>) => void;
};

export function createCompositeRootContext() {
    const CompositeRootContext = React.createContext<CompositeRootContextValue | undefined>(
        undefined
    );

    function useCompositeRootContext(optional: true): CompositeRootContextValue | undefined;
    function useCompositeRootContext(optional?: false): CompositeRootContextValue;
    function useCompositeRootContext(optional = false) {
        const context = React.use(CompositeRootContext);

        if (context === undefined && !optional) {
            throw new Error(
                'Headless UI: CompositeRootContext is missing. Composite parts must be placed within <Composite.Root>.'
            );
        }

        return context;
    }

    return {
        CompositeRootContext,
        useCompositeRootContext
    } as const;
}

export const { CompositeRootContext, useCompositeRootContext } = createCompositeRootContext();
