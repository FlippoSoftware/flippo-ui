import React from 'react';

import type { MenuStore } from '../store/MenuStore';

export const MenuSubmenuRootContext = React.createContext<MenuSubmenuRootContextValue | undefined>(
    undefined
);

export type MenuSubmenuRootContextValue = {
    parentMenu: MenuStore<unknown>;
};

export function useMenuSubmenuRootContext(): MenuSubmenuRootContextValue | undefined {
    return React.use(MenuSubmenuRootContext);
}
