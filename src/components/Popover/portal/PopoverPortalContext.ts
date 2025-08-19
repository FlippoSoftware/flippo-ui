'use client';

import React from 'react';

export const PopoverPortalContext = React.createContext<boolean | undefined>(undefined);

export function usePopoverPortalContext() {
    const value = React.use(PopoverPortalContext);

    if (value === undefined) {
        throw new Error('Headless UI: <Popover.Portal> is missing.');
    }
    return value;
}
