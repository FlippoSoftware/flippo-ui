import React from 'react';

export type SelectItemContextValue = {
    selected: boolean;
    indexRef: React.RefObject<number>;
    textRef: React.RefObject<HTMLElement | null>;
    selectedByFocus: boolean;
};

export const SelectItemContext = React.createContext<SelectItemContextValue | undefined>(undefined);

export function useSelectItemContext() {
    const context = React.use(SelectItemContext);

    if (!context) {
        throw new Error(
            'Headless UI: SelectItemContext is missing. SelectItem parts must be placed within <Select.Item>.'
        );
    }
    return context;
}
