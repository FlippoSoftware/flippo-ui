import type React from 'react';

import { useLazyRef } from '../useLazyRef';

type Empty = null | undefined;
type InputRef<I> = React.Ref<I> | Empty;
type Result<I> = React.RefCallback<I> | null;
type Cleanup = () => void;

type MergeRef<I> = {
    callback: React.RefCallback<I> | null;
    cleanup: Cleanup | null;
    refs: InputRef<I>[];
};

export function mergedRef<I>(...refs: InputRef<I>[]): Result<I> {
    const mergeRef = createMergedRef<I>();

    update(mergeRef, refs);

    return mergeRef.callback;
}

/**
 * Merges multiple refs into a single callback ref.
 *
 * @template I - The type of the element the ref will be attached to.
 * @param {...InputRef<I>[]} refs - The refs to be merged.
 * @returns {Result<I>} A callback ref that updates all provided refs.
 */
export function useMergedRef<I>(...refs: InputRef<I>[]): Result<I> {
    const mergeRef = useLazyRef(createMergedRef<I>).current;

    if (didChange(mergeRef, refs)) {
        update(mergeRef, refs);
    }

    return mergeRef.callback;
}

function createMergedRef<I>(): MergeRef<I> {
    return {
        callback: null,
        cleanup: null as Cleanup | null,
        refs: []
    };
}

function didChange<I>(mergeRef: MergeRef<I>, newRefs: InputRef<I>[]) {
    return mergeRef.refs.length !== newRefs.length || newRefs.some((ref, i) => mergeRef.refs[i] !== ref);
}

function update<I>(forkRef: MergeRef<I>, refs: InputRef<I>[]) {
    forkRef.refs = refs;

    if (refs.every((ref) => ref == null)) {
        forkRef.callback = null;
        return;
    }

    forkRef.callback = (instance: I) => {
        if (forkRef.cleanup) {
            forkRef.cleanup();
            forkRef.cleanup = null;
        }

        if (instance != null) {
            const cleanupCallbacks = Array.from({ length: refs.length }).fill(null) as Array<Cleanup | null>;

            for (let i = 0; i < refs.length; i += 1) {
                const ref = refs[i];
                if (ref == null) {
                    continue;
                }
                switch (typeof ref) {
                    case 'function': {
                        const refCleanup = ref(instance);
                        if (typeof refCleanup === 'function') {
                            cleanupCallbacks[i] = refCleanup;
                        }
                        break;
                    }
                    case 'object': {
                        ref.current = instance;
                        break;
                    }
                    default:
                }
            }

            forkRef.cleanup = () => {
                for (let i = 0; i < refs.length; i += 1) {
                    const ref = refs[i];
                    if (ref == null) {
                        continue;
                    }
                    switch (typeof ref) {
                        case 'function': {
                            const cleanupCallback = cleanupCallbacks[i];
                            if (typeof cleanupCallback === 'function') {
                                cleanupCallback();
                            }
                            else {
                                ref(null);
                            }
                            break;
                        }
                        case 'object': {
                            ref.current = null;
                            break;
                        }
                        default:
                    }
                }
            };
        }
    };
}
