'use client';

import React from 'react';

export type TTooltipProviderContext = {
    delay: number | undefined;
    closeDelay: number | undefined;
};

export const TooltipProviderContext = React.createContext<TTooltipProviderContext | undefined>(undefined);

export function useTooltipProviderContext(): TTooltipProviderContext | undefined {
    const context = React.use(TooltipProviderContext);

    return context;
}
