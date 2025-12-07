import React from 'react';

export const ComboboxPortalContext = React.createContext<boolean | undefined>(undefined);

export function useComboboxPortalContext() {
    const context = React.use(ComboboxPortalContext);
    if (context === undefined) {
        throw new Error('Headless UI: <Combobox.Portal> is missing.');
    }

    return context;
}
