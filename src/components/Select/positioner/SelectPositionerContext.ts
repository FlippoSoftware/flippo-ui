'use client';

import React from 'react';

import type { TSide, useAnchorPositioning } from '@lib/hooks';

export type TSelectPositionerContext = {
    side: 'none' | TSide;
    alignItemWithTriggerActive: boolean;
    setControlledAlignItemWithTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    scrollUpArrowRef: React.RefObject<HTMLDivElement | null>;
    scrollDownArrowRef: React.RefObject<HTMLDivElement | null>;
} & Omit<useAnchorPositioning.ReturnValue, 'side'>;

export const SelectPositionerContext = React.createContext<TSelectPositionerContext | undefined>(
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
