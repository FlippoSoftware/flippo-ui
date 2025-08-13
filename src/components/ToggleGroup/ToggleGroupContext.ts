'use client';

import React from 'react';

import type { Orientation } from '@lib/types';

export type TToggleGroupContext = {
    value: readonly any[];
    setGroupValue: (newValue: string, nextPressed: boolean, event: Event) => void;
    disabled: boolean;
    orientation: Orientation;
};

export const ToggleGroupContext = React.createContext<TToggleGroupContext | undefined>(undefined);

export function useToggleGroupContext(optional = true) {
    const context = React.use(ToggleGroupContext);

    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: ToggleGroupContext is missing. ToggleGroup parts must be placed within <ToggleGroup>.'
        );
    }

    return context;
}
