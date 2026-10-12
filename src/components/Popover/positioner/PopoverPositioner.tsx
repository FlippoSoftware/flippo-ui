import React from 'react';

import { adaptiveOrigin } from '@flippo-software/core-components/floating';
import { PopoverPositionerMachine } from '@flippo-software/core-components/popover';

import type { PopoverPositionerOptions } from '@flippo-software/core-components/popover';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FloatingNode, useFloatingParentNodeId, useFloatingTree } from '~@lib/floating';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverPortalContext } from '../portal/PopoverPortalContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

import { PopoverPositionerContext } from './PopoverPositionerContext';

import type { PopoverPositionerContextValue } from './PopoverPositionerContext';

/**
 * Positions the popover against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPositioner(componentProps: PopoverPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();
    const keepMounted = usePopoverPortalContext();
    const direction = useDirection();
    const tree = useFloatingTree();
    const parentNodeId = useFloatingParentNodeId();
    const nodeId = useHeadlessUiId() as string;

    const positioner = useMachine(
        (options) => new PopoverPositionerMachine(store, { nodeId, parentNodeId, tree, adaptiveOrigin }, options),
        {
            anchor,
            positionMethod,
            side,
            align,
            sideOffset,
            alignOffset,
            collisionBoundary,
            collisionPadding,
            arrowPadding,
            sticky,
            disableAnchorTracking,
            collisionAvoidance,
            keepMounted,
            direction
        } as PopoverPositionerOptions
    );
    const track = useTracker();
    const state: PopoverPositioner.State = useMachineState(positioner, [positioner.controller]);

    const contextValue: PopoverPositionerContextValue = React.useMemo(
        () => ({ positioner: positioner as PopoverPositionerMachine<unknown> }),
        [positioner]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        ref: [ref, positioner.setElement],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <PopoverPositionerContext value={contextValue}>
            {track(() => positioner.shouldRenderInternalBackdrop()) && (
                <div
                    ref={store.context.internalBackdropRef as React.RefObject<HTMLDivElement | null>}
                    {...track(() => toReactProps(positioner.getInternalBackdropProps()))}
                />
            )}
            <FloatingNode id={nodeId}>{element}</FloatingNode>
        </PopoverPositionerContext>
    );
}

export type PopoverPositionerState = {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    /**
     * Whether CSS transitions should be disabled.
     */
    instant: string | undefined;
};

export type PopoverPositionerProps = {} & useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', PopoverPositioner.State>;

export namespace PopoverPositioner {
    export type State = PopoverPositionerState;
    export type Props = PopoverPositionerProps;
}
