import React from 'react';
import * as ReactDOM from 'react-dom';

import { PopoverRootMachine } from '@flippo-software/core-components/popover';

import type { PopoverHandle } from '@flippo-software/core-components/popover';

import { useMachine, useStoreSelector } from '~@lib/core';
import { FloatingTree, useFloatingParentNodeId, useFloatingTree } from '~@lib/floating';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { PayloadChildRenderFunction } from '~@lib/popupTypes';
import type { REASONS } from '~@lib/reason';

import { PopoverRootContext, usePopoverRootContext } from './PopoverRootContext';

import type { PopoverRootContextValue } from './PopoverRootContext';

/**
 * Groups all parts of the popover.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverRoot<Payload = unknown>(props: PopoverRoot.Props<Payload>) {
    const {
        children,
        open,
        defaultOpen = false,
        onOpenChange,
        onOpenChangeComplete,
        modal = false,
        handle,
        triggerId,
        defaultTriggerId = null,
        actionsRef
    } = props;

    // Nested popovers share the floating tree of their parent popover.
    const insidePopover = usePopoverRootContext(true) != null;
    const parentTree = useFloatingTree();
    const nested = useFloatingParentNodeId() != null;
    const fallbackReferenceId = useHeadlessUiId();
    const floatingId = useHeadlessUiId();

    const root = useMachine(
        (options) =>
            new PopoverRootMachine<Payload>(options, {
                store: handle?.store,
                fallbackReferenceId: fallbackReferenceId as string,
                floatingId,
                tree: insidePopover ? parentTree : null,
                nested,
                flushSync: ReactDOM.flushSync
            }),
        {
            open,
            defaultOpen,
            onOpenChange: onOpenChange as never,
            onOpenChangeComplete,
            modal,
            triggerId,
            defaultTriggerId
        }
    );

    React.useImperativeHandle(actionsRef, () => root.actions, [root]);

    const payload = useStoreSelector(root.store, 'payload') as Payload | undefined;

    const contextValue: PopoverRootContextValue<Payload> = React.useMemo(() => ({ store: root.store }), [root]);

    return (
        <FloatingTree tree={root.tree}>
            <PopoverRootContext value={contextValue as PopoverRootContextValue<unknown>}>
                {typeof children === 'function' ? children({ payload }) : children}
            </PopoverRootContext>
        </FloatingTree>
    );
}

export type PopoverRootState = {};

export type PopoverRootProps<Payload = unknown> = {
    /**
     * Whether the popover is initially open.
     *
     * To render a controlled popover, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Whether the popover is currently open.
     */
    open?: boolean;
    /**
     * Event handler called when the popover is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: PopoverRoot.ChangeEventDetails) => void;
    /**
     * Event handler called after any animations complete when the popover is opened or closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * A ref to imperative actions.
     * - `unmount`: When specified, the popover will not be unmounted when closed.
     * Instead, the `unmount` function must be called to unmount the popover manually.
     * Useful when the popover's animation is controlled by an external library.
     */
    actionsRef?: React.RefObject<PopoverRoot.Actions | null>;
    /**
     * Determines if the popover enters a modal state when open.
     * - `true`: user interaction is limited to the popover: document page scroll is locked, and pointer interactions on outside elements are disabled.
     * - `false`: user interaction with the rest of the document is allowed.
     * - `'trap-focus'`: focus is trapped inside the popover, but document page scroll is not locked and pointer interactions outside of it remain enabled.
     * @default false
     */
    modal?: boolean | 'trap-focus';
    /**
     * ID of the trigger that the popover is associated with.
     * This is useful in conjuntion with the `open` prop to create a controlled popover.
     * There's no need to specify this prop when the popover is uncontrolled (i.e. when the `open` prop is not set).
     */
    triggerId?: string | null;
    /**
     * ID of the trigger that the popover is associated with.
     * This is useful in conjuntion with the `defaultOpen` prop to create an initially open popover.
     */
    defaultTriggerId?: string | null;
    /**
     * A handle to associate the popover with a trigger.
     * If specified, allows external triggers to control the popover's open state.
     */
    handle?: PopoverHandle<Payload>;
    /**
     * The content of the popover.
     * This can be a regular React node or a render function that receives the `payload` of the active trigger.
     */
    children?: React.ReactNode | PayloadChildRenderFunction<Payload>;
};

export type PopoverRootActions = {
    unmount: () => void;
    close: () => void;
};

export type PopoverRootChangeEventReason =
    | typeof REASONS.triggerHover
    | typeof REASONS.triggerFocus
    | typeof REASONS.triggerPress
    | typeof REASONS.outsidePress
    | typeof REASONS.escapeKey
    | typeof REASONS.closePress
    | typeof REASONS.focusOut
    | typeof REASONS.imperativeAction
    | typeof REASONS.none;
export type PopoverRootChangeEventDetails = HeadlessUIChangeEventDetails<PopoverRoot.ChangeEventReason> & {
    preventUnmountOnClose: () => void;
};

export namespace PopoverRoot {
    export type State = PopoverRootState;
    export type Props<Payload = unknown> = PopoverRootProps<Payload>;
    export type Actions = PopoverRootActions;
    export type ChangeEventReason = PopoverRootChangeEventReason;
    export type ChangeEventDetails = PopoverRootChangeEventDetails;
}
