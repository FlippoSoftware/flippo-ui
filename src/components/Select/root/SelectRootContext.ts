import React from 'react';

import type { SelectRootMachine } from '@flippo-software/core-components/select';

export type SelectRootContextValue = SelectRootMachine;

export const SelectRootContext = React.createContext<SelectRootContextValue | null>(null);

export function useSelectRootContext() {
    const context = React.use(SelectRootContext);
    if (context === null) {
        throw new Error('Headless UI: SelectRootContext is missing. Select parts must be placed within <Select.Root>.');
    }

    return context;
}

/**
 * The root machine. Parts subscribe to what they read: `useMachineState` tracks `getState()`, `track` the rest.
 */
export function useSelectRoot(): SelectRootMachine {
    return useSelectRootContext();
}
