import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useLazyRef } from '../useLazyRef';

/**
 * Untracks the provided value by turning it into a ref to remove its reactivity.
 *
 * Used to access the passed value inside `React.useEffect` without causing the effect to re-run when the value changes.
 */
export function useValueAsRef<T>(value: T) {
    const latest = useLazyRef(createLatestRef, value).current;

    latest.next = value;

    useIsoLayoutEffect(latest.effect);

    return latest;
}

function createLatestRef<T>(value: T) {
    const latest = {
        current: value,
        next: value,
        effect: () => {
            latest.current = latest.next;
        }
    };
    return latest;
}
