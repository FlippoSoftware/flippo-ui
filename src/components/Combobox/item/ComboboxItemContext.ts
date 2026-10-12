import React from 'react';

import type { ComboboxItemMachine } from '@flippo-software/core-components/combobox';

export type ComboboxItemContextValue = {
    item: ComboboxItemMachine;
    selected: boolean;
};

export const ComboboxItemContext = React.createContext<ComboboxItemContextValue | undefined>(undefined);

export function useComboboxItemContext() {
    const context = React.use(ComboboxItemContext);
    if (!context) {
        throw new Error('Headless UI: ComboboxItemContext is missing. ComboboxItem parts must be placed within <Combobox.Item>.');
    }
    return context;
}
