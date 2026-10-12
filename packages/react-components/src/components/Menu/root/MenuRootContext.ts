import React from 'react';

import type { MenuParent, MenuRootMachine, MenuStore } from '@flippo-software/core-components/menu';

export type MenuRootContextValue<Payload = unknown> = {
    store: MenuStore<Payload>;
    parent: MenuParent;
    root: MenuRootMachine<Payload>;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | undefined>(undefined);

export function useMenuRootContext(optional?: false): MenuRootContextValue;
export function useMenuRootContext(optional: true): MenuRootContextValue | undefined;
export function useMenuRootContext(optional?: boolean) {
    const context = React.use(MenuRootContext);
    if (context === undefined && !optional) {
        throw new Error('Headless UI: MenuRootContext is missing. Menu parts must be placed within <Menu.Root>.');
    }

    return context;
}
