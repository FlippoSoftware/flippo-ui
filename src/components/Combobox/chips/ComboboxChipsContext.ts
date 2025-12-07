import React from 'react';

export type ComboboxChipsContextValue = {
    highlightedChipIndex: number | undefined;
    setHighlightedChipIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
    chipsRef: React.RefObject<Array<HTMLButtonElement | null>>;
};

export const ComboboxChipsContext = React.createContext<ComboboxChipsContextValue | undefined>(
    undefined
);

export function useComboboxChipsContext() {
    return React.use(ComboboxChipsContext);
}
