import React from 'react';

import type { MenuRoot } from '../root/MenuRoot';

export type MenuRadioGroupContextValue = {
    value: any;
    setValue: (newValue: any, eventDetails: MenuRoot.ChangeEventDetails) => void;
    disabled: boolean;
};

export const MenuRadioGroupContext = React.createContext<MenuRadioGroupContextValue | undefined>(
    undefined
);

export function useMenuRadioGroupContext() {
    const context = React.use(MenuRadioGroupContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: MenuRadioGroupContext is missing. MenuRadioGroup parts must be placed within <Menu.RadioGroup>.'
        );
    }

    return context;
}
