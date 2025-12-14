import React from 'react';

import { useEventCallback } from '@flippo-ui/hooks/use-event-callback';
import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';
import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { useTransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import type { ReactStore } from '@flippo-ui/hooks/use-store';

import type {
    PopupStoreContext,
    popupStoreSelectors,
    PopupStoreSelectors,
    PopupStoreState
} from './store';

/**
 * Returns a callback ref that registers/unregisters the trigger element in the store.
 *
 * @param store The Store instance where the trigger should be registered.
 */
export function useTriggerRegistration<State extends PopupStoreState<any>>(
    id: string | undefined,
    store: ReactStore<State, PopupStoreContext<any>, PopupStoreSelectors>
) {
    // Keep track of the currently registered element to unregister it on unmount or id change.
    const registeredElementId = React.useRef<string | null>(null);

    return React.useCallback(
        (element: Element | null) => {
            if (id === undefined) {
                return undefined;
            }

            if (registeredElementId.current !== null) {
                store.context.triggerElements.delete(registeredElementId.current);
                registeredElementId.current = null;
            }

            if (element !== null) {
                registeredElementId.current = id;
                store.context.triggerElements.add(id, element);

                return () => {
                    if (registeredElementId.current !== null) {
                        store.context.triggerElements.delete(registeredElementId.current);
                        registeredElementId.current = null;
                    }
                };
            }

            return undefined;
        },
        [store, id]
    );
}

/**
 * Sets up trigger data forwarding to the store.
 *
 * @param triggerId Id of the trigger.
 * @param triggerElement The trigger DOM element.
 * @param store The Store instance managing the popup state.
 * @param stateUpdates An object with state updates to apply when the trigger is active.
 */
export function useTriggerDataForwarding<State extends PopupStoreState<any>>(
    triggerId: string | undefined,
    triggerElement: Element | null,
    store: ReactStore<State, PopupStoreContext<any>, typeof popupStoreSelectors>,
    stateUpdates: Omit<Partial<State>, 'activeTriggerId' | 'activeTriggerElement'>
) {
    const isMountedByThisTrigger = store.useState('isMountedByTrigger', triggerId);

    const baseRegisterTrigger = useTriggerRegistration(triggerId, store);

    const registerTrigger = useEventCallback((element: Element | null) => {
        const cleanup = baseRegisterTrigger(element);

        if (element !== null && store.select('open') && store.select('activeTriggerId') == null) {
            // This runs when popup is open, but no active trigger is set.
            // It can happen when using controlled mode and the trigger is mounted after opening or if `triggerId`
            // prop is not set explicitly.
            // In such cases the first trigger to run this code becomes the active trigger (store.select('activeTriggerId')
            // should not return null after that).
            // This is mostly for compatibility with contained triggers where no explicit `triggerId` was required in controlled
            // mode.
            store.update({
                activeTriggerId: triggerId,
                activeTriggerElement: element,
                ...stateUpdates
            } as Partial<State>);
        }

        return cleanup;
    });

    useIsoLayoutEffect(() => {
        if (isMountedByThisTrigger) {
            store.update({ activeTriggerElement: triggerElement, ...stateUpdates } as Partial<State>);
        }
    }, [isMountedByThisTrigger, store, triggerElement, ...Object.values(stateUpdates)]);

    return { registerTrigger, isMountedByThisTrigger };
}

export type PayloadChildRenderFunction<Payload> = (arg: {
    payload: Payload | undefined;
}) => React.ReactNode;

/**
 * Ensures that when there's no active trigger, one is selected implicitly.
 * Priority order:
 * 1. Primary trigger (if set via `primary` prop)
 * 2. First trigger (if only one trigger is registered)
 *
 * This allows controlled popups to work correctly without an explicit triggerId,
 * and enables TooltipMultiple to sync open state while each tooltip positions
 * relative to its own primary trigger.
 *
 * This should be called on the Root part.
 *
 * @param store The Store instance managing the popup state.
 */
export function useImplicitActiveTrigger<State extends PopupStoreState<any>>(
    store: ReactStore<State, PopupStoreContext<any>, typeof popupStoreSelectors>,
    /**
     * Optional external open state (e.g., from Multiple context).
     * If provided, uses this instead of store's open state.
     */
    externalOpen?: boolean
) {
    const storeOpen = store.useState('open');
    const open = externalOpen ?? storeOpen;
    const primaryTriggerId = store.useState('primaryTriggerId');

    useIsoLayoutEffect(() => {
        // if (open && !store.select('activeTriggerId') && store.context.triggerElements.size === 1) {
        if (!open || store.select('activeTriggerId')) {
            return;
        }

        // 1. Try primary trigger first
        if (primaryTriggerId) {
            const primaryElement = store.context.triggerElements.getById(primaryTriggerId);
            if (primaryElement) {
                store.update({
                    activeTriggerId: primaryTriggerId,
                    activeTriggerElement: primaryElement
                } as Partial<State>);
                return;
            }
        }

        // 2. Fallback: first trigger if only one exists
        if (store.context.triggerElements.size === 1) {
            const iteratorResult = store.context.triggerElements.entries().next();
            if (!iteratorResult.done) {
                const [implicitTriggerId, implicitTriggerElement] = iteratorResult.value;
                store.update({
                    activeTriggerId: implicitTriggerId,
                    activeTriggerElement: implicitTriggerElement
                } as Partial<State>);
            }
        }
    }, [open, primaryTriggerId, store]);
}

/**
 * Mangages the mounted state of the popup.
 * Sets up the transition status listeners and handles unmounting when needed.
 * Updates the `mounted` and `transitionStatus` states in the store.
 *
 * @param open Whether the popup is open.
 * @param store The Store instance managing the popup state.
 * @param onUnmount Optional callback to be called when the popup is unmounted.
 *
 * @returns A function to forcibly unmount the popup.
 */
export function useOpenStateTransitions<State extends PopupStoreState<any>>(
    open: boolean,
    store: ReactStore<State, PopupStoreContext<any>, typeof popupStoreSelectors>,
    onUnmount?: () => void
) {
    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

    store.useSyncedValues({ mounted, transitionStatus } as Partial<State>);

    const forceUnmount = useEventCallback(() => {
        setMounted(false);
        store.update({
            activeTriggerId: null,
            activeTriggerElement: null,
            mounted: false
        } as Partial<State>);
        onUnmount?.();
        store.context.onOpenChangeComplete?.(false);
    });

    const preventUnmountingOnClose = store.useState('preventUnmountingOnClose');

    useOpenChangeComplete({
        enabled: !preventUnmountingOnClose,
        open,
        ref: store.context.popupRef,
        onComplete() {
            if (!open) {
                forceUnmount();
            }
        }
    });

    return { forceUnmount, transitionStatus };
}
