import React from 'react';

export type ComboboxChipContextValue = {
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
