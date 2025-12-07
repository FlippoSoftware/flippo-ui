import React from 'react';

import type { Align, Side } from '~@lib/hooks';

export type TooltipPositionerContextValue = {
    open: boolean;
    side: Side;
    align: Align;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
};

export const TooltipPositionerContext = React.createContext<TooltipPositionerContextValue | undefined>(
    undefined
);

export function useTooltipPositionerContext() {
    const context = React.use(TooltipPositionerContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: TooltipPositionerContext is missing. TooltipPositioner parts must be placed within <Tooltip.Positioner>.'
        );
    }

    return context;
}
