import React from 'react';

import type { TooltipStore } from '../store/TooltipStore';

export type TooltipRootContextValue<Payload = unknown> = TooltipStore<Payload>;

export const TooltipRootContext = React.createContext<TooltipRootContextValue | undefined>(undefined);

export function useTooltipRootContext(optional?: false): TooltipRootContextValue;
export function useTooltipRootContext(optional: true): TooltipRootContextValue | undefined;
export function useTooltipRootContext(optional?: boolean) {
    const context = React.use(TooltipRootContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: TooltipRootContext is missing. Tooltip parts must be placed within <Tooltip.Root>.'
        );
    }

    return context;
}
