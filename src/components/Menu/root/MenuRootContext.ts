import React from 'react';

import type { MenuStore } from '../store/MenuStore';

import type { MenuParent } from './MenuRoot';

export type MenuRootContextValue<Payload = unknown> = {
    store: MenuStore<Payload>;
    parent: MenuParent;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | undefined>(undefined);

export function useMenuRootContext(optional?: false): MenuRootContextValue;
export function useMenuRootContext(optional: true): MenuRootContextValue | undefined;
export function useMenuRootContext(optional?: boolean) {
    const context = React.use(MenuRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: MenuRootContext is missing. Menu parts must be placed within <Menu.Root>.'
        );
    }

    return context;
}
