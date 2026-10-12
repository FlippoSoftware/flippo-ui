import * as React from 'react';

import type { NavigationMenuRootMachine } from '@flippo-software/core-components/navigation-menu';

export type NavigationMenuRootContextValue = NavigationMenuRootMachine;

export const NavigationMenuRootContext = React.createContext<NavigationMenuRootContextValue | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
    NavigationMenuRootContext.displayName = 'NavigationMenuRootContext';
}

function useNavigationMenuRootContext(optional?: false): NavigationMenuRootContextValue;
function useNavigationMenuRootContext(optional: true): NavigationMenuRootContextValue | undefined;
function useNavigationMenuRootContext(optional?: boolean) {
    const context = React.use(NavigationMenuRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: NavigationMenuRootContext is missing. Navigation Menu parts must be placed within <NavigationMenu.Root>.'
        );
    }
    return context;
}

/**
 * The root machine. Parts subscribe to what they read: `useMachineState` tracks `getState()`, `track` the rest.
 */
function useNavigationMenuRoot(): NavigationMenuRootMachine {
    return useNavigationMenuRootContext();
}

export const NavigationMenuTreeContext = React.createContext<string | undefined>(undefined);

function useNavigationMenuTreeContext() {
    return React.use(NavigationMenuTreeContext);
}

export { useNavigationMenuRoot, useNavigationMenuRootContext, useNavigationMenuTreeContext };
