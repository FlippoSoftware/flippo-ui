import React from 'react';

import type { CompositeMetadata } from './CompositeList';

export type CompositeListContextValue<Metadata> = {
    register: (node: Element, metadata: Metadata | null | undefined) => void;
    unregister: (node: Element) => void;
    subscribeMapChange: (fn: (map: Map<Element, CompositeMetadata<Metadata> | null>) => void) => () => void;
    elementsRef: React.RefObject<Array<HTMLElement | null>>;
    labelsRef?: React.RefObject<Array<string | null>>;
    nextIndexRef: React.RefObject<number>;
};

export function createCompositeListContext<Metadata>() {
    const CompositeListContext = React.createContext<CompositeListContextValue<Metadata>>({
        register: () => {},
        unregister: () => {},
        subscribeMapChange: () => {
            return () => {};
        },
        elementsRef: { current: [] },
        nextIndexRef: { current: 0 }
    });

    function useCompositeListContext() {
        return React.use(CompositeListContext);
    }

    return {
        CompositeListContext,
        useCompositeListContext
    } as const;
}

export const { CompositeListContext, useCompositeListContext } = createCompositeListContext<CompositeMetadata<any>>();
