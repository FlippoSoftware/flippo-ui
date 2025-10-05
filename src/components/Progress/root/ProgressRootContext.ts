import React from 'react';

import type { ProgressRoot } from './ProgressRoot';

export type ProgressRootContextValue = {
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
    state: ProgressRoot.State;
    status: ProgressRoot.Status;
};

export const ProgressRootContext = React.createContext<ProgressRootContextValue | undefined>(undefined);

export function useProgressRootContext() {
    const context = React.use(ProgressRootContext);

    if (context === undefined) {
        throw new Error('Headless UI: ProgressRootContext is missing. Progress parts must be placed within <Progress.Root>.');
    }

    return context;
}
