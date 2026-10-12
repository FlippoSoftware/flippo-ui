import React from 'react';

import type { ReadableStore } from './useStoreState';

/**
 * Subscribes to a core store and returns `selector(state, ...args)`; re-renders only when it changes
 * (replacement for `useStore` from `@flippo-software/hooks`).
 */
export function useSelector<State, Args extends unknown[], Result>(
    store: ReadableStore<State>,
    selector: (state: State, ...args: Args) => Result,
    ...args: Args
): Result {
    const [a1, a2, a3] = args;
    const getSnapshot = React.useCallback(
        () => selector(store.state, ...([a1, a2, a3].slice(0, args.length) as Args)),
        [store, selector, a1, a2, a3, args.length]
    );
    return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
