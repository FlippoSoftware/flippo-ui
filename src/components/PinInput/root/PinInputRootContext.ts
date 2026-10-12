import React from 'react';

import type { PinInputMachine } from '@flippo-software/core-components/pin-input';

import type { PinInputRoot } from './PinInputRoot';

export type PinInputRootContextValue = {
    /**
     * The core machine: values, pins, focus routing and field integration.
     */
    pinInput: PinInputMachine;
    state: PinInputRoot.State;
};

export const PinInputRootContext = React.createContext<PinInputRootContextValue | null>(null);

export function usePinInputRootContext() {
    const context = React.use(PinInputRootContext);
    if (context === null) {
        throw new Error('Headless UI: PinInputRootContext is missing. PinInput parts must be placed within <PinInput.Root>.');
    }
    return context;
}
