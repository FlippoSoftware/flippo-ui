import React from 'react';

import type { TooltipMultipleStore } from './TooltipMultipleStore';

export type TooltipMultipleContextValue = {
    store: TooltipMultipleStore;
    /**
     * Common disabled state for all tooltips in the group.
     */
    disabled?: boolean;
    /**
     * Common open delay for all triggers in the group.
     */
    delay?: number;
    /**
     * Common close delay for all triggers in the group.
     */
    closeDelay?: number;
};

export const TooltipMultipleContext = React.createContext<TooltipMultipleContextValue | null>(null);

export function useTooltipMultipleContext(): TooltipMultipleContextValue | null {
    return React.use(TooltipMultipleContext);
}
