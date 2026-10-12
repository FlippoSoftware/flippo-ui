import React from 'react';

import type { SegmentedControlMachine } from '@flippo-software/core-components/segmented-control';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIEventReasons } from '~@lib/reason';
import type { Orientation } from '~@lib/types';

export type SegmentedControlContextValue = {
    value: string | null;
    setValue: (value: string, eventDetails: HeadlessUIChangeEventDetails<HeadlessUIEventReasons['none']>) => void;
    disabled: boolean;
    readOnly: boolean;
    orientation: Orientation;
    /**
     * The core machine of the control.
     */
    control: SegmentedControlMachine;
};

export const SegmentedControlContext = React.createContext<SegmentedControlContextValue | undefined>(undefined);

export function useSegmentedControlContext(optional: false): SegmentedControlContextValue;
export function useSegmentedControlContext(optional?: true): SegmentedControlContextValue | undefined;
export function useSegmentedControlContext(optional = true) {
    const context = React.use(SegmentedControlContext);
    if (context === undefined && !optional) {
        throw new Error(
            'Headless UI: SegmentedControlContext is missing. SegmentedControl.Item must be placed within <SegmentedControl.Root>.'
        );
    }

    return context;
}
