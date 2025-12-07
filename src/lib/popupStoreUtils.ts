import React from 'react';

import type { Store } from '@flippo-ui/hooks/use-store';

/**
 * Returns a callback ref that registers/unregisters the trigger element in the store.
 *
 * @param id ID of the trigger. This must not be undefined by the time a ref is assigned.
 * @param store The Store instance where the trigger should be registered.
 */
export function useTriggerRegistration<State extends { triggers: PopupTriggerMap }>(
    id: string | undefined,
    store: Store<State>
) {
    const registeredIdRef = React.useRef<string>(null);

    return React.useCallback(
        (triggerElement: HTMLElement | null) => {
            if (id == null) {
                throw new Error('Headless UI: Trigger must have an `id` prop specified.');
            }

            const triggers = store.state.triggers;
            if (triggerElement != null) {
                triggers.set(id, triggerElement);
                // Keeping track of the registered id in case it changes.
                registeredIdRef.current = id;
            }
            else if (registeredIdRef.current != null) {
                triggers.delete(registeredIdRef.current);
                registeredIdRef.current = null;
            }
        },
        [store, id]
    );
}

export type PayloadChildRenderFunction<Payload> = (arg: {
    payload: Payload | undefined;
}) => React.ReactNode;

export type PopupTriggerMap = Map<string, HTMLElement>;
