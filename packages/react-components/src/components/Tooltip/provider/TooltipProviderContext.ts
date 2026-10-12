import React from 'react';

import type { TooltipProviderMachine } from '@flippo-software/core-components/tooltip';

export type TooltipProviderContextValue = TooltipProviderMachine;

export const TooltipProviderContext = React.createContext<TooltipProviderContextValue | undefined>(undefined);

export function useTooltipProviderContext(): TooltipProviderContextValue | undefined {
    return React.use(TooltipProviderContext);
}
