import React from 'react';

export const DrawerPortalContext = React.createContext<boolean | undefined>(undefined);

export function useDrawerPortalContext() {
    const value = React.use(DrawerPortalContext);

    if (value === undefined) {
        throw new Error('Headless UI: <Drawer.Portal> is missing.');
    }

    return value;
}
