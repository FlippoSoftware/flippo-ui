import { isElement } from '@floating-ui/utils/dom';

import { FloatingRootStore } from '~@packages/floating-ui/FloatingRootStore';

import type { ChangeEventDetails } from '~@events/changeEventDetails';
import type { FloatingRootState } from '~@packages/floating-ui/FloatingRootStore';

import type { PopupStoreState } from './popupStoreState';
import type { AnyPopupStore } from './popupTriggers';

export type PopupFloatingRootOptions<Reason extends string> = {
    floatingId: string | undefined;
    /**
     * Whether the popup is nested in another floating element.
     */
    nested: boolean;
    /**
     * Whether to prevent the auto-emitted `openchange` event.
     * @default false
     */
    noEmit?: boolean | undefined;
    /**
     * Whether the popup element is the floating element instead of the positioner.
     * @default false
     */
    treatPopupAsFloatingElement?: boolean | undefined;
    onOpenChange: (open: boolean, eventDetails: ChangeEventDetails<Reason>) => void;
};

/**
 * Creates a floating root kept in sync with a popup store (open state, trigger and floating elements).
 * Replacement for `useSyncedFloatingRootContext`.
 *
 * @returns The floating root and `connect`, which starts syncing and returns a function that stops it.
 */
export function createPopupFloatingRoot<State extends PopupStoreState<unknown>, Reason extends string = string>(
    popupStore: AnyPopupStore<State>,
    options: PopupFloatingRootOptions<Reason>
): { floatingRoot: FloatingRootStore<Reason>; connect: () => () => void } {
    const { floatingId, nested, noEmit = false, treatPopupAsFloatingElement = false, onOpenChange } = options;

    const select = () => ({
        open: popupStore.select('open'),
        referenceElement: popupStore.select('activeTriggerElement'),
        floatingElement: popupStore.select(treatPopupAsFloatingElement ? 'popupElement' : 'positionerElement')
    });

    const initial = select();

    const floatingRoot = new FloatingRootStore<Reason>({
        open: initial.open,
        referenceElement: initial.referenceElement,
        floatingElement: initial.floatingElement,
        triggerElements: popupStore.context.triggerElements,
        onOpenChange,
        floatingId,
        nested,
        noEmit
    });

    const sync = () => {
        const { open, referenceElement, floatingElement } = select();
        const valuesToSync: Partial<FloatingRootState> = { open, floatingId, referenceElement, floatingElement };

        if (isElement(referenceElement)) {
            valuesToSync.domReferenceElement = referenceElement;
        }

        floatingRoot.update(valuesToSync);
    };

    const connect = () => {
        sync();
        return popupStore.subscribe(sync);
    };

    return { floatingRoot, connect };
}
