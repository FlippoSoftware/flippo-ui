import React from 'react';

export const TooltipPortalContext = React.createContext<boolean | undefined>(undefined);

export function useTooltipPortalContext() {
    const value = React.use(TooltipPortalContext);

    if (value === undefined) {
        throw new Error('Flipoo headless UI: <Tooltip.Portal> is missing.');
    }

    return value;
}
