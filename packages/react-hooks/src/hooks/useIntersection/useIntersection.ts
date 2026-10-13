import React from 'react';

import { useStableCallback } from '../useStableCallback';

export type UseIntersectionReturnValue<T> = {
    ref: React.RefCallback<T | null>;
    entry: IntersectionObserverEntry | null;
};

export function useIntersection<T extends HTMLElement = any>(
    options?: IntersectionObserverInit
): UseIntersectionReturnValue<T> {
    const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null);

    const observer = React.useRef<IntersectionObserver | null>(null);

    const ref: React.RefCallback<T | null> = useStableCallback(
        (element) => {
            if (observer.current) {
                observer.current.disconnect();
                observer.current = null;
            }

            if (element === null) {
                setEntry(null);
                return;
            }

            observer.current = new IntersectionObserver(([_entry]) => {
                setEntry(_entry ?? null);
            }, options);

            observer.current.observe(element);
        }
    );

    return { ref, entry };
}
