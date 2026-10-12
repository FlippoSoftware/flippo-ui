/**
 * Test-only ESM version of `use-sync-external-store/with-selector` (same algorithm as React's).
 *
 * The linked `@flippo-software/hooks` imports the CJS package from its own node_modules, whose `require('react')`
 * would load a second React; aliasing to this file keeps one React in tests.
 */
import React from 'react';

type Instance<Selection> = { hasValue: boolean; value: Selection | null };

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => Snapshot,
    getServerSnapshot: undefined | null | (() => Snapshot),
    selector: (snapshot: Snapshot) => Selection,
    isEqual?: (a: Selection, b: Selection) => boolean
): Selection {
    const instRef = React.useRef<Instance<Selection> | null>(null);
    if (instRef.current === null) {
        instRef.current = { hasValue: false, value: null };
    }
    const inst = instRef.current;

    const [getSelection, getServerSelection] = React.useMemo(() => {
        let hasMemo = false;
        let memoizedSnapshot: Snapshot;
        let memoizedSelection: Selection;

        const memoizedSelector = (nextSnapshot: Snapshot) => {
            if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                const nextSelection = selector(nextSnapshot);
                if (isEqual !== undefined && inst.hasValue) {
                    const currentSelection = inst.value as Selection;
                    if (isEqual(currentSelection, nextSelection)) {
                        memoizedSelection = currentSelection;
                        return currentSelection;
                    }
                }
                memoizedSelection = nextSelection;
                return nextSelection;
            }

            const previousSelection = memoizedSelection;
            if (Object.is(memoizedSnapshot, nextSnapshot)) {
                return previousSelection;
            }

            const nextSelection = selector(nextSnapshot);
            if (isEqual !== undefined && isEqual(previousSelection, nextSelection)) {
                memoizedSnapshot = nextSnapshot;
                return previousSelection;
            }

            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
        };

        return [
            () => memoizedSelector(getSnapshot()),
            getServerSnapshot == null ? undefined : () => memoizedSelector(getServerSnapshot())
        ] as const;
    }, [getSnapshot, getServerSnapshot, selector, isEqual, inst]);

    const value = React.useSyncExternalStore(subscribe, getSelection, getServerSelection);

    React.useEffect(() => {
        inst.hasValue = true;
        inst.value = value;
    }, [value, inst]);

    return value;
}
