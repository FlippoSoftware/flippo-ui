import React from 'react';

import { MenuPositionerMachine } from '@flippo-software/core-components/menu';

import type { PopupPositionerOptions } from '@flippo-software/core-components/popup';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FloatingNode } from '~@lib/floating';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuPortalContext } from '../portal/MenuPortalContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import { MenuPositionerContext } from './MenuPositionerContext';

import type { MenuPositionerContextValue } from './MenuPositionerContext';

/**
 * Positions the menu popup against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuPositioner(componentProps: MenuPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance,
        ref,
        ...elementProps
    } = componentProps;

    const { root } = useMenuRootContext();
    const keepMounted = useMenuPortalContext();
    const direction = useDirection();

    const positioner = useMachine((options) => new MenuPositionerMachine(root, options), {
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
    const state: MenuPositioner.State = useMachineState(positioner, [positioner.controller]);
    const nodeId = positioner.nodeId;

    const contextValue: MenuPositionerContextValue = React.useMemo(
        () => ({ positioner: positioner as MenuPositionerMachine<unknown>, nodeId }),
        [positioner, nodeId]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, positioner.setElement],
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <MenuPositionerContext value={contextValue}>
            {track(() => positioner.shouldRenderInternalBackdrop()) && (
                <div ref={positioner.setInternalBackdrop} {...track(() => toReactProps(positioner.getInternalBackdropProps()))} />
            )}
            {nodeId ? <FloatingNode id={nodeId}>{element}</FloatingNode> : element}
        </MenuPositionerContext>
    );
}

export type MenuPositionerState = {
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    nested: boolean;
};

export type MenuPositionerProps = useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', MenuPositioner.State>;

export namespace MenuPositioner {
    export type State = MenuPositionerState;
    export type Props = MenuPositionerProps;
}
