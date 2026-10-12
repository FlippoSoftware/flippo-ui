import React from 'react';

import { TooltipPositionerMachine } from '@flippo-software/core-components/tooltip';

import type { PopupPositionerOptions } from '@flippo-software/core-components/popup';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipPortalContext } from '../portal/TooltipPortalContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPositionerContext } from './TooltipPositionerContext';

import type { TooltipPositionerContextValue } from './TooltipPositionerContext';

/**
 * Positions the tooltip against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tooltip](https://base-ui.com/react/components/tooltip)
 */
export function TooltipPositioner(componentProps: TooltipPositionerProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod = 'absolute',
        side = 'top',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance,
        ref,
        ...elementProps
    } = componentProps;

    const root = useTooltipRootContext();
    const keepMounted = useTooltipPortalContext();
    const direction = useDirection();

    const positioner = useMachine((options) => new TooltipPositionerMachine(root, options), {
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
    } as PopupPositionerOptions);
    const track = useTracker();
    const state: TooltipPositioner.State = useMachineState(positioner, [positioner.controller]);

    const contextValue: TooltipPositionerContextValue = React.useMemo(
        () => ({ positioner: positioner as TooltipPositionerMachine<unknown> }),
        [positioner]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        ref: [ref, positioner.setElement],
        customStyleHookMapping: popupStateMapping
    });

    return <TooltipPositionerContext value={contextValue}>{element}</TooltipPositionerContext>;
}

export type TooltipPositionerState = {
    /**
     * Whether the tooltip is currently open.
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

export type TooltipPositionerProps = {
    /**
     * Which side of the anchor element to align the popup against.
     * May automatically change to avoid collisions.
     * @default 'top'
     */
    side?: Side;
} & HeadlessUIComponentProps<'div', TooltipPositioner.State> &
    Omit<useAnchorPositioning.SharedParameters, 'side'>;

export namespace TooltipPositioner {
    export type State = TooltipPositionerState;
    export type Props = TooltipPositionerProps;
}
