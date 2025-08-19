'use client';

import * as React from 'react';

type TChangeHandler<T> = (state: T, ...args: any[]) => void;
type TSetState<T> = React.Dispatch<React.SetStateAction<T>>;

type TUseControlledStateParams<T> = {
    prop?: T;
    defaultProp: T;
    onChange?: TChangeHandler<T>;
    caller?: string;
};

export function useControlledState<T>(params: TUseControlledStateParams<T>): [T, TSetState<T>] {
    const {
        prop,
        defaultProp,
        onChange,
        caller
    } = params;
    const [uncontrolledProp, setUncontrolledSet, onChangeRef] = useUncontrolledState({ defaultProp, onChange });

    const isControlled = prop !== undefined;
    const state = isControlled ? prop : uncontrolledProp;

    /* eslint-disable react-hooks/rules-of-hooks */
    // eslint-disable-next-line node/prefer-global/process
    if (process.env.NODE_ENV !== 'production') {
        const isControlledRef = React.useRef(prop !== undefined);
        React.useEffect(() => {
            const wasControlled = isControlledRef.current;
            if (wasControlled !== isControlled) {
                const from = wasControlled ? 'controlled' : 'uncontrolled';
                const to = isControlled ? 'controlled' : 'uncontrolled';
                console.warn(
                    `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
                );
            }

            isControlledRef.current = isControlled;
        }, [isControlled, caller]);
    }
    /* eslint-enable react-hooks/rules-of-hooks */

    const setState = React.useCallback<TSetState<T>>((nextState: React.SetStateAction<T>) => {
        if (isControlled) {
            const newState = isFunction(nextState) ? nextState(state) : nextState;
            if (newState !== state) {
                onChangeRef.current?.(state);
            }
        }
        else {
            setUncontrolledSet(nextState);
        }
    }, [
        state,
        isControlled,
        setUncontrolledSet,
        onChangeRef
    ]);

    return [state, setState];
}

function useUncontrolledState<T>(params: Omit<TUseControlledStateParams<T>, 'prop' | 'caller'>): [Value: T, SetValue: TSetState<T>, OnChangeRef: React.RefObject<TChangeHandler<T> | undefined>] {
    const { defaultProp, onChange } = params;
    const [state, setState] = React.useState(defaultProp);
    const prevStateRef = React.useRef(state);

    const onChangeRef = React.useRef(onChange);
    React.useInsertionEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    React.useEffect(() => {
        if (prevStateRef.current !== state) {
            onChangeRef.current?.(state);
            prevStateRef.current = state;
        }
    }, [state, setState, onChangeRef]);

    return [state, setState, onChangeRef];
}

function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === 'function';
}
