import React from 'react';

export type MenuGroupContextValue = {
    setLabelId: (id: string | undefined) => void;
};

export const MenuGroupContext = React.createContext<MenuGroupContextValue | undefined>(undefined);

export function useMenuGroupRootContext() {
    const context = React.use(MenuGroupContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: MenuGroupRootContext is missing. Menu group parts must be used within <Menu.Group>.'
        );
    }

    return context;
}
