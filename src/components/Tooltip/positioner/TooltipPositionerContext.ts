import React from 'react';

import type { TooltipPositionerMachine } from '@flippo-software/core-components/tooltip';

export type TooltipPositionerContextValue = {
    positioner: TooltipPositionerMachine<unknown>;
};

export const TooltipPositionerContext = React.createContext<TooltipPositionerContextValue | undefined>(undefined);

export function useTooltipPositionerContext() {
    const context = React.use(TooltipPositionerContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: TooltipPositionerContext is missing. TooltipPositioner parts must be placed within <Tooltip.Positioner>.'
        );
    }

    return context;
}
