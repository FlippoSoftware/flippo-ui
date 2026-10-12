import React from 'react';

import type { ProgressMachine } from '@flippo-software/core-components/progress';

import type { ProgressRoot } from './ProgressRoot';

export type ProgressRootContextValue = {
    /**
     * The core machine of the progress bar (ARIA, formatting, status, indicator style).
     */
    progress: ProgressMachine;
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
