import React from 'react';

import type { CompositeMetadata } from '../../Composite';
import type { SnippetLine } from '../line/SnippetLine';

export type SnippetRootContextValue = {
    symbol: string | React.ReactNode;
    disableCopy: boolean;
    metadataMapRef: React.RefObject<Map<Element, CompositeMetadata<SnippetLine.Metadata> | null>>;
};

export const SnippetRootContext = React.createContext<SnippetRootContextValue | undefined>(undefined);

export function useSnippetRootContext() {
    const context = React.use(SnippetRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: SnippetRootContext is missing. Snippet parts must be placed within <Snippet.Root>.'
        );
    }

    return context;
}
