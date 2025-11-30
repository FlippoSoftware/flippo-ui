import React from 'react';

const UNINICIALIZED = {};

/**
 * Creates a React ref object that is lazily initialized.
 * The initialization function is called only once when the ref is first accessed.
 *
 * @param init A function that returns the initial value for the ref.
 * @returns A React ref object containing the lazily initialized value.
 */
export function useLazyRef<T>(init: () => T): React.RefObject<T>;
export function useLazyRef<T, U>(init: (arg: U) => T, initArg: U): React.RefObject<T>;
export function useLazyRef(init: (arg?: unknown) => unknown, initArg?: unknown) {
    const ref = React.useRef(UNINICIALIZED as any);

    if (ref.current === UNINICIALIZED) {
        ref.current = init(initArg);
    }

    return ref;
}
