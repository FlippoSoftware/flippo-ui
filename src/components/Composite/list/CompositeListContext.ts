'use client';

import React from 'react';

export type TCompositeListContext<Metadata> = {
    register: (node: Element, metadata: Metadata) => void;
    unregister: (node: Element) => void;
    subscribeMapChange: (fn: (map: Map<Element, Metadata | null>) => void) => () => void;
    elementsRef: React.RefObject<Array<HTMLElement | null>>;
    labelsRef?: React.RefObject<Array<string | null>>;
    nextIndexRef: React.RefObject<number>;
};

export const CompositeListContext = React.createContext<TCompositeListContext<any>>({
    register: () => {},
    unregister: () => {},
    subscribeMapChange: () => () => {},
    elementsRef: { current: [] },
    nextIndexRef: { current: 0 }
});

export function useCompositeListContext() {
    return React.use(CompositeListContext);
}
