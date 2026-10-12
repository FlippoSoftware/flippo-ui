import React from 'react';

import type { MenuRadioGroupMachine } from '@flippo-software/core-components/menu';

export type MenuRadioGroupContextValue = MenuRadioGroupMachine;

export const MenuRadioGroupContext = React.createContext<MenuRadioGroupContextValue | undefined>(undefined);

export function useMenuRadioGroupContext() {
    const context = React.use(MenuRadioGroupContext);
    if (context === undefined) {
        throw new Error('Headless UI: MenuRadioGroupContext is missing. MenuRadioGroup parts must be placed within <Menu.RadioGroup>.');
    }

    return context;
}
