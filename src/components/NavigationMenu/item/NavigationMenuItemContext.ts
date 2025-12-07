import * as React from 'react';

export type NavigationMenuItemContextValue = {
    value: any;
};

export const NavigationMenuItemContext = React.createContext<
  NavigationMenuItemContextValue | undefined
>(undefined);

export function useNavigationMenuItemContext() {
    const value = React.use(NavigationMenuItemContext);
    if (!value) {
        throw new Error(
            'Base UI: NavigationMenuItem parts must be used within a <NavigationMenu.Item>.'
        );
    }
    return value;
}
