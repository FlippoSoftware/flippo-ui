import React from 'react';

import { useEventCallback } from '../useEventCallback';
import { useIsoLayoutEffect } from '../useIsoLayoutEffect';

export type UseFocusReturnOptions = {
    manual?: boolean;
};

export type UseFocusReturnReturnValue = {
    returnFocus: () => void;
    saveFocus: () => void;
};

export function useFocusReturn({
    manual = false
}: UseFocusReturnOptions): UseFocusReturnReturnValue {
    const savedElementRef = React.useRef<HTMLElement | null>(null);

    const saveFocus = useEventCallback(() => {
        savedElementRef.current = document.activeElement as HTMLElement;
    });

    const returnFocus = useEventCallback(() => {
        if (
            savedElementRef.current
            && 'focus' in savedElementRef.current
            && typeof savedElementRef.current.focus === 'function'
        ) {
            savedElementRef.current?.focus({ preventScroll: true });

            return;
        }

        if (process.env.NODE_ENV !== 'production') {
            console.warn('useFocusReturn: No focusable element was found to return to');
        }
    });

    useIsoLayoutEffect(() => {
        if (manual)
            return;

        saveFocus();

        return () => {
            returnFocus();
        };
    }, [manual]);

    return { returnFocus, saveFocus };
}
