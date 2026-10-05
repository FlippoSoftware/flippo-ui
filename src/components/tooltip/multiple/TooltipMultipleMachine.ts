import { ListRegistry } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';

import { TooltipMultipleStore } from '../store/TooltipMultipleStore';

import type { TooltipChangeEventDetails } from '../store/TooltipStore';

export type TooltipMultipleOptions = {
    open?: boolean | undefined;
    /**
     * @default false
     */
    defaultOpen?: boolean | undefined;
    onOpenChange?: ((open: boolean, eventDetails: TooltipChangeEventDetails) => void) | undefined;
    disabled?: boolean | undefined;
    delay?: number | undefined;
    closeDelay?: number | undefined;
};

/**
 * State machine of `Tooltip.Multiple`: a group of tooltips sharing one open state.
 * Each `Tooltip.Root` inside registers its store and a list item (for the active index).
 */
export class TooltipMultipleMachine extends Connectable {
    readonly store: TooltipMultipleStore;

    readonly registry = new ListRegistry();

    private options: TooltipMultipleOptions;

    constructor(options: TooltipMultipleOptions = {}) {
        super();
        this.options = options;
        this.store = new TooltipMultipleStore(options.open ?? options.defaultOpen ?? false);
        this.store.setContextValue('onOpenChange', options.onOpenChange);
    }

    protected override onConnect() {
        this.connectChild(this.registry);
    }

    setOptions(options: TooltipMultipleOptions) {
        this.options = options;
        this.store.setContextValue('onOpenChange', options.onOpenChange);
    }

    get disabled() {
        return this.options.disabled;
    }

    get delay() {
        return this.options.delay;
    }

    get closeDelay() {
        return this.options.closeDelay;
    }

    protected override onDisconnect() {}
}
