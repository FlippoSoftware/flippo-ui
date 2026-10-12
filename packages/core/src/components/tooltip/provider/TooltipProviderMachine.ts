import { untracked } from '@flippo-software/store';

import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';
import { FloatingDelayGroup } from '~@packages/floating-ui/FloatingDelayGroup';

export type TooltipProviderOptions = {
    /**
     * Delay before opening a tooltip of the group.
     */
    delay?: number | undefined;
    /**
     * Delay before closing a tooltip of the group.
     */
    closeDelay?: number | undefined;
    /**
     * Time (ms) during which another tooltip of the group opens instantly.
     * @default 400
     */
    timeout?: number | undefined;
};

/**
 * State machine of `Tooltip.Provider`: a delay group shared by its tooltips.
 */
export class TooltipProviderMachine extends Connectable {
    readonly delayGroup: FloatingDelayGroup;

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TooltipProviderOptions>({} as TooltipProviderOptions);

    private get options(): TooltipProviderOptions {
        return this.optionsStore.state;
    }

    private set options(options: TooltipProviderOptions) {
        this.optionsStore.setState(options);
    }

    constructor(options: TooltipProviderOptions = {}) {
        super();
        this.options = options;
        this.delayGroup = new FloatingDelayGroup({
            delay: { open: options.delay, close: options.closeDelay },
            timeoutMs: options.timeout ?? 400
        });
    }

    setOptions(options: TooltipProviderOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.delayGroup.setOptions({ delay: { open: options.delay, close: options.closeDelay }, timeoutMs: options.timeout ?? 400 });
        });
    }

    get delay() {
        return this.options.delay;
    }

    get closeDelay() {
        return this.options.closeDelay;
    }

    protected override onDisconnect() {
        this.delayGroup.destroy();
    }
}
