import React from 'react';

import type { RadioCardRoot } from './RadioCardRoot';

export type RadioCardRootContextValue = RadioCardRoot.State;

export const RadioCardRootContext = React.createContext<RadioCardRootContextValue | undefined>(undefined);

export function useRadioCardRootContext() {
    const value = React.use(RadioCardRootContext);
    if (value === undefined) {
        throw new Error(
            'Headless UI: RadioCardRootContext is missing. RadioCard.Indicator must be placed within <RadioCard.Root>.'
        );
    }
    return value;
}
