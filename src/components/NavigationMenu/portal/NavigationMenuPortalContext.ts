import * as React from 'react';

export const NavigationMenuPortalContext = React.createContext<boolean | undefined>(undefined);

export function useNavigationMenuPortalContext() {
    const value = React.use(NavigationMenuPortalContext);
    if (value === undefined) {
        throw new Error('Base UI: <NavigationMenu.Portal> is missing.');
    }
    return value;
}
