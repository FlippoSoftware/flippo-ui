import React from 'react';

export const SelectPortalContext = React.createContext<boolean | undefined>(undefined);

export function useSelectPortalContext() {
    const value = React.use(SelectPortalContext);

    if (value === undefined) {
        throw new Error('Headless UI: <Select.Portal> is missing.');
    }

    return value;
}
