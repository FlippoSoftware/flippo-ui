import React from 'react';

export type MenuRadioItemContextValue = {
    checked: boolean;
    highlighted: boolean;
    disabled: boolean;
};

export const MenuRadioItemContext = React.createContext<MenuRadioItemContextValue | undefined>(
    undefined
);

export function useMenuRadioItemContext() {
    const context = React.use(MenuRadioItemContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: MenuRadioItemContext is missing. MenuRadioItem parts must be placed within <Menu.RadioItem>.'
        );
    }

    return context;
}
