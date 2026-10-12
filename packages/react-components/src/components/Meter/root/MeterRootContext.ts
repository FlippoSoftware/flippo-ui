import React from 'react';

import type { MeterMachine } from '@flippo-software/core-components/meter';

export type MeterRootContextValue = {
    /**
     * The core machine of the meter (ARIA, formatting, indicator style).
     */
    meter: MeterMachine;
    /**
     * Formatted value of the component.
     */
    formattedValue: string;
    /**
     * The maximum value.
     */
    max: number;
    /**
     * The minimum value.
     */
    min: number;
    /**
     * Value of the component.
     */
    value: number | null;
};

export const MeterRootContext = React.createContext<MeterRootContextValue | undefined>(undefined);

export function useMeterRootContext() {
    const context = React.use(MeterRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: MeterRootContext is missing. Meter parts must be placed within <Meter.Root>.');
    }

    return context;
}
