import { useId, useIsoLayoutEffect, useLazyRef } from '@flippo-ui/hooks';
import { isElement } from '@floating-ui/utils/dom';

import type { ReactStore } from '@flippo-ui/hooks/use-store';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { PopupStoreContext, PopupStoreSelectors, PopupStoreState } from '~@lib/popups';

import { FloatingRootStore } from '../components/FloatingRootStore';
import { useFloatingParentNodeId } from '../components/FloatingTree';

import type { FloatingRootState } from '../components/FloatingRootStore';

export type UseSyncedFloatingRootContextOptions<
    State extends PopupStoreState<any>,
    Reason extends string = string
> = {
    popupStore: ReactStore<State, PopupStoreContext<any>, PopupStoreSelectors>;
    /**
     * Whether to prevent the auto-emitted `openchange` event.
     */
    noEmit?: boolean;
    /**
     * Whether the Popup element is passed to Floating UI as the floating element instead of the default Positioner.
     */
    treatPopupAsFloatingElement?: boolean;
    onOpenChange: (open: boolean, eventDetails: HeadlessUIChangeEventDetails<Reason>) => void;
};

/**
 * Initializes a FloatingRootStore that is kept in sync with the provided PopupStore.
 * The new instance is created only once and updated on every render.
 */
export function useSyncedFloatingRootContext<
    State extends PopupStoreState<any>,
    Reason extends string = string
>(
    options: UseSyncedFloatingRootContextOptions<State, Reason>
): FloatingRootStore<Reason> {
    const {
        popupStore,
        noEmit = false,
        treatPopupAsFloatingElement = false,
        onOpenChange
    } = options;

    const floatingId = useId();
    const nested = useFloatingParentNodeId() != null;

    const open = popupStore.useState('open');
    const referenceElement = popupStore.useState('activeTriggerElement');
    const floatingElement = popupStore.useState(
        treatPopupAsFloatingElement ? 'popupElement' : 'positionerElement'
    );
    const triggerElements = popupStore.context.triggerElements;

    const store = useLazyRef(
        () =>
            new FloatingRootStore<Reason>({
                open,
                referenceElement,
                floatingElement,
                triggerElements,
                onOpenChange,
                floatingId,
                nested,
                noEmit
            })
    ).current;

    useIsoLayoutEffect(() => {
        const valuesToSync: Partial<FloatingRootState> = {
            open,
            floatingId,
            referenceElement,
            floatingElement
        };

        if (isElement(referenceElement)) {
            valuesToSync.domReferenceElement = referenceElement;
        }

        store.update(valuesToSync);
    }, [
        open,
        floatingId,
        referenceElement,
        floatingElement,
        store
    ]);

    // TODO: When `setOpen` is a part of the PopupStore API, we don't need to sync it.
    store.context.onOpenChange = onOpenChange;
    store.context.nested = nested;
    store.context.noEmit = noEmit;

    return store;
}
