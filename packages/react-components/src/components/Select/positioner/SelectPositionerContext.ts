import React from 'react';

import type { SelectPositionerMachine } from '@flippo-software/core-components/select';

export type SelectPositionerContextValue = {
    positioner: SelectPositionerMachine;
};

export const SelectPositionerContext = React.createContext<SelectPositionerContextValue | undefined>(undefined);

export function useSelectPositionerContext() {
    const context = React.use(SelectPositionerContext);
    if (!context) {
        throw new Error(
            'Headless UI: SelectPositionerContext is missing. SelectPositioner parts must be placed within <Select.Positioner>.'
        );
    }
    return context;
}
