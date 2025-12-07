import React from 'react';

export const DialogPortalContext = React.createContext<boolean | undefined>(undefined);

export function useDialogPortalContext() {
    const value = React.use(DialogPortalContext);
    if (value === undefined) {
        throw new Error('Headless UI: <Dialog.Portal> is missing.');
    }

    return value;
}
