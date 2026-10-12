import React from 'react';

import type { TooltipMultipleMachine } from '@flippo-software/core-components/tooltip';

export type TooltipMultipleContextValue = TooltipMultipleMachine;

export const TooltipMultipleContext = React.createContext<TooltipMultipleContextValue | null>(null);

export function useTooltipMultipleContext(): TooltipMultipleContextValue | null {
    return React.use(TooltipMultipleContext);
}
