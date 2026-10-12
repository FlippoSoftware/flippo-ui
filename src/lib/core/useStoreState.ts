import React from 'react';

/**
 * A core `Store` as seen by React.
 */
export type ReadableStore<State> = {
    readonly state: State;
    subscribe(listener: () => void): () => void;
};

/**
 * Subscribes to a core store and returns its state (a new reference after every change).
 */
export function useStoreState<State>(store: ReadableStore<State>): State {
    const getSnapshot = React.useCallback(() => store.state, [store]);
    return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
