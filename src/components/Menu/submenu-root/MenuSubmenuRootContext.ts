import React from 'react';

export const MenuSubmenuRootContext = React.createContext(false);

export function useMenuSubmenuRootContext(): boolean {
    return React.use(MenuSubmenuRootContext);
}
