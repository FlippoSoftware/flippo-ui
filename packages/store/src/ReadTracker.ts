import { hasChanged, runWithReads } from './runtime';

import type { ReadableStore, Reads } from './types';

export type ReadTrackerOptions = {
    /**
     * Stores (or computed values) not to record. E.g. a framework adapter that pushes options into a store on every
     * render ignores that store: the component already re-renders with its own props.
     */
    ignore?: ((source: ReadableStore<unknown>) => boolean) | undefined;
};

/**
 * Records which stores and computed values are read, and the values read, to subscribe to exactly them.
 *
 * Unlike {@link computed}, it caches nothing: `track(fn)` always runs `fn`, so `fn` may also read values that are
 * not reactive (options, props). Framework adapters use it to re-render a component when a store read during its
 * last render changes.
 *
 * @example
 * ```ts
 * const reads = new ReadTracker();
 *
 * function render() {
 *     reads.clear();
 *     const html = reads.track(() => template(store.state, other.state));
 *     // subscribe to `reads.sources`, then check `reads.hasChanged()` to catch changes made in between
 * }
 * ```
 */
export class ReadTracker {
    private readonly reads: Reads = new Map();

    private readonly ignore: ((source: ReadableStore<unknown>) => boolean) | undefined;

    constructor(options: ReadTrackerOptions = {}) {
        this.ignore = options.ignore;
    }

    /**
     * Runs `fn` and records the stores and computed values it reads (added to the ones recorded before).
     */
    track = <T>(fn: () => T): T => {
        try {
            return runWithReads(this.reads, fn);
        } finally {
            if (this.ignore) {
                for (const node of this.reads.keys()) {
                    if (this.ignore(node)) {
                        this.reads.delete(node);
                    }
                }
            }
        }
    };

    /**
     * Forgets the recorded reads.
     */
    clear() {
        this.reads.clear();
    }

    /**
     * The stores and computed values read since the last {@link ReadTracker.clear}.
     */
    get sources(): ReadableStore<unknown>[] {
        return [...this.reads.keys()];
    }

    /**
     * Whether one of the recorded stores or computed values has changed since it was read: its state (or value)
     * is no longer the reference that was read.
     */
    hasChanged(): boolean {
        return hasChanged(this.reads);
    }
}
