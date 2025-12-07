import React from 'react';

export type ComboboxGroupContextValue = {
    labelId: string | undefined;
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    /**
     * Optional list of items that belong to this group. Used by nested
     * collections to render group-specific items.
     */
    items?: readonly any[];
};

export const ComboboxGroupContext = React.createContext<ComboboxGroupContextValue | undefined>(
    undefined
);

export function useComboboxGroupContext() {
    const context = React.use(ComboboxGroupContext);
    if (context === undefined) {
        throw new Error(
            'Headless UI: ComboboxGroupContext is missing. ComboboxGroup parts must be placed within <Combobox.Group>.'
        );
    }
    return context;
}
