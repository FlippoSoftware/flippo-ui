import React from 'react';

export type MenuCheckboxItemContextValue = {
    checked: boolean;
    highlighted: boolean;
    disabled: boolean;
};

export const MenuCheckboxItemContext = React.createContext<MenuCheckboxItemContextValue | undefined>(
    undefined
);

export function useMenuCheckboxItemContext() {
    const context = React.use(MenuCheckboxItemContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: MenuCheckboxItemContext is missing. MenuCheckboxItem parts must be placed within <Menu.CheckboxItem>.'
        );
    }

    return context;
}
