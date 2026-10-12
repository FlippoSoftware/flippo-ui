import React from 'react';

import { isOptionsStore } from '@flippo-software/core-components/lib';
import { ReadTracker } from '@flippo-software/core-components/store';

import { SourceSubscriptions } from './SourceSubscriptions';
import { shallowEqual } from './useMachine';

import type { Subscribable } from './SourceSubscriptions';

export type { Subscribable } from './SourceSubscriptions';

const NO_SOURCES: readonly Subscribable[] = [];

/**
 * Returns `getState()` of the machine and re-renders when it changes.
 *
 * The machine's own `store` and the stores and computed values that `getState()` reads (tracked on every call)
 * are subscribed to automatically. `getState()` builds a new object on each call; the previous snapshot is returned while it is
 * shallowly equal, so React re-renders only when the state actually changed.
 *
 * @param machine The machine whose state is rendered.
 * @param sources Sources that are not stores (e.g. controllers with their own `subscribe`) and that `getState()`
 *   depends on. Stores never need to be listed.
 */
export function useMachineState<State>(machine: { getState(): State }, sources: readonly Subscribable[] = NO_SOURCES): State {
    const [watcher, setWatcher] = React.useState(() => new StateWatcher(machine));
    if (watcher.machine !== machine) {
        setWatcher(new StateWatcher(machine));
    }
    watcher.setSources(sources);

    return React.useSyncExternalStore(watcher.subscribe, watcher.getSnapshot, watcher.getSnapshot);
}

/**
 * Computes `getState()` under tracking and keeps the subscriptions in line with what it read last.
 */
class StateWatcher<State> {
    readonly machine: { getState(): State };

    // Options are pushed on every render (callbacks are new each time): the component re-renders with its props anyway.
    private readonly reads = new ReadTracker({ ignore: isOptionsStore });

    private readonly subscriptions = new SourceSubscriptions(() => this.onChange?.());

    private onChange: (() => void) | null = null;

    private sources: readonly Subscribable[] = NO_SOURCES;

    private snapshot: { value: State } | null = null;

    constructor(machine: { getState(): State }) {
        this.machine = machine;
    }

    setSources(sources: readonly Subscribable[]) {
        if (sources.length !== this.sources.length || sources.some((source, index) => source !== this.sources[index])) {
            this.sources = sources;
        }
    }

    subscribe = (onChange: () => void) => {
        this.onChange = onChange;
        this.syncSubscriptions();
        return () => {
            this.onChange = null;
            this.subscriptions.clear();
        };
    };

    getSnapshot = (): State => {
        this.reads.clear();
        const next = this.reads.track(() => this.machine.getState());
        if (this.onChange) {
            // The reads may differ from the previous call (conditional reads).
            this.syncSubscriptions();
        }
        if (this.snapshot === null || !shallowEqual(this.snapshot.value, next)) {
            this.snapshot = { value: next };
        }
        return this.snapshot.value;
    };

    private syncSubscriptions() {
        const { store } = this.machine as { store?: Subscribable };
        this.subscriptions.sync(store ? [store, ...this.reads.sources, ...this.sources] : [...this.reads.sources, ...this.sources]);
    }
}
