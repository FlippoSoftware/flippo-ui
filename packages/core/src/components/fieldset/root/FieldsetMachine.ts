import { Store, untracked } from '@flippo-software/store';

import { getStyleHookProps } from '~@attributes/getStyleHookProps';
import { OptionsStore } from '~@lib/OptionsStore';

export type FieldsetState = {
    disabled: boolean;
};

export type FieldsetOptions = {
    /**
     * @default false
     */
    disabled?: boolean | undefined;
};

/**
 * Groups a legend with fields; disables every field inside when disabled.
 */
export class FieldsetMachine {
    readonly store = new Store<{ legendId: string | undefined }>({ legendId: undefined });

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<FieldsetOptions>({} as FieldsetOptions);

    private get options(): FieldsetOptions {
        return this.optionsStore.state;
    }

    private set options(options: FieldsetOptions) {
        this.optionsStore.setState(options);
    }

    constructor(options: FieldsetOptions = {}) {
        this.options = options;
    }

    setOptions(options: FieldsetOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    get disabled() {
        return this.options.disabled ?? false;
    }

    getState(): FieldsetState {
        return { disabled: this.disabled };
    }

    setLegendId = (legendId: string | undefined) => {
        this.store.set('legendId', legendId);
    };

    getRootProps() {
        return { 'aria-labelledby': this.store.state.legendId, ...getStyleHookProps(this.getState()) };
    }

    static legendAttrs(state: FieldsetState, id: string) {
        return { id, ...getStyleHookProps(state) };
    }
}
