import React from 'react';

import { useLazyRef } from '@flippo-ui/hooks';
import { EMPTY_OBJECT } from '~@lib/constants';
import { getEmptyContext } from '~@packages/floating-ui-react/hooks/useFloatingRootContext';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';

import { DialogStore } from '../store';

import { DialogRootContext, useDialogRootContext } from './DialogRootContext';
import { useDialogRoot } from './useDialogRoot';

import type { DialogRootContextValue } from './DialogRootContext';

const INITIAL_STATE = {
    open: false,
    dismissible: true,
    nested: false,
    popupElement: null,
    triggerElement: null,
    modal: true,
    descriptionElementId: undefined,
    titleElementId: undefined,
    openMethod: null,
    mounted: false,
    transitionStatus: 'idle',
    nestedOpenDialogCount: 0,
    triggerProps: EMPTY_OBJECT,
    popupProps: EMPTY_OBJECT,
    floatingRootContext: getEmptyContext()
} as const;

/**
 * Groups all parts of the dialog.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogRoot(componentProps: DialogRoot.Props) {
    const {
        children,
        defaultOpen: defaultOpenProp = false,
        dismissible = true,
        modal = true,
        onOpenChange,
        open: openProp,
        actionsRef,
        onOpenChangeComplete
    } = componentProps;

    const parentDialogRootContext = useDialogRootContext(true);
    const nested = Boolean(parentDialogRootContext);

    const store = useLazyRef(DialogStore.create, INITIAL_STATE).current;

    store.useControlledProp('open', openProp, defaultOpenProp);
    store.useSyncedValues({ dismissible, nested, modal });
    store.useContextCallback('openChange', onOpenChange);
    store.useContextCallback('openChangeComplete', onOpenChangeComplete);

    useDialogRoot({
        store,
        actionsRef,
        parentContext: parentDialogRootContext?.store.context,
        onOpenChange
    });

    const contextValue: DialogRootContextValue = React.useMemo(() => ({ store }), [store]);

    return <DialogRootContext value={contextValue}>{children}</DialogRootContext>;
}

export namespace DialogRoot {
    export type Props = {
        children?: React.ReactNode;
        /**
         * Whether the dialog is currently open.
         */
        open?: boolean;
        /**
         * Whether the dialog is initially open.
         *
         * To render a controlled dialog, use the `open` prop instead.
         * @default false
         */
        defaultOpen?: boolean;
        /**
         * Determines if the dialog enters a modal state when open.
         * - `true`: user interaction is limited to just the dialog: focus is trapped, document page scroll is locked, and pointer interactions on outside elements are disabled.
         * - `false`: user interaction with the rest of the document is allowed.
         * - `'trap-focus'`: focus is trapped inside the dialog, but document page scroll is not locked and pointer interactions outside of it remain enabled.
         * @default true
         */
        modal?: boolean | 'trap-focus';
        /**
         * Event handler called when the dialog is opened or closed.
         */
        onOpenChange?: (open: boolean, eventDetails: DialogRoot.ChangeEventDetails) => void;
        /**
         * Event handler called after any animations complete when the dialog is opened or closed.
         */
        onOpenChangeComplete?: (open: boolean) => void;
        /**
         * Determines whether the dialog should close on outside clicks.
         * @default true
         */
        dismissible?: boolean;
        /**
         * A ref to imperative actions.
         * - `unmount`: When specified, the dialog will not be unmounted when closed.
         * Instead, the `unmount` function must be called to unmount the dialog manually.
         * Useful when the dialog's animation is controlled by an external library.
         */
        actionsRef?: React.RefObject<DialogRoot.Actions>;
    };

    export type Actions = {
        unmount: () => void;
    };

    export type ChangeEventReason
        = | 'trigger-press'
          | 'outside-press'
          | 'escape-key'
          | 'close-press'
          | 'focus-out'
          | 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
