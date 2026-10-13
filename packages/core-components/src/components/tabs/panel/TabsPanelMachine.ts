import { Store, untracked } from '@flippo-software/store';

import { ListRegistryItem } from '~@components/composite/list/ListRegistry';
import { Connectable } from '~@lib/Connectable';
import { OptionsStore } from '~@lib/OptionsStore';

import type { Props } from '~@props/mergeProps';

import type { TabsMachine, TabsState, TabsValue } from '../root/TabsMachine';

import { TabsPanelDataAttributes } from './TabsPanelDataAttributes';

export type TabsPanelState = TabsState & {
    hidden: boolean;
};

export type TabsPanelMetadata = {
    id?: string | undefined;
    value: TabsValue | undefined;
};

export type TabsPanelOptions = {
    value?: TabsValue | undefined;
    /**
     * @default false
     */
    keepMounted?: boolean | undefined;
    /**
     * Generated id of the panel.
     */
    id: string;
};

/**
 * One tab panel.
 */
export class TabsPanelMachine extends Connectable {
    readonly listItem: ListRegistryItem<TabsPanelMetadata>;

    readonly store = new Store({ index: -1 });

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TabsPanelOptions>({} as TabsPanelOptions);

    private get options(): TabsPanelOptions {
        return this.optionsStore.state;
    }

    private set options(options: TabsPanelOptions) {
        this.optionsStore.setState(options);
    }

    private readonly tabs: TabsMachine;

    constructor(tabs: TabsMachine, options: TabsPanelOptions) {
        super();
        this.tabs = tabs;
        this.options = options;
        this.listItem = new ListRegistryItem(tabs.panelRegistry, {
            metadata: { id: options.id, value: options.value },
            onIndexChange: (index) => this.store.set('index', index)
        });
    }

    protected override onConnect() {
        this.connectChild(this.listItem);
    }

    setOptions(options: TabsPanelOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.listItem.setMetadata({ id: options.id, value: options.value });
        });
    }

    get hidden() {
        return (this.options.value ?? this.store.state.index) !== this.tabs.value;
    }

    /**
     * Whether the panel children are rendered.
     */
    get rendersChildren() {
        return !this.hidden || (this.options.keepMounted ?? false);
    }

    getState(): TabsPanelState {
        return { ...this.tabs.getState(), hidden: this.hidden };
    }

    getProps(): Props {
        const index = this.store.state.index;
        const hidden = this.hidden;
        return {
            'aria-labelledby': this.tabs.getTabIdByPanelValueOrIndex(this.options.value, index),
            hidden,
            id: this.options.id,
            role: 'tabpanel',
            tabIndex: hidden ? -1 : 0,
            [TabsPanelDataAttributes.index]: index
        };
    }

    setElement = (element: HTMLElement | null) => {
        this.listItem.setElement(element);
    };

    protected override onDisconnect() {}
}
