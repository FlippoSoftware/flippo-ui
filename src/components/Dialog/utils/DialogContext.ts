'use client';

import React from 'react';

import type { useDialogRoot } from '../root/useDialogRoot';

/**
 * Common context for dialog & dialog alert components.
 */
export type TDialogContext = {
    /**
     * Determines if the dialog is nested within a parent dialog.
     */
    nested: boolean;
    /**
     * Callback to invoke after any animations complete when the dialog is opened or closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
} & useDialogRoot.ReturnValue;

export const DialogContext = React.createContext<TDialogContext | undefined>(undefined);

export function useDialogContext() {
    return React.use(DialogContext);
}
