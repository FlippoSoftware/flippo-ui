import React from 'react';

import type { Align, Side } from '~@lib/hooks';
import type { FloatingContext } from '~@packages/floating-ui-react';

export type PopoverPositionerContextValue = {
    side: Side;
    align: Align;
    arrowRef: React.RefObject<Element | null>;
    arrowUncentered: boolean;
    arrowStyles: React.CSSProperties;
    context: FloatingContext;
};

export const PopoverPositionerContext = React.createContext<PopoverPositionerContextValue | undefined>(
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
