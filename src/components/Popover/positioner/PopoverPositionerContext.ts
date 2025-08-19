'use client';

import React from 'react';

import type { TAlign, TSide } from '@lib/hooks';
import type { FloatingContext } from '@packages/floating-ui-react';

export type TPopoverPositionerContext = {
    side: TSide;
    align: TAlign;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
    context: FloatingContext;
};

export const PopoverPositionerContext = React.createContext<TPopoverPositionerContext | undefined>(
    undefined
);

export function usePopoverPositionerContext() {
    const context = React.use(PopoverPositionerContext);

    if (!context) {
        throw new Error(
            'Headless UI: PopoverPositionerContext is missing. PopoverPositioner parts must be placed within <Popover.Positioner>.'
        );
    }
    return context;
}
