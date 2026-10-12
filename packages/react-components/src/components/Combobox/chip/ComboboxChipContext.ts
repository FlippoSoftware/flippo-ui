import React from 'react';

import type { ComboboxChipMachine } from '@flippo-software/core-components/combobox';

export type ComboboxChipContextValue = {
    chip: ComboboxChipMachine;
    index: number;
};

export const ComboboxChipContext = React.createContext<ComboboxChipContextValue | undefined>(undefined);

export function useComboboxChipContext() {
    const context = React.use(ComboboxChipContext);
    if (!context) {
        throw new Error('useComboboxChipContext must be used within a ComboboxChip');
    }
    return context;
}
