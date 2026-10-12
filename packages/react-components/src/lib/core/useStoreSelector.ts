import React from 'react';

import type { ComponentStore, SelectorArgs, SelectorFunction } from '@flippo-software/core-components/store';

/**
 * Subscribes to a named selector of a core `ComponentStore` and returns its value
 * (replacement for `ReactStore#useState`).
 */
export function useStoreSelector<
    State extends object,
    Selectors extends Record<PropertyKey, SelectorFunction<State>>,
    Key extends keyof Selectors
>(store: ComponentStore<State, any, Selectors>, key: Key, ...args: SelectorArgs<Selectors[Key]>): ReturnType<Selectors[Key]> {
    const [a1, a2, a3] = args as unknown[];
    const getSnapshot = React.useCallback(
        () => store.getSelector(key)(store.state, a1, a2, a3) as ReturnType<Selectors[Key]>,
        [store, key, a1, a2, a3]
    );
    return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
