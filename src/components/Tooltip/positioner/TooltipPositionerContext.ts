'use client';

import React from 'react';

import type { TAlign, TSide } from '@lib/hooks';

export type TTooltipPositionerContext = {
    open: boolean;
    side: TSide;
    align: TAlign;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
};

export const TooltipPositionerContext = React.createContext<TTooltipPositionerContext | undefined>(undefined);

export function useTooltipPositionerContext() {
    const context = React.use(TooltipPositionerContext);

    if (!context) {
        throw new Error('Flippo headless UI: TooltipPositionerContext is missing. TooltipPositioner parts must be placed within <Tooltip.Positioner>.');
    }

    return context;
}
