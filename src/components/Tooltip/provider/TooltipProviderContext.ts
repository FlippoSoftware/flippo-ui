import React from 'react';

export type TooltipProviderContextValue = {
    delay: number | undefined;
    closeDelay: number | undefined;
};

export const TooltipProviderContext = React.createContext<TooltipProviderContextValue | undefined>(undefined);

export function useTooltipProviderContext(): TooltipProviderContextValue | undefined {
    const context = React.use(TooltipProviderContext);

    return context;
}
