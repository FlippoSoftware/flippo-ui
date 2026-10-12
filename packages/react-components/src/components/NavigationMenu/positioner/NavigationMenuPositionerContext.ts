import React from 'react';

import type { NavigationMenuPositionerMachine } from '@flippo-software/core-components/navigation-menu';

export type NavigationMenuPositionerContextValue = {
    positioner: NavigationMenuPositionerMachine;
};

export const NavigationMenuPositionerContext = React.createContext<NavigationMenuPositionerContextValue | undefined>(undefined);

export function useNavigationMenuPositionerContext(optional: true): NavigationMenuPositionerContextValue | undefined;
export function useNavigationMenuPositionerContext(optional?: false): NavigationMenuPositionerContextValue;
export function useNavigationMenuPositionerContext(optional = false) {
    const context = React.use(NavigationMenuPositionerContext);
    if (!context && !optional) {
        throw new Error(
            'Headless UI: NavigationMenuPositionerContext is missing. NavigationMenuPositioner parts must be placed within <NavigationMenu.Positioner>.'
        );
    }

    return context;
}
