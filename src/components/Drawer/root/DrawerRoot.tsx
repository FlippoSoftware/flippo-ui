import React from 'react';
import * as ReactDOM from 'react-dom';

import { DrawerRootMachine } from '@flippo-software/core-components/drawer';

import type { DrawerDirection, SnapPoint } from '@flippo-software/core-components/drawer';

import { useMachine, useStoreSelector } from '~@lib/core';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import { DialogRootContext, useDialogRootContext } from '../../Dialog/root/DialogRootContext';

import type { Dialog as DialogHeadless } from '../../Dialog';
import type { DialogRootContextValue } from '../../Dialog/root/DialogRootContext';

import { DrawerRootContext } from './DrawerRootContext';

import type { DrawerRootContextValue } from './DrawerRootContext';

/**
 * Groups all parts of the drawer.
 * Doesn't render its own HTML element.
 *
 * Drawer component with drag and drop support inspired by vaul.
 */
export function DrawerRoot(componentProps: DrawerRoot.Props) {
    const {
        children,
        open,
        defaultOpen = false,
        onOpenChange,
        onOpenChangeComplete,
        disablePointerDismissal = false,
        modal = true,
        actionsRef,
        handle,
        triggerId,
        defaultTriggerId = null,
        direction = 'down',
        shouldDrag = true,
        snapPoints,
        activeSnapPoint,
        onSnapPointChange,
        shouldScaleBackground = false,
        backgroundScale = 0.96,
        onDrag,
        onDragEnd,
        containerRef
    } = componentProps;

    const parentDialogRootContext = useDialogRootContext(true);
    const fallbackReferenceId = useHeadlessUiId();
    const floatingId = useHeadlessUiId();

    const root = useMachine(
        (options) =>
            new DrawerRootMachine(options, {
                store: handle?.store,
                parentStore: parentDialogRootContext?.store,
                fallbackReferenceId: fallbackReferenceId as string,
                floatingId,
                flushSync: ReactDOM.flushSync
            }),
        {
            open,
            defaultOpen,
            modal,
            onOpenChange: onOpenChange as never,
            onOpenChangeComplete,
            disablePointerDismissal,
            triggerId,
            defaultTriggerId,
            direction,
            shouldDrag,
            snapPoints,
            activeSnapPoint,
            onSnapPointChange,
            shouldScaleBackground,
            backgroundScale,
            onDrag,
            onDragEnd,
            containerRef
        }
    );

    React.useImperativeHandle(actionsRef, () => root.dialog.actions, [root]);

    const payload = useStoreSelector(root.store, 'payload');

    const dialogContextValue: DialogRootContextValue = React.useMemo(() => ({ store: root.store }), [root]);
    const drawerContextValue: DrawerRootContextValue = React.useMemo(() => ({ store: root.drawerStore }), [root]);

    return (
        <DialogRootContext value={dialogContextValue}>
            <DrawerRootContext value={drawerContextValue}>
                {typeof children === 'function' ? children({ payload }) : children}
            </DrawerRootContext>
        </DialogRootContext>
    );
}

export namespace DrawerRoot {
    export type Props = {
        /**
         * Direction from which the drawer opens.
         * @default 'down'
         */
        direction?: DrawerDirection;
        /**
         * Whether dragging should be enabled.
         * @default true
         */
        shouldDrag?: boolean;
        /**
         * Array of snap points for the drawer. Can be numbers (pixels) or strings (percentages).
         */
        snapPoints?: SnapPoint[];
        /**
         * Index of the currently active snap point.
         */
        activeSnapPoint?: number;
        /**
         * Event handler called when the active snap point changes.
         */
        onSnapPointChange?: (index: number) => void;
        /**
         * Whether to scale the background when the drawer is open.
         * @default false
         */
        shouldScaleBackground?: boolean;
        /**
         * The scale factor for the background when the drawer is open.
         * @default 0.96
         */
        backgroundScale?: number;
        /**
         * Event handler called during dragging.
         */
        onDrag?: (offset: number) => void;
        /**
         * Event handler called when dragging ends.
         */
        onDragEnd?: (details: { open: boolean }) => void;

        /**
         * The ref to the container element.
         *
         * @default undefined
         */
        containerRef?: React.RefObject<HTMLElement | null>;
    } & DialogHeadless.Root.Props;
}
