import React from 'react';

import type { SnippetMachine } from '@flippo-software/core-components/snippet';

export type SnippetRootContextValue = {
    snippet: SnippetMachine;
    symbol: string | React.ReactNode;
    disableCopy: boolean;
};

export const SnippetRootContext = React.createContext<SnippetRootContextValue | undefined>(undefined);

export function useSnippetRootContext() {
    const context = React.use(SnippetRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: SnippetRootContext is missing. Snippet parts must be placed within <Snippet.Root>.');
    }

    return context;
}
