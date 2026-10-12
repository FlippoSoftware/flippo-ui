import { effect, untracked } from '@flippo-software/store';

import { Connectable } from '~@lib/Connectable';

import type { ChangeEventDetails } from '~@events/changeEventDetails';
import type { FloatingRootStore } from '~@packages/floating-ui/FloatingRootStore';

import { createPopupFloatingRoot } from './createPopupFloatingRoot';
import { PopupTransitions } from './PopupTransitions';
import { ensureImplicitActiveTrigger } from './popupTriggers';

import type { PopupStoreState } from './popupStoreState';
import type { AnyPopupStore } from './popupTriggers';

export type PopupRootControllerOptions = {
    /**
     * Controlled open state.
     */
    open?: boolean | undefined;
    /**
     * Controlled active trigger ID.
     */
    triggerId?: string | null | undefined;
    onOpenChange?: ((open: boolean, eventDetails: never) => void) | undefined;
    onOpenChangeComplete?: ((open: boolean) => void) | undefined;
};

export type PopupRootControllerSetup<Reason extends string> = {
    /**
     * Changes the open state (usually the store's `setOpen`); also used by the floating root.
     */
    setOpen: (open: boolean, eventDetails: ChangeEventDetails<Reason>) => void;
    floatingId?: string | undefined;
    /**
     * Whether the popup is nested in another floating element.
     * @default false
     */
    nested?: boolean | undefined;
    /**
     * @default false
     */
    noEmit?: boolean | undefined;
    /**
     * @default false
     */
    treatPopupAsFloatingElement?: boolean | undefined;
    /**
     * Wraps the unmount after exit animations (`ReactDOM.flushSync` in React).
     */
    flush?: ((fn: () => void) => void) | undefined;
    /**
     * Called after the popup is unmounted.
     */
    onUnmount?: (() => void) | undefined;
    /**
     * Reads the open state followed by transitions (e.g. `!disabled && open`); defaults to the store's.
     */
    getTransitionOpen?: (() => boolean) | undefined;
    /**
     * Reads the open state used to pick an implicit active trigger (e.g. a group's); defaults to the store's.
     */
    getTriggerOpen?: (() => boolean) | undefined;
};

/**
 * The parts of a popup root shared by every popup (popover, dialog, menu, tooltip, select…):
 * controlled `open`/`triggerId`, callbacks, the synced floating root, mount/transition status
 * and the implicit active trigger.
 *
 * Component root machines compose it and add their own interactions.
 */
export class PopupRootController<State extends PopupStoreState<unknown>, Reason extends string = string> extends Connectable {
    readonly floatingRoot: FloatingRootStore<Reason>;

    readonly transitions: PopupTransitions<State>;

    private readonly store: AnyPopupStore<State>;

    private readonly setup: PopupRootControllerSetup<Reason>;

    private readonly connectFloatingRoot: () => () => void;

    constructor(store: AnyPopupStore<State>, setup: PopupRootControllerSetup<Reason>, options: PopupRootControllerOptions = {}) {
        super();
        this.store = store;
        this.setup = setup;
        this.setOptions(options);

        const { floatingRoot, connect } = createPopupFloatingRoot<State, Reason>(store, {
            floatingId: setup.floatingId,
            nested: setup.nested ?? false,
            noEmit: setup.noEmit,
            treatPopupAsFloatingElement: setup.treatPopupAsFloatingElement,
            onOpenChange: setup.setOpen
        });
        this.floatingRoot = floatingRoot;
        this.connectFloatingRoot = connect;
        this.transitions = new PopupTransitions(store, { onUnmount: setup.onUnmount, flush: setup.flush });
    }

    protected override onConnect() {
        const { store, setup } = this;
        // Published on connect: the parts read the floating root from the (possibly shared) store.
        store.set('floatingRootContext', this.floatingRoot as State['floatingRootContext']);
        this.addCleanup(this.connectFloatingRoot());
        this.addCleanup(this.transitions.start(setup.getTransitionOpen));
        // Created before the owner's effect, so it runs first after a change.
        this.addCleanup(effect(() => ensureImplicitActiveTrigger(store, setup.getTriggerOpen?.())));
    }

    setOptions(options: PopupRootControllerOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            const { store } = this;
            store.syncControlledValue('open', options.open as State['open'] | undefined);
            store.syncControlledValue('activeTriggerId', options.triggerId as State['activeTriggerId'] | undefined);
            store.setContextValue('onOpenChange', options.onOpenChange as never);
            store.setContextValue('onOpenChangeComplete', options.onOpenChangeComplete);
        });
    }

    /**
     * Unmounts the popup immediately, skipping exit animations (`actionsRef.unmount`).
     */
    unmount = () => {
        this.transitions.forceUnmount();
    };
}
