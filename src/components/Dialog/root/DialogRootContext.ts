import React from 'react';

import type { DialogStore } from '../store';

export type DialogRootContextValue = {
    store: DialogStore;
};

export const DialogRootContext = React.createContext<DialogRootContextValue | undefined>(undefined);

export function useDialogRootContext(optional?: false): DialogRootContextValue;
export function useDialogRootContext(optional: true): DialogRootContextValue | undefined;
export function useDialogRootContext(optional?: boolean) {
    const dialogRootContext = React.use(DialogRootContext);

    if (optional === false && dialogRootContext === undefined) {
        throw new Error(
            'Base UI: DialogRootContext is missing. Dialog parts must be placed within <Dialog.Root>.'
        );
    }

    return dialogRootContext;
}
