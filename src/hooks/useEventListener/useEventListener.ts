import React from 'react';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = any>(
    type: K,
    listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
): React.RefCallback<T | null> {
    const previousListener = React.useRef<Function | null>(null);
    const previousNode = React.useRef<T | null>(null);

    const callbackRef: React.RefCallback<T | null> = React.useCallback(
        (node) => {
            if (!node) {
                return;
            }

            if (previousNode.current && previousListener.current) {
                previousNode.current.removeEventListener(type, previousListener.current as any, options);
            }

            node.addEventListener(type, listener as any, options);
            previousNode.current = node;
            previousListener.current = listener;
        },
        [type, listener, options]
    );

    useIsoLayoutEffect(
        () => () => {
            if (previousNode.current && previousListener.current) {
                previousNode.current.removeEventListener(type, previousListener.current as any, options);
            }
        },
        [type, options]
    );

    return callbackRef;
}
