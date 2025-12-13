import React from 'react';

import type { TooltipMultipleStore } from './TooltipMultipleStore';

export type TooltipMultipleContextValue = {
    store: TooltipMultipleStore;
};

export const TooltipMultipleContext = React.createContext<TooltipMultipleContextValue | null>(null);

export function useTooltipMultipleContext(): TooltipMultipleContextValue | null {
    return React.use(TooltipMultipleContext);
}
