import { untracked } from '@flippo-software/store';

import { ListRegistry } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';

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

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TooltipMultipleOptions>({} as TooltipMultipleOptions);

    private get options(): TooltipMultipleOptions {
        return this.optionsStore.state;
    }

    private set options(options: TooltipMultipleOptions) {
        this.optionsStore.setState(options);
    }

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
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.store.setContextValue('onOpenChange', options.onOpenChange);
        });
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
