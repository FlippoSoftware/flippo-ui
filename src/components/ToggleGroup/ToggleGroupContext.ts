import React from 'react';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIEventReasons } from '~@lib/reason';
import type { Orientation } from '~@lib/types';

export type ToggleGroupContextValue = {
    value: readonly any[];
    setGroupValue: (
        newValue: string,
        nextPressed: boolean,
        eventDetails: HeadlessUIChangeEventDetails<HeadlessUIEventReasons['none']>,
    ) => void;
    disabled: boolean;
    orientation: Orientation;
};

export const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(undefined);

export function useToggleGroupContext(optional = true) {
    const context = React.use(ToggleGroupContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Base UI: ToggleGroupContext is missing. ToggleGroup parts must be placed within <ToggleGroup>.'
        );
    }

    return context;
}
