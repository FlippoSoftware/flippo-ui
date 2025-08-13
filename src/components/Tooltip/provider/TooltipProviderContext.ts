'use client';

import React from 'react';

export type TTooltipProviderContext = {
    delay: number | undefined;
    closeDelay: number | undefined;
};

export const TooltipProviderContext = React.createContext<TTooltipProviderContext | undefined>(undefined);

export function useTooltipProviderContext(): TTooltipProviderContext {
    const context = React.use(TooltipProviderContext);

    if (!context) {
        throw new Error('TooltipProvider is not defined');
    }

    return context;
}
