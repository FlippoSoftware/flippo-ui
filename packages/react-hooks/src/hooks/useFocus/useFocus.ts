import React from 'react';

import { isTarget } from '~@lib/isTarget';

import type { HookTarget } from '~@lib/isTarget';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useRefAsState } from '../useRefAsState';

import type { RefAsState } from '../useRefAsState';

/** The use focus options type */
export type UseFocusOptions = {
    /** The enabled state of the focus hook */
    enabled?: boolean;
    /** The initial focus state of the target */
    initialValue?: boolean;
    /** The on blur callback */
    onBlur?: (event: FocusEvent) => void;
    /** The on focus callback */
    onFocus?: (event: FocusEvent) => void;
};

/** The use focus return type */
export type UseFocusReturn = {
    /** The boolean state value of the target */
    focused: boolean;
    /** Blur the target */
    blur: () => void;
    /** Focus the target */
    focus: () => void;
};

export type UseFocus = {
    (target: HookTarget, callback?: (event: FocusEvent) => void): UseFocusReturn;

    (target: HookTarget, options?: UseFocusOptions): UseFocusReturn;

    <Target extends Element>(
        callback?: (event: FocusEvent) => void,
        target?: never
    ): UseFocusReturn & { ref: RefAsState<Target> };

    <Target extends Element>(
        options?: UseFocusOptions,
        target?: never
    ): UseFocusReturn & { ref: RefAsState<Target> };
};

export const useFocus = ((...params: any[]) => {
    const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

    const options = (
        target
            ? typeof params[1] === 'object'
                ? params[1]
                : { onFocus: params[1] }
            : typeof params[0] === 'object'
                ? params[0]
                : { onFocus: params[0] }
    ) as UseFocusOptions | undefined;
    const enabled = options?.enabled ?? true;
    const initialValue = options?.initialValue ?? false;

    const [focused, setFocused] = React.useState(initialValue);
    const internalRef = useRefAsState<Element>();
    const internalOptionsRef = React.useRef(options);
    internalOptionsRef.current = options;

    const elementRef = React.useRef<HTMLElement | null>(null);

    const focus = () => {
        if (!elementRef.current)
            return;
        elementRef.current.focus();
        setFocused(true);
    };

    const blur = () => {
        if (!elementRef.current)
            return;
        elementRef.current.blur();
        setFocused(false);
    };

    useIsoLayoutEffect(() => {
        if (!enabled || (!target && !internalRef.state))
            return;
        const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
        if (!element)
            return;

        elementRef.current = element;

        const onFocus = (event: FocusEvent) => {
            internalOptionsRef.current?.onFocus?.(event);
            if (!focus || (event.target as HTMLElement).matches?.(':focus-visible'))
                setFocused(true);
        };

        const onBlur = (event: FocusEvent) => {
            internalOptionsRef.current?.onBlur?.(event);
            setFocused(false);
        };

        if (initialValue)
            element.focus();

        element.addEventListener('focus', onFocus);
        element.addEventListener('blur', onBlur);

        return () => {
            element.removeEventListener('focus', onFocus);
            element.removeEventListener('blur', onBlur);
        };
    }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);

    if (target)
        return { focus, blur, focused };
    return {
        ref: internalRef,
        focus,
        blur,
        focused
    };
}) as UseFocus;
