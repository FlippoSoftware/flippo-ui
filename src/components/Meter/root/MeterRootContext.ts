'use client';

import React from 'react';

export type TMeterRootContext = {
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
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const MeterRootContext = React.createContext<TMeterRootContext | undefined>(undefined);

export function useMeterRootContext() {
    const context = React.use(MeterRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: MeterRootContext is missing. Meter parts must be placed within <Meter.Root>.');
    }

    return context;
}
