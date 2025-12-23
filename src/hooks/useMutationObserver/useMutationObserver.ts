import React from 'react';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

type Target<T extends HTMLElement = any> = HTMLElement | (() => HTMLElement) | React.RefObject<T> | null;

function getTargetElement<T extends HTMLElement = any>(target?: Target<T>): Node | null {
    if (typeof target === 'function') {
        return target();
    }
    if (target && 'current' in target) {
        return target.current;
    }

    return target ?? null;
}

export function useMutationObserver<T extends HTMLElement = any>(
    callback: MutationCallback,
    options: MutationObserverInit,
    target?: Target<T>
) {
    const observer = React.useRef<MutationObserver>(null);
    const ref = React.useRef<T>(null);

    useIsoLayoutEffect(() => {
        const targetElement = getTargetElement(target);

        if (targetElement || ref.current) {
            observer.current = new MutationObserver(callback);
            observer.current.observe(targetElement || ref.current!, options);
        }

        return () => {
            observer.current?.disconnect();
        };
    }, [callback, options]);

    return ref;
}
