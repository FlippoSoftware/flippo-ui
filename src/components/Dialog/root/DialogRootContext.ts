'use client';

import React from 'react';

import { DialogContext } from '../utils/DialogContext';

export type TDialogRootContext = {
    /**
     * Determines whether the dialog should close on outside clicks.
     */
    dismissible: boolean;
};

export const DialogRootContext = React.createContext<TDialogRootContext | undefined>(undefined);

export function useOptionalDialogRootContext() {
    const dialogRootContext = React.use(DialogRootContext);
    const dialogContext = React.use(DialogContext);

    if (dialogContext === undefined && dialogRootContext === undefined) {
        return undefined;
    }

    return {
        ...dialogRootContext,
        ...dialogContext
    };
}

export function useDialogRootContext() {
    const dialogRootContext = React.use(DialogRootContext);
    const dialogContext = React.use(DialogContext);

    if (dialogContext === undefined) {
        throw new Error(
            'Headless UI: DialogRootContext is missing. Dialog parts must be placed within <Dialog.Root>.'
        );
    }

    return {
        ...dialogRootContext,
        ...dialogContext
    };
}
