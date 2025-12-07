import React from 'react';

import type { Side, useAnchorPositioning } from '~@lib/hooks';

export type SelectPositionerContextValue = {
    side: 'none' | Side;
    alignItemWithTriggerActive: boolean;
    setControlledAlignItemWithTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    scrollUpArrowRef: React.RefObject<HTMLDivElement | null>;
    scrollDownArrowRef: React.RefObject<HTMLDivElement | null>;
} & Omit<useAnchorPositioning.ReturnValue, 'side'>;

export const SelectPositionerContext = React.createContext<SelectPositionerContextValue | undefined>(
    undefined
);

export function useSelectPositionerContext() {
    const context = React.use(SelectPositionerContext);
    if (!context) {
        throw new Error(
            'Headless UI: SelectPositionerContext is missing. SelectPositioner parts must be placed within <Select.Positioner>.'
        );
    }
    return context;
}
