import React from 'react';

export const ComboboxRowContext = React.createContext(false);

export function useComboboxRowContext() {
    return React.use(ComboboxRowContext);
}
