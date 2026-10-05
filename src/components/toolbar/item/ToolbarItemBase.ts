import { ListRegistryItem } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';
import { Store } from '~@store/Store';

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

    protected options: ToolbarItemOptions;

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
