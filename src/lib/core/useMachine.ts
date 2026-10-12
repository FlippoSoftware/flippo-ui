import React from 'react';

import { deferNotifications, flushNotifications } from '@flippo-software/core-components/store';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

/**
 * A core state machine as the adapter sees it: options are pushed with `setOptions`; `connect` (if any)
 * starts subscriptions and side effects and returns the cleanup.
 */
export type Machine<Options> = {
    setOptions(options: Options): void;
    connect?(): () => void;
    /**
     * Side effects of option changes (user callbacks, validation) that must not run during render.
     */
    afterCommit?(): void;
};

const IS_SERVER = typeof document === 'undefined';

/**
 * Creates a core machine once per component instance and keeps it in sync with React.
 *
 * - The machine is created during the first render. Core constructors have no side effects, so React
 *   discarding a render (StrictMode, Suspense) leaks nothing.
 * - `setOptions` runs during every render, so the render reads the current options. Store changes it causes
 *   apply immediately, but their listeners (other components) are notified after the commit, in a layout
 *   effect: React doesn't allow updating another component while rendering. On the server nothing
 *   subscribes and no effect would flush, so notifications are not deferred there.
 * - `afterCommit()` (if any) runs in a layout effect after every commit, for side effects of option changes.
 * - `connect()` runs in a layout effect and is undone on unmount; StrictMode's unmount/remount reconnects
 *   the same instance.
 *
 * @param create Creates the machine from the initial options.
 * @param options Options of the current render.
 */
export function useMachine<Options, M extends Machine<Options>>(create: (options: Options) => M, options: Options): M {
    // `useState` rather than a ref: the machine is read during render, which refs shouldn't be.
    const [machine] = React.useState(() => create(options));

    if (IS_SERVER) {
        machine.setOptions(options);
    } else {
        deferNotifications(() => machine.setOptions(options));
    }

    useIsoLayoutEffect(() => {
        flushNotifications();
        machine.afterCommit?.();
    });

    useIsoLayoutEffect(() => machine.connect?.(), [machine]);

    return machine;
}

/**
 * Whether two values are equal, comparing plain objects key by key (`Object.is`).
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true;
    }
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return false;
    }
    const keysA = Object.keys(a);
    if (keysA.length !== Object.keys(b).length) {
        return false;
    }
    return keysA.every(
        (key) => Object.hasOwn(b, key) && Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
}
