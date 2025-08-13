'use client';

import React from 'react';

export type TTabsListContext = {
    activateOnFocus: boolean;
    highlightedTabIndex: number;
    onTabActivation: (newValue: any, event: Event) => void;
    setHighlightedTabIndex: (index: number) => void;
    tabsListRef: React.RefObject<HTMLElement | null>;
};

export const TabsListContext = React.createContext<TTabsListContext | undefined>(undefined);

export function useTabsListContext() {
    const context = React.use(TabsListContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: TabsListContext is missing. TabsList parts must be placed within <Tabs.List>.'
        );
    }

    return context;
}
