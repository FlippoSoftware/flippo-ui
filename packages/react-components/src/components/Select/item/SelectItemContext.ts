import React from 'react';

import type { SelectItemMachine } from '@flippo-software/core-components/select';

export type SelectItemContextValue = {
    item: SelectItemMachine;
    selected: boolean;
};

export const SelectItemContext = React.createContext<SelectItemContextValue | undefined>(undefined);

export function useSelectItemContext() {
    const context = React.use(SelectItemContext);
    if (!context) {
        throw new Error('Headless UI: SelectItemContext is missing. SelectItem parts must be placed within <Select.Item>.');
    }

    return context;
}
