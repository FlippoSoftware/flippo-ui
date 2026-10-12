import { Store } from '@flippo-software/store';

import { ListRegistryItem } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';

import type { ToolbarGroupMachine } from '../group/ToolbarGroupMachine';
import type { ToolbarMachine, ToolbarState } from '../root/ToolbarMachine';

export type ToolbarItemState = ToolbarState & {
    focusable: boolean;
};

export type ToolbarItemMetadata = {
    focusableWhenDisabled: boolean;
};

export type ToolbarItemOptions = {
    /**
     * @default false
     */
    disabled?: boolean | undefined;
    /**
     * @default true
     */
    focusableWhenDisabled?: boolean | undefined;
    /**
     * @default true
     */
    nativeButton?: boolean | undefined;
    group?: ToolbarGroupMachine | null | undefined;
};

/**
 * Base of toolbar items: composite registration and disabled state.
 */
export class ToolbarItemBase extends Connectable {
    readonly listItem: ListRegistryItem<ToolbarItemMetadata>;

    readonly store = new Store({ index: -1 });

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    protected readonly optionsStore = new OptionsStore<ToolbarItemOptions>({} as ToolbarItemOptions);

    protected get options(): ToolbarItemOptions {
        return this.optionsStore.state;
    }

    protected set options(options: ToolbarItemOptions) {
        this.optionsStore.setState(options);
    }

    protected readonly toolbar: ToolbarMachine;

    constructor(toolbar: ToolbarMachine, options: ToolbarItemOptions, metadata: ToolbarItemMetadata) {
        super();
        this.toolbar = toolbar;
        this.options = options;
        this.listItem = new ListRegistryItem(toolbar.registry, { metadata, onIndexChange: (index) => this.store.set('index', index) });
    }

    protected override onConnect() {
        this.connectChild(this.listItem);
    }

    get disabled() {
        return this.toolbar.disabled || (this.options.group?.disabled ?? false) || (this.options.disabled ?? false);
    }

    get focusableWhenDisabled() {
        return this.options.focusableWhenDisabled ?? true;
    }

    getState(): ToolbarItemState {
        return { disabled: this.disabled, orientation: this.toolbar.orientation, focusable: this.focusableWhenDisabled };
    }

    protected getCompositeItemProps() {
        return this.toolbar.composite.getItemProps(this.store.state.index);
    }

    protected override onDisconnect() {}
}
