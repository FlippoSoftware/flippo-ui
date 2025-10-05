import React from 'react';

import type { TabsRoot } from '../root/TabsRoot';

export type TabsListContextValue = {
    activateOnFocus: boolean;
    highlightedTabIndex: number;
    onTabActivation: (newValue: any, eventDetails: TabsRoot.ChangeEventDetails) => void;
    setHighlightedTabIndex: (index: number) => void;
    tabsListRef: React.RefObject<HTMLElement | null>;
};

export const TabsListContext = React.createContext<TabsListContextValue | undefined>(undefined);

export function useTabsListContext() {
    const context = React.use(TabsListContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: TabsListContext is missing. TabsList parts must be placed within <Tabs.List>.'
        );
    }

    return context;
}
