import React from 'react';

import { useStableCallback } from '../useStableCallback';
import { useUnmount } from '../useUnmount';

function containsRelatedTarget(event: FocusEvent) {
    if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
        return event.currentTarget.contains(event.relatedTarget);
    }

    return false;
}

export type UseFocusWithinOptions = {
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
};

export type UseFocusWithinReturnValue<T extends HTMLElement = any> = {
    ref: React.RefCallback<T | null>;
    focused: boolean;
};

export function useFocusWithin<T extends HTMLElement = any>({
    onBlur,
    onFocus
}: UseFocusWithinOptions = {}): UseFocusWithinReturnValue<T> {
    const [focused, setFocused] = React.useState(false);
    const focusedRef = React.useRef(false);
    const previousNode = React.useRef<T | null>(null);

    const onFocusRef = useStableCallback(onFocus);
    const onBlurRef = useStableCallback(onBlur);

    const _setFocused = React.useCallback((value: boolean) => {
        setFocused(value);
        focusedRef.current = value;
    }, []);

    const handleFocusIn = React.useCallback((event: FocusEvent) => {
        if (!focusedRef.current) {
            _setFocused(true);
            onFocusRef(event);
        }
    }, [_setFocused, onFocusRef]);

    const handleFocusOut = React.useCallback((event: FocusEvent) => {
        if (focusedRef.current && !containsRelatedTarget(event)) {
            _setFocused(false);
            onBlurRef(event);
        }
    }, [_setFocused, onBlurRef]);

    const callbackRef: React.RefCallback<T | null> = React.useCallback(
        (node) => {
            if (!node) {
                return;
            }

            if (previousNode.current) {
                previousNode.current.removeEventListener('focusin', handleFocusIn);
                previousNode.current.removeEventListener('focusout', handleFocusOut);
            }

            node.addEventListener('focusin', handleFocusIn);
            node.addEventListener('focusout', handleFocusOut);
            previousNode.current = node;
        },
        [handleFocusIn, handleFocusOut]
    );

    useUnmount(
        () => {
            if (previousNode.current) {
                previousNode.current.removeEventListener('focusin', handleFocusIn);
                previousNode.current.removeEventListener('focusout', handleFocusOut);
            }
        }
    );

    return { ref: callbackRef, focused };
}
