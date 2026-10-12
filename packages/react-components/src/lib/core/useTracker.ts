import React from 'react';

import { isOptionsStore } from '@flippo-software/core-components/lib';
import { ReadTracker } from '@flippo-software/core-components/store';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { SourceSubscriptions } from './SourceSubscriptions';

/**
 * Runs a function and records the stores and computed values it reads.
 */
export type Track = <T>(fn: () => T) => T;

/**
 * Returns `track`: the component re-renders when what it read inside `track(...)` during its last render changes —
 * the keys of a store's state, or the value of a computed value. Changes of other keys do not re-render it.
 *
 * Use it for render-time reads outside `getState()` (which {@link useMachineState} tracks), typically props:
 *
 * ```tsx
 * const track = useTracker();
 * useRenderElement('div', componentProps, {
 *     props: [elementProps, (props) => track(() => toReactProps(item.getItemProps(props)))]
 * });
 * ```
 *
 * Unlike `useMachineState`, there is no snapshot to compare: a change of a key read re-renders, even if the props
 * end up the same.
 */
export function useTracker(): Track {
    const [watcher] = React.useState(() => new RenderWatcher());
    watcher.beginRender();

    React.useSyncExternalStore(watcher.subscribe, watcher.getVersion, watcher.getVersion);

    // After every commit: follow the reads of this render, and catch changes made since they were read.
    useIsoLayoutEffect(() => {
        watcher.commit();
    });

    return watcher.track;
}

class RenderWatcher {
    // Options are pushed on every render (callbacks are new each time): the component re-renders with its props anyway.
    private readonly reads = new ReadTracker({ ignore: isOptionsStore });

    // A notification is a change only if a key (or a computed value) read by the last render has changed.
    private readonly subscriptions = new SourceSubscriptions(() => {
        if (this.reads.hasChanged()) {
            this.changed();
        }
    });

    private onChange: (() => void) | null = null;

    private version = 0;

    readonly track: Track = (fn) => this.reads.track(fn);

    beginRender() {
        this.reads.clear();
    }

    subscribe = (onChange: () => void) => {
        this.onChange = onChange;
        this.commit();
        return () => {
            this.onChange = null;
            this.subscriptions.clear();
        };
    };

    getVersion = () => this.version;

    commit() {
        if (!this.onChange) {
            return;
        }
        this.subscriptions.sync(this.reads.sources);
        if (this.reads.hasChanged()) {
            this.changed();
        }
    }

    private changed() {
        this.version += 1;
        this.onChange?.();
    }
}
