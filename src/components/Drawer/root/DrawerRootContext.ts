import React from 'react';

import type { DrawerStore } from '@flippo-software/core-components/drawer';

export type DrawerRootContextValue = {
    store: DrawerStore;
};

export const DrawerRootContext = React.createContext<DrawerRootContextValue | undefined>(undefined);

export function useDrawerRootContext(optional?: false): DrawerRootContextValue;
export function useDrawerRootContext(optional: true): DrawerRootContextValue | undefined;
export function useDrawerRootContext(optional?: boolean) {
    const drawerRootContext = React.use(DrawerRootContext);

    if (optional === false && drawerRootContext === undefined) {
        throw new Error('Headless UI: DrawerRootContext is missing. Drawer parts must be placed within <Drawer.Root>.');
    }

    return drawerRootContext;
}
