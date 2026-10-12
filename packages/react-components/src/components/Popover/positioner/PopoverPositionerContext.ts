import React from 'react';

import type { PopoverPositionerMachine } from '@flippo-software/core-components/popover';

export type PopoverPositionerContextValue = {
    positioner: PopoverPositionerMachine<unknown>;
};

export const PopoverPositionerContext = React.createContext<PopoverPositionerContextValue | undefined>(undefined);

export function usePopoverPositionerContext() {
    const context = React.use(PopoverPositionerContext);
    if (!context) {
        throw new Error(
            'Headless UI: PopoverPositionerContext is missing. PopoverPositioner parts must be placed within <Popover.Positioner>.'
        );
    }
    return context;
}
