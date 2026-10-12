import React from 'react';

import type { MenuStore } from '@flippo-software/core-components/menu';

export const MenuSubmenuRootContext = React.createContext<MenuSubmenuRootContextValue | undefined>(undefined);

export type MenuSubmenuRootContextValue = {
    parentMenu: MenuStore<unknown>;
};

export function useMenuSubmenuRootContext(): MenuSubmenuRootContextValue | undefined {
    return React.use(MenuSubmenuRootContext);
}
