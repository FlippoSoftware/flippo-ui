import * as React from 'react';

import type { NavigationMenuListMachine } from '@flippo-software/core-components/navigation-menu';

/**
 * The list machine: triggers get the reference props of its dismiss interaction.
 */
export const NavigationMenuDismissContext = React.createContext<NavigationMenuListMachine | undefined>(undefined);

export function useNavigationMenuDismissContext() {
    return React.use(NavigationMenuDismissContext);
}
