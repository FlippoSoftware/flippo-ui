import React from 'react';

import type { MenuPositionerMachine } from '@flippo-software/core-components/menu';

export type MenuPositionerContextValue = {
    positioner: MenuPositionerMachine<unknown>;
    /**
     * The floating tree node ID of the menu.
     */
    nodeId: string | undefined;
};

export const MenuPositionerContext = React.createContext<MenuPositionerContextValue | undefined>(undefined);

export function useMenuPositionerContext(optional?: false): MenuPositionerContextValue;
export function useMenuPositionerContext(optional: true): MenuPositionerContextValue | undefined;
export function useMenuPositionerContext(optional?: boolean) {
    const context = React.use(MenuPositionerContext);
    if (context === undefined && !optional) {
        throw new Error('Base UI: MenuPositionerContext is missing. MenuPositioner parts must be placed within <Menu.Positioner>.');
    }
    return context;
}
