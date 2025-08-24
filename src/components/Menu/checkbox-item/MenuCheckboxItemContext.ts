import React from 'react';

export type TMenuCheckboxItemContext = {
    checked: boolean;
    highlighted: boolean;
    disabled: boolean;
};

export const MenuCheckboxItemContext = React.createContext<TMenuCheckboxItemContext | undefined>(
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
