import React from 'react';

import type { SwitchRoot } from './SwitchRoot';

export type SwitchRootContextValue = SwitchRoot.State;

export const SwitchRootContext = React.createContext<SwitchRootContextValue | undefined>(undefined);

export function useSwitchRootContext() {
    const context = React.use(SwitchRootContext);

    if (context === undefined) {
        throw new Error(
            'Headless UI: SwitchRootContext is missing. Switch parts must be placed within <Switch.Root>.'
        );
    }

    return context;
}
