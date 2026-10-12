import { Store, untracked } from '@flippo-software/store';

import { CompositeRootMachine } from '~@components/composite/root/CompositeRootMachine';
import { Connectable } from '~@lib/Connectable';
import { EMPTY_ARRAY } from '~@lib/constants';
import { OptionsStore } from '~@lib/OptionsStore';
import { mergeProps } from '~@props/mergeProps';

import type { ListRegistryMap } from '~@components/composite/list/ListRegistry';
import type { Props } from '~@props/mergeProps';

import type { TabsActivationDirection, TabsChangeEventDetails, TabsMachine, TabsState, TabsValue } from '../root/TabsMachine';
import type { TabsTabMetadata } from '../tab/TabsTabMachine';

function getInset(tab: HTMLElement, tabsList: HTMLElement) {
    const { left: tabLeft, top: tabTop } = tab.getBoundingClientRect();
    const { left: listLeft, top: listTop } = tabsList.getBoundingClientRect();
    return { left: tabLeft - listLeft, top: tabTop - listTop };
}

export type TabsListOptions = {
    /**
     * @default false
     */
    activateOnFocus?: boolean | undefined;
    /**
     * @default true
     */
    loopFocus?: boolean | undefined;
};

/**
 * The tab list: roving focus over the tabs and detection of the activation direction.
 */
export class TabsListMachine extends Connectable {
    readonly composite: CompositeRootMachine;

    readonly store = new Store<{ highlightedTabIndex: number; listElement: HTMLElement | null }>({
        highlightedTabIndex: 0,
        listElement: null
    });

    /**
     * The options, in a store: computed values and effects reading them follow their changes, key by key.
     */
    private readonly optionsStore = new OptionsStore<TabsListOptions>({} as TabsListOptions);

    private get options(): TabsListOptions {
        return this.optionsStore.state;
    }

    private set options(options: TabsListOptions) {
        this.optionsStore.setState(options);
    }

    private readonly tabs: TabsMachine;

    private previousTabEdge: number | null = null;

    constructor(tabs: TabsMachine, options: TabsListOptions = {}) {
        super();
        this.tabs = tabs;
        this.options = options;
        this.composite = new CompositeRootMachine(this.getCompositeOptions());
        this.composite.registry.setOptions({
            onMapChange: (map) => {
                // Replaces the composite's own handler, which still highlights the item marked active.
                this.composite.onMapChange(map);
                this.tabs.setTabMap(map as ListRegistryMap<TabsTabMetadata>);
            }
        });
        this.syncPreviousTabEdge();
    }

    protected override onConnect() {
        this.connectChild(this.composite);
    }

    setOptions(options: TabsListOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
            this.composite.setOptions(this.getCompositeOptions());
        });
    }

    /**
     * Records the active tab's position (to tell the activation direction). Adapters call it after committing a
     * render: it measures the layout.
     */
    afterCommit() {
        this.syncPreviousTabEdge();
    }

    private getCompositeOptions() {
        return {
            highlightedIndex: this.store.state.highlightedTabIndex,
            onHighlightedIndexChange: this.setHighlightedTabIndex,
            enableHomeAndEndKeys: true,
            loopFocus: this.options.loopFocus ?? true,
            orientation: this.tabs.orientation,
            direction: this.tabs.direction,
            disabledIndices: EMPTY_ARRAY as number[]
        };
    }

    get activateOnFocus() {
        return this.options.activateOnFocus ?? false;
    }

    get highlightedTabIndex() {
        return this.store.state.highlightedTabIndex;
    }

    get listElement() {
        return this.store.state.listElement;
    }

    setHighlightedTabIndex = (index: number) => {
        this.store.set('highlightedTabIndex', index);
        this.composite.setOptions(this.getCompositeOptions());
    };

    setListElement = (element: HTMLElement | null) => {
        this.store.set('listElement', element);
        this.composite.setRoot(element);
        this.syncPreviousTabEdge();
    };

    getState(): TabsState {
        return this.tabs.getState();
    }

    getRootProps(elementProps: Props = {}): Props {
        return mergeProps(
            this.composite.getRootProps(),
            { 'aria-orientation': this.tabs.orientation === 'vertical' ? 'vertical' : undefined, role: 'tablist' },
            elementProps
        );
    }

    /**
     * Records the position of the active tab (call when the value, orientation or tabs change).
     */
    syncPreviousTabEdge() {
        const value = this.tabs.value;
        const listElement = this.listElement;
        if (value == null || listElement == null) {
            this.previousTabEdge = null;
            return;
        }

        const activeTab = this.tabs.getTabElementBySelectedValue(value);
        if (activeTab == null) {
            this.previousTabEdge = null;
            return;
        }

        const { left, top } = getInset(activeTab, listElement);
        this.previousTabEdge = this.tabs.orientation === 'horizontal' ? left : top;
    }

    private detectActivationDirection(newValue: TabsValue): TabsActivationDirection {
        const listElement = this.listElement;
        const orientation = this.tabs.orientation;

        if (newValue === this.tabs.value) {
            return 'none';
        }

        if (newValue == null) {
            this.previousTabEdge = null;
            return 'none';
        }

        if (listElement != null) {
            const activeTabElement = this.tabs.getTabElementBySelectedValue(newValue);

            if (activeTabElement != null) {
                const { left, top } = getInset(activeTabElement, listElement);
                const previousTabEdge = this.previousTabEdge;

                if (previousTabEdge == null) {
                    this.previousTabEdge = orientation === 'horizontal' ? left : top;
                    return 'none';
                }

                if (orientation === 'horizontal') {
                    if (left < previousTabEdge) {
                        this.previousTabEdge = left;
                        return 'left';
                    }
                    if (left > previousTabEdge) {
                        this.previousTabEdge = left;
                        return 'right';
                    }
                } else if (top < previousTabEdge) {
                    this.previousTabEdge = top;
                    return 'up';
                } else if (top > previousTabEdge) {
                    this.previousTabEdge = top;
                    return 'down';
                }
            }
        }

        return 'none';
    }

    onTabActivation = (newValue: TabsValue, eventDetails: TabsChangeEventDetails) => {
        if (newValue !== this.tabs.value) {
            eventDetails.activationDirection = this.detectActivationDirection(newValue);
            this.tabs.onValueChange(newValue, eventDetails);
        }
    };

    protected override onDisconnect() {}
}
