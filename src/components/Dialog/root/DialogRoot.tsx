'use client';

import React from 'react';

import type { TBaseOpenChangeReason } from '@lib/translateOpenChangeReason';

import { DialogContext } from '../utils/DialogContext';

import { DialogRootContext, useOptionalDialogRootContext } from './DialogRootContext';
import { useDialogRoot } from './useDialogRoot';

/**
 * Groups all parts of the dialog.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogRoot(componentProps: DialogRoot.Props) {
    const {
        children,
        defaultOpen = false,
        dismissible = true,
        modal = true,
        onOpenChange,
        open,
        actionsRef,
        onOpenChangeComplete
    } = componentProps;

    const parentDialogRootContext = useOptionalDialogRootContext();

    const dialogRoot = useDialogRoot({
        open,
        defaultOpen,
        onOpenChange,
        modal,
        dismissible,
        actionsRef,
        onOpenChangeComplete,
        onNestedDialogClose: parentDialogRootContext?.onNestedDialogClose,
        onNestedDialogOpen: parentDialogRootContext?.onNestedDialogOpen
    });

    const nested = Boolean(parentDialogRootContext);

    const dialogContextValue = React.useMemo(
        () => ({
            ...dialogRoot,
            nested,
            onOpenChangeComplete
        }),
        [dialogRoot, nested, onOpenChangeComplete]
    );
    const dialogRootContextValue = React.useMemo(() => ({ dismissible }), [dismissible]);

    return (
        <DialogContext value={dialogContextValue}>
            <DialogRootContext value={dialogRootContextValue}>
                {children}
            </DialogRootContext>
        </DialogContext>
    );
}

export namespace DialogRoot {
    export type Props = {
        children?: React.ReactNode;
    } & useDialogRoot.SharedParameters;

    export type Actions = {
        unmount: () => void;
    };

    export type OpenChangeReason = TBaseOpenChangeReason | 'close-press';
}
