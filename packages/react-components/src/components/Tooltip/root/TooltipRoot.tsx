import React from 'react';
import * as ReactDOM from 'react-dom';

import { TooltipRootMachine } from '@flippo-software/core-components/tooltip';

import type { TooltipHandle } from '@flippo-software/core-components/tooltip';

import { useMachine, useStoreSelector } from '~@lib/core';
import { useFloatingTree } from '~@lib/floating';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { PayloadChildRenderFunction } from '~@lib/popupTypes';
import type { REASONS } from '~@lib/reason';

import { useTooltipMultipleContext } from '../multiple/TooltipMultipleContext';

import { TooltipRootContext } from './TooltipRootContext';

export function TooltipRoot<Payload>(props: TooltipRoot.Props<Payload>) {
    const {
        disabled: disabledProp,
        defaultOpen = false,
        open,
        disableHoverablePopup = false,
        trackCursorAxis = 'none',
        actionsRef,
        onOpenChange,
        onOpenChangeComplete,
        handle,
        triggerId,
        defaultTriggerId = null,
        children
    } = props;

    const multiple = useTooltipMultipleContext();
    const tree = useFloatingTree();
    const floatingId = useHeadlessUiId();

    const root = useMachine(
        (options) =>
            new TooltipRootMachine<Payload>(options, {
                store: handle?.store,
                multiple,
                floatingId,
                tree,
                flushSync: ReactDOM.flushSync
            }),
        {
            disabled: disabledProp ?? false,
            defaultOpen,
            open,
            disableHoverablePopup,
            trackCursorAxis,
            onOpenChange: onOpenChange as never,
            onOpenChangeComplete,
            triggerId,
            defaultTriggerId
        }
    );

    React.useImperativeHandle(actionsRef, () => root.actions, [root]);

    const payload = useStoreSelector(root.store, 'payload') as Payload | undefined;

    return (
        <TooltipRootContext value={root as TooltipRootMachine<unknown>}>
            {/* Hidden marker registering the tooltip in the list of Tooltip.Multiple */}
            {root.isInsideMultiple && <span ref={root.setMultipleItemElement} style={root.multipleMarkerStyle} />}
            {typeof children === 'function' ? children({ payload }) : children}
        </TooltipRootContext>
    );
}

export type TooltipRootState = {};

export type TooltipRootProps<Payload = unknown> = {
    /**
     * Whether the tooltip is initially open.
     *
     * To render a controlled tooltip, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Whether the tooltip is currently open.
     */
    open?: boolean;
    /**
     * Event handler called when the tooltip is opened or closed.
     */
    onOpenChange?: (open: boolean, eventDetails: TooltipRoot.ChangeEventDetails) => void;
    /**
     * Event handler called after any animations complete when the tooltip is opened or closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * Whether the tooltip contents can be hovered without closing the tooltip.
     * @default false
     */
    disableHoverablePopup?: boolean;
    /**
     * Determines which axis the tooltip should track the cursor on.
     * @default 'none'
     */
    trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
    /**
     * A ref to imperative actions.
     * - `unmount`: When specified, the tooltip will not be unmounted when closed.
     * Instead, the `unmount` function must be called to unmount the tooltip manually.
     * Useful when the tooltip's animation is controlled by an external library.
     */
    actionsRef?: React.RefObject<TooltipRoot.Actions>;
    /**
     * Whether the tooltip is disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * A handle to associate the tooltip with a trigger.
     * If specified, allows external triggers to control the tooltip's open state.
     * Can be created with the Tooltip.createHandle() method.
     */
    handle?: TooltipHandle<Payload>;
    /**
     * The content of the tooltip.
     * This can be a regular React node or a render function that receives the `payload` of the active trigger.
     */
    children?: React.ReactNode | PayloadChildRenderFunction<Payload>;
    /**
     * ID of the trigger that the tooltip is associated with.
     * This is useful in conjuntion with the `open` prop to create a controlled tooltip.
     * There's no need to specify this prop when the tooltip is uncontrolled (i.e. when the `open` prop is not set).
     */
    triggerId?: string | null;
    /**
     * ID of the trigger that the tooltip is associated with.
     * This is useful in conjunction with the `defaultOpen` prop to create an initially open tooltip.
     */
    defaultTriggerId?: string | null;
};

export type TooltipRootActions = {
    unmount: () => void;
    close: () => void;
};

export type TooltipRootChangeEventReason =
    | typeof REASONS.triggerHover
    | typeof REASONS.triggerFocus
    | typeof REASONS.triggerPress
    | typeof REASONS.outsidePress
    | typeof REASONS.escapeKey
    | typeof REASONS.disabled
    | typeof REASONS.imperativeAction
    | typeof REASONS.none;

export type TooltipRootChangeEventDetails = HeadlessUIChangeEventDetails<TooltipRoot.ChangeEventReason> & {
    preventUnmountOnClose: () => void;
    multipleItemIndex?: number | null;
};

export namespace TooltipRoot {
    export type State = TooltipRootState;
    export type Props<Payload = unknown> = TooltipRootProps<Payload>;
    export type Actions = TooltipRootActions;
    export type ChangeEventReason = TooltipRootChangeEventReason;
    export type ChangeEventDetails = TooltipRootChangeEventDetails;
}
