/* False positives - ESLint thinks we're calling a hook from a class component. */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

import { ComponentStore } from '@flippo-software/store';

import type { ContextFunctionKeys, KeysAllowingUndefined, SelectMethod, SelectorFunction } from '@flippo-software/store';

import { NOOP } from '~@lib/noop';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useStableCallback } from '../useStableCallback';

import { useStore } from './useStore';

type MaybeCallable = (...args: any[]) => any;

type ContextFunction<Context, Key extends keyof Context> = Extract<Context[Key], MaybeCallable>;

/**
 * React adapter of `ComponentStore` from `@flippo-software/store`: the store logic (state, selectors,
 * controlled values, context, `observe`) comes from the framework-agnostic store; this class only adds hooks.
 */
export class ReactStore<
    State extends object,
    Context = Record<string, never>,
    Selectors extends Record<string, SelectorFunction<State>> = Record<string, never>
> extends ComponentStore<State, Context, Selectors> {
    /**
     * Returns a value from the store's state using the selector registered under `key`
     * and re-renders whenever the selected value changes.
     *
     * @param key Key of the selector to use.
     */
    public useState = ((key: keyof Selectors, a1?: unknown, a2?: unknown, a3?: unknown) => {
        React.useDebugValue(key);
        return useStore(this, this.getSelector(key) as SelectorFunction<State>, a1, a2, a3);
    }) as SelectMethod<Selectors>;

    /**
     * Synchronizes a single external value into the store after each commit.
     *
     * Note that while the value in `state` is updated after the commit, the value returned
     * by `useState` is updated before the next render (similarly to React's `useState`).
     */
    public useSyncedValue<Key extends keyof State>(key: Key, value: State[Key]) {
        React.useDebugValue(key);
        useIsoLayoutEffect(() => {
            this.syncValue(key, value);
        }, [key, value]);
    }

    /**
     * Synchronizes a single external value into the store and cleans it up (sets to `undefined`) on unmount.
     */
    public useSyncedValueWithCleanup<Key extends KeysAllowingUndefined<State>>(key: Key, value: State[Key]) {
        useIsoLayoutEffect(() => this.syncValueWithCleanup(key, value), [key, value]);
    }

    /**
     * Synchronizes multiple external values into the store after each commit.
     */
    public useSyncedValues(values: Partial<State>) {
        React.useDebugValue(values, (v) => Object.keys(v));
        useIsoLayoutEffect(() => {
            this.syncValues(values);
        }, [values]);
    }

    /**
     * Registers a controllable value for `key`:
     * - if `controlled` is not `undefined`, the key is controlled: the store's state at `key` follows it and
     *   local writes to `key` are ignored;
     * - if `controlled` is `undefined`, the key is uncontrolled and the store keeps its own value.
     */
    public useControlledProp<Key extends keyof State>(key: Key, controlled: State[Key] | undefined): void {
        React.useDebugValue(key);
        useIsoLayoutEffect(() => {
            this.syncControlledValue(key, controlled);
        }, [key, controlled]);
    }

    /**
     * Wraps a function with `useStableCallback` to ensure it has a stable reference
     * and assigns it to the context.
     *
     * @param key Key of the event callback. Must be a function in the context.
     * @param fn Function to assign.
     */
    public useContextCallback<Key extends ContextFunctionKeys<Context>>(key: Key, fn: ContextFunction<Context, Key> | undefined) {
        React.useDebugValue(key);
        const stableFunction = useStableCallback(fn ?? (NOOP as ContextFunction<Context, Key>));
        this.setContextValue(key, stableFunction as Context[Key]);
    }

    /**
     * Returns a stable setter function for a specific key in the store's state.
     * It's commonly used to pass as a ref callback to React elements.
     *
     * @param key Key of the state to set.
     */
    public useStateSetter<Key extends keyof State>(key: Key) {
        return React.useMemo(() => this.createSetter(key), [key]);
    }
}
