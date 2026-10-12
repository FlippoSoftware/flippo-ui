import React from 'react';

import type { NumberFieldScrubAreaMachine } from '@flippo-software/core-components/number-field';

export type NumberFieldScrubAreaContextValue = {
    /**
     * The core machine of the scrub area (pointer lock, cursor position).
     */
    scrubArea: NumberFieldScrubAreaMachine;
};

export const NumberFieldScrubAreaContext = React.createContext<NumberFieldScrubAreaContextValue | undefined>(undefined);

export function useNumberFieldScrubAreaContext() {
    const context = React.use(NumberFieldScrubAreaContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: NumberFieldScrubAreaContext is missing. NumberFieldScrubArea parts must be placed within <NumberField.ScrubArea>.'
        );
    }
    return context;
}
