import React from 'react';

export type ComboboxItemContextValue = {
    selected: boolean;
    textRef: React.RefObject<HTMLElement | null>;
};

export const ComboboxItemContext = React.createContext<ComboboxItemContextValue | undefined>(undefined);

export function useComboboxItemContext() {
    const context = React.use(ComboboxItemContext);
    if (!context) {
        throw new Error(
            'Headless UI: ComboboxItemContext is missing. ComboboxItem parts must be placed within <Combobox.Item>.'
        );
    }
    return context;
}
