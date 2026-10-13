import { deferNotifications, flushNotifications } from '@flippo-software/core-components/store';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

const IS_SERVER = typeof document === 'undefined';

/**
 * Runs `sync` during the render, for parts that push their props into a machine owned by an ancestor
 * (e.g. a panel's options into its root). Store notifications it causes are deferred like those of
 * `useMachine`'s `setOptions` and flushed after this component's commit.
 *
 * `sync` must only write state (no user callbacks, no DOM side effects).
 */
export function useSyncDuringRender(sync: () => void) {
    if (IS_SERVER) {
        sync();
    } else {
        deferNotifications(sync);
    }

    // This component may re-render alone, without the ancestor that would otherwise flush.
    useIsoLayoutEffect(() => {
        flushNotifications();
    });
}
